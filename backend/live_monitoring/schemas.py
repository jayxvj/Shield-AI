"""
Pydantic schemas for the Live Monitoring API.
All new types live here; no existing schemas are modified.
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class NetworkInterface(BaseModel):
    """A network interface available for capture."""
    name: str
    description: str
    is_up: bool = True


class MonitoringStatus(BaseModel):
    """Current state of the live monitoring session."""
    feature_enabled: bool
    is_capturing: bool
    selected_interface: Optional[str] = None
    session_started_at: Optional[datetime] = None
    packets_captured: int = 0
    flows_processed: int = 0
    packets_per_second: float = 0.0
    flows_per_second: float = 0.0
    error_message: Optional[str] = None


class StartCaptureRequest(BaseModel):
    """Request body to start a capture session."""
    interface: str = Field(..., description="Network interface name to capture on")


class SHAPFeature(BaseModel):
    """A single SHAP feature contribution for a live alert."""
    feature: str
    display_name: str
    impact: float = Field(ge=0.0, le=1.0)
    impact_pct: int


class LiveAlert(BaseModel):
    """A single threat event detected from live traffic."""
    alert_id: str
    timestamp: datetime
    source_ip: str
    destination_ip: str
    source_port: int
    destination_port: int
    protocol: str
    flow_duration_ms: float
    bytes_transferred: int
    packets_in_flow: int
    # ML results
    is_attack: bool
    attack_type: str
    confidence: float = Field(ge=0.0, le=100.0)
    risk_score: int = Field(ge=0, le=100)
    anomaly_score: float = Field(ge=0.0, le=1.0)
    severity: str  # LOW | MEDIUM | HIGH | CRITICAL
    # Explainability
    shap_features: List[SHAPFeature] = []
    human_explanation: str
    recommended_actions: List[str] = []


class LiveStats(BaseModel):
    """Aggregate statistics for the current monitoring window."""
    window_seconds: int = 60
    total_flows: int = 0
    normal_flows: int = 0
    suspicious_flows: int = 0
    packets_per_second: float = 0.0
    flows_per_second: float = 0.0
    top_attack_type: Optional[str] = None
    current_risk_score: int = 0
    anomaly_rate_pct: float = 0.0
    recent_alerts: List[LiveAlert] = []
    timeline: List[dict] = []  # [{time, normal, suspicious}]
