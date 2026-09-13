"""
FastAPI router for Live Monitoring.
All endpoints are under /api/live-monitoring — no existing routes are touched.

If Scapy is not installed (e.g. on cloud/Render), the status endpoint returns
feature_enabled=False and all other endpoints return 503. The rest of the app
is completely unaffected.
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

# Explicit feature flag (can be set to False via env var LIVE_MONITORING_ENABLED=false)
import os as _os
_flag = _os.environ.get("LIVE_MONITORING_ENABLED", "true").lower()
LIVE_MONITORING_ENABLED: bool = _flag not in ("false", "0", "no")

# Auto-detect Scapy at import time — if missing, disable capture gracefully
_SCAPY_AVAILABLE: bool = False
_SCAPY_UNAVAILABLE_REASON: str = ""
try:
    import scapy.all  # noqa: F401
    _SCAPY_AVAILABLE = True
except ImportError:
    _SCAPY_UNAVAILABLE_REASON = (
        "Scapy is not installed on this server. "
        "Live packet capture requires running the backend locally on your own machine "
        "where you have physical network access. "
        "Install Scapy locally with: pip install scapy"
    )
    logger.info("Scapy not available — live capture disabled (cloud deployment mode)")


def _capture_available() -> bool:
    return LIVE_MONITORING_ENABLED and _SCAPY_AVAILABLE


def _require_capture() -> None:
    if not LIVE_MONITORING_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Live monitoring is disabled via LIVE_MONITORING_ENABLED=false.",
        )
    if not _SCAPY_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=_SCAPY_UNAVAILABLE_REASON,
        )


@router.get("/status", response_model=MonitoringStatus)
async def get_status() -> MonitoringStatus:
    """Return the current live-monitoring status.
    Always returns 200 — never raises. feature_enabled=False when Scapy is missing."""
    capture = get_capture_session()
    return MonitoringStatus(
        feature_enabled=_capture_available(),
        is_capturing=capture.is_running,
        selected_interface=capture.interface,
        session_started_at=capture.started_at,
        packets_captured=capture.flow_table.packet_count,
        flows_processed=get_session().get_stats().total_flows if capture.is_running else 0,
        packets_per_second=get_session().get_stats().packets_per_second if capture.is_running else 0.0,
        flows_per_second=get_session().get_stats().flows_per_second if capture.is_running else 0.0,
        error_message=_SCAPY_UNAVAILABLE_REASON if not _SCAPY_AVAILABLE else capture.last_error,
    )


@router.get("/interfaces", response_model=List[NetworkInterface])
async def get_interfaces() -> List[NetworkInterface]:
    """List network interfaces. Returns 503 when Scapy is unavailable."""
    _require_capture()
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
    _require_capture()
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
    _require_capture()
    capture = get_capture_session()
    get_session().stop_processor()
    capture.stop()
    return await get_status()


@router.get("/stats", response_model=LiveStats)
async def get_stats() -> LiveStats:
    """Return aggregate statistics for the current monitoring window."""
    _require_capture()
    capture = get_capture_session()
    if not capture.is_running and capture.last_error is None:
        # Not yet started — return empty stats
        return LiveStats()
    return get_session().get_stats()


@router.get("/alerts", response_model=List[LiveAlert])
async def get_alerts(limit: int = 50) -> List[LiveAlert]:
    """Return the most recent live-detected alerts."""
    _require_capture()
    limit = max(1, min(limit, 200))
    return get_session().get_recent_alerts(limit=limit)
