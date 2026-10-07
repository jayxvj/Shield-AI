from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Float, Boolean
from sqlalchemy.sql import func
import enum

from backend.database import Base


class ThreatSeverity(str, enum.Enum):
    """Threat severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class ThreatStatus(str, enum.Enum):
    """Threat status"""
    DETECTED = "detected"
    ANALYZING = "analyzing"
    MITIGATED = "mitigated"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"


class Threat(Base):
    """Threat detection model"""
    __tablename__ = "threats"

    id = Column(Integer, primary_key=True, index=True)
    threat_type = Column(String(100), nullable=False, index=True)
    severity = Column(Enum(ThreatSeverity), nullable=False, default=ThreatSeverity.MEDIUM)
    status = Column(Enum(ThreatStatus), nullable=False, default=ThreatStatus.DETECTED)
    source_ip = Column(String(45), nullable=True, index=True)
    destination_ip = Column(String(45), nullable=True)
    description = Column(Text, nullable=False)
    ai_analysis = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    detected_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    mitigation_action = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Threat(id={self.id}, type={self.threat_type}, severity={self.severity})>"


class LiveAlertRecord(Base):
    """Real-time live monitoring alert record persisted to DB and linked to S3"""
    __tablename__ = "live_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(64), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    source_ip = Column(String(45), nullable=False, index=True)
    destination_ip = Column(String(45), nullable=False)
    source_port = Column(Integer, nullable=True)
    destination_port = Column(Integer, nullable=True)
    protocol = Column(String(10), nullable=False)
    attack_type = Column(String(60), nullable=False, index=True)
    severity = Column(String(20), nullable=False, index=True)
    risk_score = Column(Integer, default=0)
    anomaly_score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    is_attack = Column(Boolean, default=False, index=True)
    s3_key = Column(String(255), nullable=True, index=True)
    s3_storage = Column(String(50), nullable=True)
    raw_payload = Column(Text, nullable=True)

    def __repr__(self):
        return f"<LiveAlertRecord(alert_id={self.alert_id}, attack_type={self.attack_type}, severity={self.severity})>"

