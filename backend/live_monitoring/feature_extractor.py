"""
Feature extraction from RawFlow records.

Extracts a subset of CIC-IDS2017-compatible statistical features from
aggregated flow metadata. Features that require full payload inspection
or cannot be reliably derived from metadata alone are explicitly set to
a safe sentinel value (0.0) and documented here.

CIC-IDS2017 features handled:
  - Flow Duration
  - Total Fwd/Bwd Packets (approximated from packet count)
  - Total Length Fwd/Bwd Packets (approximated from byte count)
  - Flow Bytes/s, Flow Packets/s
  - Flow IAT Mean/Std/Max/Min
  - Fwd IAT Mean/Total/Std/Max/Min (approximated)
  - Destination Port
  - Protocol (encoded)

Features explicitly NOT derivable without payload / bidirectional capture:
  - PSH/URG/FIN/RST/SYN/ACK flag counts
  - Active/Idle mean/std/max/min
  - Subflow byte counts
  These are set to 0.0 and the scorer treats them as neutral.
"""
from __future__ import annotations

import math
import statistics
from dataclasses import dataclass, field
from typing import List

from backend.live_monitoring.capture import RawFlow


@dataclass
class FlowFeatures:
    """A partial CIC-IDS2017 feature vector derived from flow metadata."""
    # Identifiers (not used as model features)
    src_ip: str = ""
    dst_ip: str = ""
    src_port: int = 0
    dst_port: int = 0
    protocol: str = "TCP"

    # Derivable features
    flow_duration: float = 0.0       # milliseconds
    total_fwd_packets: int = 0
    total_bwd_packets: int = 0
    total_length_fwd: float = 0.0
    total_length_bwd: float = 0.0
    flow_bytes_per_sec: float = 0.0
    flow_packets_per_sec: float = 0.0

    # IAT features (inter-arrival times in microseconds)
    flow_iat_mean: float = 0.0
    flow_iat_std: float = 0.0
    flow_iat_max: float = 0.0
    flow_iat_min: float = 0.0
    fwd_iat_total: float = 0.0
    fwd_iat_mean: float = 0.0
    fwd_iat_std: float = 0.0
    fwd_iat_max: float = 0.0
    fwd_iat_min: float = 0.0

    # Packet-size stats
    avg_packet_size: float = 0.0
    avg_fwd_segment_size: float = 0.0

    # Not derivable — kept at 0.0 (neutral sentinel)
    psh_flag_count: int = 0
    urg_flag_count: int = 0
    fin_flag_count: int = 0
    rst_flag_count: int = 0
    syn_flag_count: int = 0
    ack_flag_count: int = 0
    active_mean: float = 0.0
    active_std: float = 0.0
    idle_mean: float = 0.0
    idle_std: float = 0.0


def _safe_mean(values: List[float]) -> float:
    return statistics.mean(values) if values else 0.0


def _safe_stdev(values: List[float]) -> float:
    return statistics.stdev(values) if len(values) >= 2 else 0.0


def extract_features(flow: RawFlow) -> FlowFeatures:
    """Convert a RawFlow into a FlowFeatures record."""
    duration_ms = max(flow.duration_ms, 0.0)
    duration_sec = duration_ms / 1000.0

    # Approximate split: assume ~60% fwd, 40% bwd (metadata-only heuristic)
    fwd_packets = max(1, int(flow.packet_count * 0.6))
    bwd_packets = max(0, flow.packet_count - fwd_packets)
    fwd_bytes = int(flow.byte_count * 0.6)
    bwd_bytes = flow.byte_count - fwd_bytes

    bytes_per_sec = (flow.byte_count / duration_sec) if duration_sec > 0 else 0.0
    pkts_per_sec = (flow.packet_count / duration_sec) if duration_sec > 0 else 0.0

    # IAT values stored in seconds — convert to microseconds for CIC-IDS2017 compatibility
    iat_us = [v * 1_000_000 for v in flow.iat_values] if flow.iat_values else [0.0]

    feat = FlowFeatures(
        src_ip=flow.src_ip,
        dst_ip=flow.dst_ip,
        src_port=flow.src_port,
        dst_port=flow.dst_port,
        protocol=flow.protocol,
        flow_duration=duration_ms,
        total_fwd_packets=fwd_packets,
        total_bwd_packets=bwd_packets,
        total_length_fwd=float(fwd_bytes),
        total_length_bwd=float(bwd_bytes),
        flow_bytes_per_sec=bytes_per_sec,
        flow_packets_per_sec=pkts_per_sec,
        flow_iat_mean=_safe_mean(iat_us),
        flow_iat_std=_safe_stdev(iat_us),
        flow_iat_max=max(iat_us) if iat_us else 0.0,
        flow_iat_min=min(iat_us) if iat_us else 0.0,
        fwd_iat_total=sum(iat_us[:fwd_packets]),
        fwd_iat_mean=_safe_mean(iat_us[:fwd_packets]),
        fwd_iat_std=_safe_stdev(iat_us[:fwd_packets]),
        fwd_iat_max=max(iat_us[:fwd_packets]) if iat_us[:fwd_packets] else 0.0,
        fwd_iat_min=min(iat_us[:fwd_packets]) if iat_us[:fwd_packets] else 0.0,
        avg_packet_size=(flow.byte_count / flow.packet_count) if flow.packet_count > 0 else 0.0,
        avg_fwd_segment_size=(fwd_bytes / fwd_packets) if fwd_packets > 0 else 0.0,
    )
    return feat
