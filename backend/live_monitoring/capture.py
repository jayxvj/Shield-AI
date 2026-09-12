"""
Packet capture using Scapy.
If Scapy is unavailable the capture module degrades gracefully:
 - start_capture() raises CaptureUnavailableError
 - The router catches this and returns a 503 with a clear explanation.

Only flow metadata is captured; payload bytes are never stored.
"""
from __future__ import annotations

import logging
import threading
import time
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


class CaptureUnavailableError(RuntimeError):
    """Raised when packet capture is not possible on this host."""


@dataclass
class RawFlow:
    """Minimal flow record — no payload, only metadata."""
    src_ip: str
    dst_ip: str
    src_port: int
    dst_port: int
    protocol: str  # TCP | UDP | ICMP | OTHER
    first_seen: float = field(default_factory=time.time)
    last_seen: float = field(default_factory=time.time)
    packet_count: int = 0
    byte_count: int = 0
    # inter-arrival times for feature extraction
    iat_values: List[float] = field(default_factory=list)

    @property
    def duration_ms(self) -> float:
        return (self.last_seen - self.first_seen) * 1000.0

    @property
    def flow_key(self) -> Tuple[str, str, int, int, str]:
        return (self.src_ip, self.dst_ip, self.src_port, self.dst_port, self.protocol)


# Flow timeout — if no packet seen for N seconds, the flow is considered complete
FLOW_TIMEOUT_SECONDS = 30
# Maximum flows kept in memory at once to prevent memory exhaustion
MAX_FLOWS_IN_MEMORY = 10_000


class FlowTable:
    """Thread-safe in-memory flow table."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._active: Dict[tuple, RawFlow] = {}
        self._completed: List[RawFlow] = []
        self._packet_count = 0
        self._started_at = time.time()

    def ingest_packet(self, pkt: "Any") -> None:  # noqa: F821
        """Extract metadata from a Scapy packet and update the flow table."""
        try:
            from scapy.layers.inet import IP, TCP, UDP, ICMP  # type: ignore

            if not pkt.haslayer(IP):
                return

            ip = pkt[IP]
            src_ip: str = ip.src
            dst_ip: str = ip.dst
            pkt_len: int = len(pkt)
            now = time.time()

            if pkt.haslayer(TCP):
                proto = "TCP"
                src_port = pkt[TCP].sport
                dst_port = pkt[TCP].dport
            elif pkt.haslayer(UDP):
                proto = "UDP"
                src_port = pkt[UDP].sport
                dst_port = pkt[UDP].dport
            elif pkt.haslayer(ICMP):
                proto = "ICMP"
                src_port = 0
                dst_port = 0
            else:
                proto = "OTHER"
                src_port = 0
                dst_port = 0

            key = (src_ip, dst_ip, src_port, dst_port, proto)

            with self._lock:
                self._packet_count += 1
                if key in self._active:
                    flow = self._active[key]
                    iat = now - flow.last_seen
                    flow.iat_values.append(iat)
                    flow.last_seen = now
                    flow.packet_count += 1
                    flow.byte_count += pkt_len
                else:
                    if len(self._active) >= MAX_FLOWS_IN_MEMORY:
                        # Evict oldest flow to prevent memory exhaustion
                        oldest_key = min(self._active, key=lambda k: self._active[k].last_seen)
                        self._completed.append(self._active.pop(oldest_key))
                    flow = RawFlow(
                        src_ip=src_ip,
                        dst_ip=dst_ip,
                        src_port=src_port,
                        dst_port=dst_port,
                        protocol=proto,
                        first_seen=now,
                        last_seen=now,
                        packet_count=1,
                        byte_count=pkt_len,
                    )
                    self._active[key] = flow

                # Expire timed-out flows
                self._expire_flows(now)
        except Exception as e:
            logger.debug("Packet ingest error (non-critical): %s", e)

    def _expire_flows(self, now: float) -> None:
        """Move timed-out flows from active to completed (called within lock)."""
        expired = [k for k, f in self._active.items() if (now - f.last_seen) > FLOW_TIMEOUT_SECONDS]
        for k in expired:
            self._completed.append(self._active.pop(k))
        # Trim completed list to avoid unbounded growth
        if len(self._completed) > MAX_FLOWS_IN_MEMORY:
            self._completed = self._completed[-MAX_FLOWS_IN_MEMORY:]

    def drain_completed(self) -> List[RawFlow]:
        """Return and clear the list of completed flows."""
        with self._lock:
            flows = list(self._completed)
            self._completed.clear()
            return flows

    @property
    def packet_count(self) -> int:
        with self._lock:
            return self._packet_count

    @property
    def active_flow_count(self) -> int:
        with self._lock:
            return len(self._active)

    @property
    def elapsed_seconds(self) -> float:
        return time.time() - self._started_at


class LiveCapture:
    """
    Manages a Scapy sniffer running in a daemon thread.

    If Scapy is not installed or the user lacks capture privileges,
    start() raises CaptureUnavailableError — the rest of the app is unaffected.
    """

    def __init__(self) -> None:
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self.flow_table = FlowTable()
        self._interface: Optional[str] = None
        self._started_at: Optional[datetime] = None
        self._error: Optional[str] = None

    @property
    def is_running(self) -> bool:
        return self._thread is not None and self._thread.is_alive()

    @property
    def interface(self) -> Optional[str]:
        return self._interface

    @property
    def started_at(self) -> Optional[datetime]:
        return self._started_at

    @property
    def last_error(self) -> Optional[str]:
        return self._error

    def start(self, interface: str) -> None:
        """Start capturing on the given interface.

        Raises:
            CaptureUnavailableError: Scapy is not installed or privileges insufficient.
        """
        if self.is_running:
            logger.warning("Capture already running on %s", self._interface)
            return

        try:
            import scapy.all as scapy  # noqa: F401 — just to verify importability
        except ImportError:
            raise CaptureUnavailableError(
                "Scapy is not installed. Install it with: pip install scapy"
            )

        self._interface = interface
        self._stop_event.clear()
        self._error = None
        self._started_at = datetime.utcnow()
        self.flow_table = FlowTable()

        self._thread = threading.Thread(
            target=self._capture_loop,
            args=(interface,),
            daemon=True,
            name=f"live-capture-{interface}",
        )
        self._thread.start()
        logger.info("Live capture started on interface '%s'", interface)

    def stop(self) -> None:
        """Signal the capture thread to stop."""
        if not self.is_running:
            return
        self._stop_event.set()
        logger.info("Live capture stop requested for interface '%s'", self._interface)

    def _capture_loop(self, interface: str) -> None:
        try:
            from scapy.all import sniff  # type: ignore
            sniff(
                iface=interface,
                prn=self.flow_table.ingest_packet,
                store=False,
                stop_filter=lambda _: self._stop_event.is_set(),
            )
        except PermissionError:
            self._error = (
                "Permission denied. Run with administrator / root privileges to capture packets."
            )
            logger.error("Capture permission error on %s: %s", interface, self._error)
        except Exception as e:
            self._error = str(e)
            logger.error("Capture error on %s: %s", interface, e)


# Module-level singleton — one capture session at a time per process
_capture_session = LiveCapture()


def get_capture_session() -> LiveCapture:
    return _capture_session
