"""
Shield-AI v2 Live Monitoring Router.
Provides:
- Ingestion endpoint for remote/local sensor agents with AWS S3 archival
- Server-Sent Events (SSE) stream for real-time live monitor feeds
- Live stats aggregation
- Historical alert queries with S3 references
- System health & deployment diagnostic checks
"""
from __future__ import annotations

import asyncio
import json
import logging
import time
from collections import deque
from datetime import datetime
from typing import Any, AsyncGenerator, Deque, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, Header, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import get_db
from backend.models import LiveAlertRecord
from backend.s3_writer import archive_malicious_record, check_s3_health

router = APIRouter()
logger = logging.getLogger(__name__)

# --- In-Memory Real-Time State & SSE Broadcast ---
_MAX_BUFFER = 200
_recent_alerts: Deque[Dict[str, Any]] = deque(maxlen=_MAX_BUFFER)
_timeline: Deque[Dict[str, Any]] = deque(maxlen=60)
_sse_subscribers: List[asyncio.Queue] = []
_last_sensor_ping: float = 0.0
_sensor_id: str = "offline"
_total_ingested: int = 0
_total_s3_archived: int = 0


class IngestBatchRequest(BaseModel):
    sensor_id: str = Field(default="sensor-default", description="Identifier of the capture agent")
    batch: List[Dict[str, Any]] = Field(..., description="List of scored LiveAlert flow dictionaries")


def _broadcast_to_sse(alert_data: Dict[str, Any]) -> None:
    """Push new alert to all active SSE browser connections."""
    global _sse_subscribers
    dead_queues = []
    payload = json.dumps(alert_data, default=str)
    for q in _sse_subscribers:
        try:
            q.put_nowait(payload)
        except asyncio.QueueFull:
            dead_queues.append(q)
        except Exception:
            dead_queues.append(q)
    for dq in dead_queues:
        if dq in _sse_subscribers:
            _sse_subscribers.remove(dq)


@router.post("/ingest", status_code=status.HTTP_200_OK)
async def ingest_sensor_batch(
    payload: IngestBatchRequest,
    background_tasks: BackgroundTasks,
    x_sensor_key: Optional[str] = Header(None, alias="X-Sensor-Key"),
    db: Session = Depends(get_db),
):
    """
    Ingest a batch of scored flows from sensor agent.
    - Persists records to DB
    - Asynchronously archives every malicious flow to AWS S3
    - Broadcasts to live SSE subscribers
    """
    global _last_sensor_ping, _sensor_id, _total_ingested, _total_s3_archived

    # Validate Sensor Key if configured
    if settings.SENSOR_API_KEY and x_sensor_key:
        if x_sensor_key != settings.SENSOR_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid sensor authentication key.",
            )

    _last_sensor_ping = time.time()
    _sensor_id = payload.sensor_id

    archived_keys = []
    normal_count = 0
    attack_count = 0

    for item in payload.batch:
        _total_ingested += 1
        is_attack = item.get("is_attack", False)
        s3_meta = None

        if is_attack:
            attack_count += 1
            # Archive malicious activity record to AWS S3 (synchronously or via task)
            # In order to store the s3_key in the DB record right away, we invoke archival
            s3_meta = archive_malicious_record(item)
            if s3_meta.get("s3_key"):
                archived_keys.append(s3_meta["s3_key"])
                _total_s3_archived += 1
        else:
            normal_count += 1

        # Enrich alert item with S3 archival metadata
        item["s3_key"] = s3_meta.get("s3_key") if s3_meta else None
        item["s3_storage"] = s3_meta.get("storage") if s3_meta else None
        item["s3_url"] = s3_meta.get("url") if s3_meta else None

        # Store in database
        try:
            db_record = LiveAlertRecord(
                alert_id=item.get("alert_id", f"LM-{int(time.time()*1000)%100000:05d}"),
                source_ip=item.get("source_ip", "0.0.0.0"),
                destination_ip=item.get("destination_ip", "0.0.0.0"),
                source_port=item.get("source_port", 0),
                destination_port=item.get("destination_port", 0),
                protocol=item.get("protocol", "TCP"),
                attack_type=item.get("attack_type", "BENIGN"),
                severity=item.get("severity", "LOW"),
                risk_score=item.get("risk_score", 0),
                anomaly_score=item.get("anomaly_score", 0.0),
                confidence=item.get("confidence", 0.0),
                is_attack=is_attack,
                s3_key=item["s3_key"],
                s3_storage=item["s3_storage"],
                raw_payload=json.dumps(item, default=str),
            )
            db.add(db_record)
        except Exception as e:
            logger.error("DB error saving alert record: %s", e)

        # Update in-memory deque & broadcast
        _recent_alerts.appendleft(item)
        _broadcast_to_sse(item)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error("DB commit failed: %s", e)

    # Append to rolling timeline
    _timeline.append({
        "time": datetime.utcnow().strftime("%H:%M:%S"),
        "normal": normal_count,
        "suspicious": attack_count,
    })

    return {
        "status": "success",
        "accepted": len(payload.batch),
        "malicious_archived": attack_count,
        "s3_keys": archived_keys,
    }


@router.get("/stream")
async def stream_live_events():
    """
    Server-Sent Events (SSE) stream.
    Browser connects once: new live alerts are pushed instantly in real-time.
    """
    queue: asyncio.Queue = asyncio.Queue(maxsize=100)
    _sse_subscribers.append(queue)

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # Yield initial connection confirmation
            yield f"event: connected\ndata: {json.dumps({'message': 'Connected to Shield-AI live event stream'})}\n\n"
            while True:
                try:
                    # Wait for next alert with a timeout for heartbeat ping
                    data = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"event: alert\ndata: {data}\n\n"
                except asyncio.TimeoutError:
                    # Heartbeat keepalive
                    yield f": heartbeat {int(time.time())}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            if queue in _sse_subscribers:
                _sse_subscribers.remove(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/stats")
async def get_live_stats():
    """
    Returns rolling window statistics for the live monitor dashboard.
    """
    now = time.time()
    sensor_connected = (now - _last_sensor_ping) < 45.0 if _last_sensor_ping > 0 else False

    alerts_list = list(_recent_alerts)
    suspicious = [a for a in alerts_list if a.get("is_attack")]
    normal = [a for a in alerts_list if not a.get("is_attack")]
    total = len(alerts_list)

    top_attack = None
    if suspicious:
        types = [a.get("attack_type", "Unknown") for a in suspicious]
        top_attack = max(set(types), key=types.count)

    risk_score = 0
    if alerts_list:
        risk_score = int(sum(a.get("risk_score", 0) for a in alerts_list[:15]) / min(len(alerts_list), 15))

    anomaly_rate = round((len(suspicious) / total * 100), 1) if total > 0 else 0.0

    return {
        "sensor_connected": sensor_connected,
        "sensor_id": _sensor_id,
        "last_sensor_ping": datetime.utcfromtimestamp(_last_sensor_ping).isoformat() if _last_sensor_ping > 0 else None,
        "total_flows": total,
        "normal_flows": len(normal),
        "suspicious_flows": len(suspicious),
        "packets_per_second": round(sum(a.get("packets_in_flow", 1) for a in alerts_list[:10]) / 5.0, 1) if alerts_list else 0.0,
        "flows_per_second": round(len(alerts_list) / 10.0, 1),
        "top_attack_type": top_attack or "None",
        "current_risk_score": risk_score,
        "anomaly_rate_pct": anomaly_rate,
        "total_s3_archived": _total_s3_archived,
        "s3_bucket": settings.S3_BUCKET,
        "timeline": list(_timeline)[-30:],
    }


@router.get("/alerts")
async def get_recent_alerts(
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Retrieve the most recent live alerts.
    Pulls from in-memory deque if populated, otherwise queries PostgreSQL/SQLite.
    """
    if len(_recent_alerts) > 0:
        return list(_recent_alerts)[:limit]

    # Fallback to database
    records = db.query(LiveAlertRecord).order_by(LiveAlertRecord.timestamp.desc()).limit(limit).all()
    results = []
    for r in records:
        if r.raw_payload:
            try:
                results.append(json.loads(r.raw_payload))
                continue
            except Exception:
                pass
        results.append({
            "alert_id": r.alert_id,
            "timestamp": r.timestamp.isoformat() if r.timestamp else datetime.utcnow().isoformat(),
            "source_ip": r.source_ip,
            "destination_ip": r.destination_ip,
            "source_port": r.source_port,
            "destination_port": r.destination_port,
            "protocol": r.protocol,
            "attack_type": r.attack_type,
            "severity": r.severity,
            "risk_score": r.risk_score,
            "anomaly_score": r.anomaly_score,
            "confidence": r.confidence,
            "is_attack": r.is_attack,
            "s3_key": r.s3_key,
            "s3_storage": r.s3_storage,
            "recommended_actions": [f"Block {r.source_ip} on perimeter firewall", "Inspect payload in S3 archive"],
            "human_explanation": f"Detected {r.attack_type} pattern targeting {r.destination_ip}:{r.destination_port}",
        })
    return results


@router.get("/health")
async def system_health_check(db: Session = Depends(get_db)):
    """
    Deployment verification health check.
    Confirms backend status, database connection, S3 connectivity, and sensor status.
    """
    db_ok = False
    try:
        # Check database connection
        db.execute(LiveAlertRecord.__table__.select().limit(1))
        db_ok = True
    except Exception as e:
        logger.error("DB health check error: %s", e)

    s3_status = check_s3_health()

    now = time.time()
    sensor_connected = (now - _last_sensor_ping) < 45.0 if _last_sensor_ping > 0 else False

    return {
        "status": "operational" if db_ok else "degraded",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "db": "ok" if db_ok else "error",
        "s3": s3_status,
        "sensor_connected": sensor_connected,
        "last_sensor_ping": datetime.utcfromtimestamp(_last_sensor_ping).isoformat() if _last_sensor_ping > 0 else None,
        "total_ingested_flows": _total_ingested,
        "total_malicious_archived": _total_s3_archived,
    }


@router.post("/simulate-flow")
async def simulate_flow(
    is_attack: bool = Query(default=True),
    attack_type: str = Query(default="DoS"),
    db: Session = Depends(get_db),
):
    """
    Testing helper endpoint: injects a test flow and archives malicious records to S3.
    Enables immediate testing of live monitor & S3 archival without running external scripts.
    """
    import random
    alert_id = f"LM-{random.randint(10000, 99999)}"
    source_ip = f"192.168.1.{random.randint(2, 254)}" if not is_attack else f"45.{random.randint(10, 200)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
    risk_score = random.randint(75, 98) if is_attack else random.randint(5, 25)
    severity = "CRITICAL" if risk_score >= 80 else ("HIGH" if risk_score >= 60 else "LOW")

    alert_obj = {
        "alert_id": alert_id,
        "timestamp": datetime.utcnow().isoformat(),
        "source_ip": source_ip,
        "destination_ip": "10.0.0.1",
        "source_port": random.randint(1024, 65535),
        "destination_port": 80 if attack_type == "DoS" else (22 if attack_type == "Brute Force" else 443),
        "protocol": "TCP",
        "flow_duration_ms": random.randint(10, 500),
        "bytes_transferred": random.randint(1000, 500000),
        "packets_in_flow": random.randint(50, 1200) if is_attack else random.randint(5, 30),
        "is_attack": is_attack,
        "attack_type": attack_type if is_attack else "BENIGN",
        "confidence": round(random.uniform(85.0, 99.5), 1) if is_attack else 95.0,
        "risk_score": risk_score,
        "anomaly_score": round(random.uniform(0.7, 0.98), 3) if is_attack else 0.05,
        "severity": severity,
        "shap_features": [
            {"feature": "flow_packets_per_sec", "display_name": "Flow Packets/s", "impact": 0.42, "impact_pct": 42},
            {"feature": "flow_bytes_per_sec", "display_name": "Flow Bytes/s", "impact": 0.28, "impact_pct": 28},
            {"feature": "flow_iat_mean", "display_name": "IAT Mean (us)", "impact": 0.18, "impact_pct": 18},
            {"feature": "avg_packet_size", "display_name": "Avg Packet Size", "impact": 0.12, "impact_pct": 12},
        ],
        "human_explanation": f"Automated simulation flagged {attack_type} activity originating from {source_ip}.",
        "recommended_actions": [
            f"Apply rate limiting for source {source_ip}",
            "Block IP at border firewall",
            "Verify packet trace in S3 archive",
        ],
    }

    mock_req = IngestBatchRequest(sensor_id="manual-test-simulator", batch=[alert_obj])
    bg = BackgroundTasks()
    res = await ingest_sensor_batch(payload=mock_req, background_tasks=bg, db=db)
    return {"message": "Flow simulated and processed", "alert": alert_obj, "ingest_result": res}
