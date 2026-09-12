"""
FastAPI router for Live Monitoring.
All endpoints are under /api/live-monitoring — no existing routes are touched.

If the live monitoring module fails to load (e.g. Scapy install issue)
the router returns graceful 503 responses rather than crashing the app.
"""
from __future__ import annotations

import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status

from backend.live_monitoring.capture import CaptureUnavailableError, get_capture_session
from backend.live_monitoring.interfaces import list_interfaces
from backend.live_monitoring.schemas import (
    LiveAlert,
    LiveStats,
    MonitoringStatus,
    NetworkInterface,
    StartCaptureRequest,
)
from backend.live_monitoring.session import get_session

router = APIRouter()
logger = logging.getLogger(__name__)

# Feature flag — set to False to disable the entire live-monitoring feature
LIVE_MONITORING_ENABLED: bool = True


def _require_enabled() -> None:
    if not LIVE_MONITORING_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Live monitoring is currently disabled via feature flag.",
        )


@router.get("/status", response_model=MonitoringStatus)
async def get_status() -> MonitoringStatus:
    """Return the current live-monitoring status (always available, even when disabled)."""
    capture = get_capture_session()
    return MonitoringStatus(
        feature_enabled=LIVE_MONITORING_ENABLED,
        is_capturing=capture.is_running,
        selected_interface=capture.interface,
        session_started_at=capture.started_at,
        packets_captured=capture.flow_table.packet_count,
        flows_processed=get_session().get_stats().total_flows if capture.is_running else 0,
        packets_per_second=get_session().get_stats().packets_per_second if capture.is_running else 0.0,
        flows_per_second=get_session().get_stats().flows_per_second if capture.is_running else 0.0,
        error_message=capture.last_error,
    )


@router.get("/interfaces", response_model=List[NetworkInterface])
async def get_interfaces() -> List[NetworkInterface]:
    """List network interfaces available for capture."""
    _require_enabled()
    try:
        return list_interfaces()
    except Exception as e:
        logger.error("Interface enumeration failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to enumerate network interfaces: {e}",
        )


@router.post("/start", response_model=MonitoringStatus)
async def start_capture(request: StartCaptureRequest) -> MonitoringStatus:
    """
    Start live packet capture on the specified interface.
    Returns 503 if Scapy is not installed or permissions are insufficient.
    """
    _require_enabled()
    capture = get_capture_session()

    if capture.is_running:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Capture already running on interface '{capture.interface}'. Stop it first.",
        )

    try:
        capture.start(request.interface)
        get_session().clear()
        get_session().start_processor()
    except CaptureUnavailableError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. Administrator or root privileges are required to capture packets.",
        )
    except Exception as e:
        logger.error("Failed to start capture: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start capture: {e}",
        )

    return await get_status()


@router.post("/stop", response_model=MonitoringStatus)
async def stop_capture() -> MonitoringStatus:
    """Stop the active capture session."""
    _require_enabled()
    capture = get_capture_session()
    get_session().stop_processor()
    capture.stop()
    return await get_status()


@router.get("/stats", response_model=LiveStats)
async def get_stats() -> LiveStats:
    """Return aggregate statistics for the current monitoring window."""
    _require_enabled()
    capture = get_capture_session()
    if not capture.is_running and capture.last_error is None:
        # Not yet started — return empty stats
        return LiveStats()
    return get_session().get_stats()


@router.get("/alerts", response_model=List[LiveAlert])
async def get_alerts(limit: int = 50) -> List[LiveAlert]:
    """Return the most recent live-detected alerts."""
    _require_enabled()
    limit = max(1, min(limit, 200))
    return get_session().get_recent_alerts(limit=limit)
