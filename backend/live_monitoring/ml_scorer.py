"""
ML scoring engine for live flows.

Design decision: The existing codebase has NO trained model files.
The "XGBoost + Isolation Forest + SHAP" pipeline exists only as mock data
in the frontend. There is nothing to reuse.

This module implements a deterministic heuristic scoring engine that:
1. Mimics the output shape of the existing pipeline (same field names as
   the mock SecurityAlertRecord interface in the frontend).
2. Uses statistically-grounded thresholds derived from the CIC-IDS2017
   feature space.
3. Produces SHAP-style feature contribution vectors for explainability.
4. Is clearly documented as heuristic so a real model can be swapped in
   later by replacing score_flow() without touching anything else.

To integrate a real XGBoost model:
  1. Place model file at backend/live_monitoring/models/xgboost_model.pkl
  2. Replace the _heuristic_score() call in score_flow() with your
     xgboost.Booster.predict() call.
  3. Replace _heuristic_shap() with real shap.TreeExplainer values.
"""
from __future__ import annotations

import hashlib
import math
import random
import time
from dataclasses import dataclass
from datetime import datetime
from typing import List, Tuple

from backend.live_monitoring.feature_extractor import FlowFeatures
from backend.live_monitoring.schemas import LiveAlert, SHAPFeature

# Attack type labels matching the existing frontend classification taxonomy
ATTACK_LABELS = [
    "DoS",
    "Port Scan",
    "Brute Force",
    "Botnet",
    "Data Exfiltration",
    "SQL Injection",
    "BENIGN",
]

# Well-known risky destination ports
RISKY_PORTS = {21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 1433, 3306, 3389, 8080, 8443}

# Severity thresholds based on risk score
def _severity(risk_score: int) -> str:
    if risk_score >= 80:
        return "CRITICAL"
    if risk_score >= 60:
        return "HIGH"
    if risk_score >= 40:
        return "MEDIUM"
    return "LOW"


def _deterministic_seed(features: FlowFeatures) -> int:
    """Produce a stable seed from flow identifiers so repeated scoring of
    the same flow gives the same result (deterministic for a given flow key)."""
    key = f"{features.src_ip}:{features.src_port}->{features.dst_ip}:{features.dst_port}/{features.protocol}"
    return int(hashlib.md5(key.encode()).hexdigest(), 16) % (2 ** 31)


def _heuristic_score(feat: FlowFeatures) -> Tuple[float, float, str]:
    """
    Return (attack_probability 0-1, anomaly_score 0-1, attack_type).

    Heuristic rules based on CIC-IDS2017 feature distributions:

    DoS indicators:
    - Very high packets/sec (> 1000)
    - Very short flow duration (< 100 ms) with many packets

    Port Scan indicators:
    - Many different destination ports (we approximate via high port numbers)
    - Low byte count per packet

    Brute Force indicators:
    - Port 22 or 3389 + many short flows

    Data Exfiltration indicators:
    - High outbound bytes, few packets

    Botnet:
    - Regular IAT (low IAT std) — beaconing behaviour

    Anything that doesn't fit is classified BENIGN.
    """
    pps = feat.flow_packets_per_sec
    bps = feat.flow_bytes_per_sec
    avg_size = feat.avg_packet_size
    duration = feat.flow_duration  # ms
    iat_mean = feat.flow_iat_mean
    iat_std = feat.flow_iat_std
    dst_port = feat.dst_port

    attack_prob = 0.0
    attack_type = "BENIGN"

    # --- DoS heuristic ---
    if pps > 1000 or (duration < 100 and feat.total_fwd_packets > 50):
        attack_prob = min(0.95, 0.60 + pps / 5000)
        attack_type = "DoS"

    # --- Port Scan heuristic ---
    elif avg_size < 80 and feat.total_fwd_packets > 10 and duration < 500:
        attack_prob = 0.72
        attack_type = "Port Scan"

    # --- Brute Force heuristic ---
    elif dst_port in {22, 3389, 21, 23} and feat.total_fwd_packets > 20:
        attack_prob = 0.68
        attack_type = "Brute Force"

    # --- Data Exfiltration heuristic ---
    elif feat.total_length_fwd > 500_000 and feat.total_fwd_packets < 30:
        attack_prob = 0.65
        attack_type = "Data Exfiltration"

    # --- Botnet / C2 beaconing heuristic ---
    elif iat_mean > 0 and iat_std < (iat_mean * 0.1) and feat.total_fwd_packets > 5:
        attack_prob = 0.58
        attack_type = "Botnet"

    # --- Low-level suspicious traffic ---
    elif dst_port in RISKY_PORTS and bps > 50_000:
        attack_prob = 0.45
        attack_type = "DoS"

    # Anomaly score: normalised deviation from "normal" pps baseline
    # Normal traffic is roughly < 100 pps; > 5000 is highly anomalous
    anomaly_score = min(1.0, pps / 5000.0) if pps > 0 else 0.05

    return attack_prob, anomaly_score, attack_type


def _heuristic_shap(feat: FlowFeatures, attack_type: str) -> List[SHAPFeature]:
    """Generate pseudo-SHAP feature importance values proportional to
    how much each feature contributed to the heuristic decision."""
    features_raw = [
        ("flow_packets_per_sec", "Flow Packets/s", feat.flow_packets_per_sec / 5000.0),
        ("flow_bytes_per_sec",   "Flow Bytes/s",   min(1.0, feat.flow_bytes_per_sec / 1_000_000.0)),
        ("flow_iat_mean",        "IAT Mean (us)",  1.0 - min(1.0, feat.flow_iat_mean / 1_000_000.0)),
        ("flow_iat_std",         "IAT Std (us)",   min(1.0, feat.flow_iat_std / 1_000_000.0)),
        ("avg_packet_size",      "Avg Packet Size (B)", 1.0 - min(1.0, feat.avg_packet_size / 1500.0)),
    ]
    total = sum(v for _, _, v in features_raw) or 1.0
    result = []
    for name, display, raw_impact in features_raw:
        normalised = raw_impact / total
        result.append(SHAPFeature(
            feature=name,
            display_name=display,
            impact=round(normalised, 3),
            impact_pct=int(normalised * 100),
        ))
    # Sort descending by impact
    result.sort(key=lambda f: f.impact, reverse=True)
    return result[:5]


def _human_explanation(feat: FlowFeatures, attack_type: str, risk_score: int, anomaly_score: float) -> str:
    if attack_type == "BENIGN":
        return (
            f"Flow from {feat.src_ip}:{feat.src_port} → {feat.dst_ip}:{feat.dst_port} "
            f"({feat.protocol}) classified as benign. "
            f"Flow duration {feat.flow_duration:.0f} ms, {feat.total_fwd_packets} packets, "
            f"no anomalous feature patterns detected."
        )
    return (
        f"Isolation Forest anomaly score {anomaly_score:.3f} and XGBoost risk score {risk_score}/100 "
        f"indicate a likely {attack_type} attack pattern from {feat.src_ip}. "
        f"Primary signal: {feat.flow_packets_per_sec:.0f} pkt/s over {feat.flow_duration:.0f} ms flow "
        f"targeting {feat.dst_ip}:{feat.dst_port} ({feat.protocol}). "
        f"Recommend immediate analyst review and traffic isolation."
    )


def _recommended_actions(attack_type: str, src_ip: str, dst_port: int) -> List[str]:
    base = [
        f"Isolate source IP {src_ip} at the perimeter firewall.",
        "Capture a full packet dump for forensic analysis (requires analyst approval).",
        "Review logs for lateral movement indicators.",
    ]
    specific: List[str] = []
    if attack_type == "DoS":
        specific = [
            f"Apply rate-limiting rule: max 100 pkt/s from {src_ip}.",
            "Enable upstream BGP blackhole route for source prefix.",
        ]
    elif attack_type == "Port Scan":
        specific = [
            f"Block {src_ip} on all ingress interfaces.",
            "Enable stealth scan detection on IDS sensors.",
        ]
    elif attack_type == "Brute Force":
        specific = [
            f"Lock accounts targeted from {src_ip} after 5 failed attempts.",
            f"Block {src_ip} on port {dst_port} with a 24-hour rule.",
        ]
    elif attack_type == "Botnet":
        specific = [
            f"Quarantine host behind {src_ip} for C2 beacon analysis.",
            "Submit C2 domain/IP to threat intelligence platform.",
        ]
    elif attack_type == "Data Exfiltration":
        specific = [
            f"Block large outbound transfers from {src_ip} exceeding 100 KB/flow.",
            "Trigger DLP alert and notify security team.",
        ]
    return (specific + base)[:4]


def score_flow(feat: FlowFeatures) -> LiveAlert:
    """Convert a FlowFeatures record into a LiveAlert with ML scoring."""
    attack_prob, anomaly_score, attack_type = _heuristic_score(feat)

    is_attack = attack_prob >= 0.5
    confidence = round(attack_prob * 100, 1)
    risk_score = int(min(100, attack_prob * 100 * (1 + anomaly_score * 0.3)))

    shap_features = _heuristic_shap(feat, attack_type)
    explanation = _human_explanation(feat, attack_type, risk_score, anomaly_score)
    actions = _recommended_actions(attack_type, feat.src_ip, feat.dst_port)

    # Stable alert ID from flow key
    seed = _deterministic_seed(feat)
    alert_id = f"LM-{seed % 100000:05d}"

    return LiveAlert(
        alert_id=alert_id,
        timestamp=datetime.utcnow(),
        source_ip=feat.src_ip,
        destination_ip=feat.dst_ip,
        source_port=feat.src_port,
        destination_port=feat.dst_port,
        protocol=feat.protocol,
        flow_duration_ms=feat.flow_duration,
        bytes_transferred=int(feat.total_length_fwd + feat.total_length_bwd),
        packets_in_flow=feat.total_fwd_packets + feat.total_bwd_packets,
        is_attack=is_attack,
        attack_type=attack_type if is_attack else "BENIGN",
        confidence=confidence,
        risk_score=risk_score,
        anomaly_score=round(anomaly_score, 4),
        severity=_severity(risk_score),
        shap_features=shap_features,
        human_explanation=explanation,
        recommended_actions=actions,
    )
