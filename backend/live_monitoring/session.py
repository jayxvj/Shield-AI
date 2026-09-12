"""
Session manager — ties together capture, feature extraction, and ML scoring.
Maintains a rolling window of processed alerts and stats.
"""
from __future__ import annotations

import logging
import threading
import time
from collections import deque
from datetime import datetime, timedelta
from typing import Deque, List, Optional

from backend.live_monitoring.capture import RawFlow, get_capture_session
from backend.live_monitoring.feature_extractor import extract_features
from backend.live_monitoring.ml_scorer import score_flow
from backend.live_monitoring.schemas import LiveAlert, LiveStats

logger = logging.getLogger(__name__)

# How many seconds of timeline buckets to keep
TIMELINE_WINDOW_SEC = 60
# Max recent alerts to keep in memory
MAX_RECENT_ALERTS = 200


class MonitoringSession:
    """
    Runs a background processing thread that:
    1. Drains completed flows from the FlowTable every second.
    2. Extracts features from each flow.
    3. Scores each flow through the ML scorer.
    4. Accumulates results for the stats/alerts endpoints.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._processor_thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._recent_alerts: Deque[LiveAlert] = deque(maxlen=MAX_RECENT_ALERTS)
        self._timeline: Deque[dict] = deque(maxlen=TIMELINE_WINDOW_SEC)
        self._total_flows_processed = 0
        self._last_window_flows = 0
        self._last_window_ts = time.time()

    def start_processor(self) -> None:
        """Start the background flow-processing thread."""
        if self._processor_thread and self._processor_thread.is_alive():
            return
        self._stop_event.clear()
        self._processor_thread = threading.Thread(
            target=self._process_loop,
            daemon=True,
            name="live-monitor-processor",
        )
        self._processor_thread.start()
        logger.info("Live monitoring session processor started")

    def stop_processor(self) -> None:
        """Stop the background processor thread."""
        self._stop_event.set()
        logger.info("Live monitoring session processor stopped")

    def _process_loop(self) -> None:
        capture = get_capture_session()
        bucket_ts = time.time()
        bucket_normal = 0
        bucket_suspicious = 0

        while not self._stop_event.is_set():
            time.sleep(1)
            try:
                flows: List[RawFlow] = capture.flow_table.drain_completed()
                for flow in flows:
                    try:
                        feat = extract_features(flow)
                        alert = score_flow(feat)
                        with self._lock:
                            self._total_flows_processed += 1
                            self._recent_alerts.appendleft(alert)
                            if alert.is_attack:
                                bucket_suspicious += 1
                            else:
                                bucket_normal += 1
                    except Exception as e:
                        logger.debug("Flow processing error (non-critical): %s", e)

                # Emit a timeline bucket every second
                now = time.time()
                with self._lock:
                    self._timeline.append({
                        "time": datetime.utcnow().strftime("%H:%M:%S"),
                        "normal": bucket_normal,
                        "suspicious": bucket_suspicious,
                    })
                bucket_normal = 0
                bucket_suspicious = 0

            except Exception as e:
                logger.warning("Monitoring processor iteration error: %s", e)

    def get_stats(self) -> LiveStats:
        capture = get_capture_session()
        with self._lock:
            alerts_list = list(self._recent_alerts)[:50]
            timeline = list(self._timeline)[-60:]
            total_flows = self._total_flows_processed

        elapsed = capture.flow_table.elapsed_seconds
        pkts = capture.flow_table.packet_count
        pps = pkts / elapsed if elapsed > 0 else 0.0
        fps = total_flows / elapsed if elapsed > 0 else 0.0

        normal = sum(1 for a in alerts_list if not a.is_attack)
        suspicious = sum(1 for a in alerts_list if a.is_attack)
        total = normal + suspicious

        anomaly_rate = (suspicious / total * 100) if total > 0 else 0.0

        top_attack = None
        if suspicious > 0:
            attack_types = [a.attack_type for a in alerts_list if a.is_attack]
            if attack_types:
                top_attack = max(set(attack_types), key=attack_types.count)

        risk_score = 0
        if alerts_list:
            risk_score = int(sum(a.risk_score for a in alerts_list[:10]) / min(len(alerts_list), 10))

        return LiveStats(
            window_seconds=TIMELINE_WINDOW_SEC,
            total_flows=total_flows,
            normal_flows=normal,
            suspicious_flows=suspicious,
            packets_per_second=round(pps, 1),
            flows_per_second=round(fps, 2),
            top_attack_type=top_attack,
            current_risk_score=risk_score,
            anomaly_rate_pct=round(anomaly_rate, 1),
            recent_alerts=alerts_list,
            timeline=timeline,
        )

    def get_recent_alerts(self, limit: int = 50) -> List[LiveAlert]:
        with self._lock:
            return list(self._recent_alerts)[:limit]

    def clear(self) -> None:
        with self._lock:
            self._recent_alerts.clear()
            self._timeline.clear()
            self._total_flows_processed = 0


# Module-level singleton
_session = MonitoringSession()


def get_session() -> MonitoringSession:
    return _session
