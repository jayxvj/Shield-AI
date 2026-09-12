"""
Network interface discovery.
Works without Scapy — falls back to basic socket/platform enumeration.
"""
from __future__ import annotations

import logging
import socket
from typing import List

from backend.live_monitoring.schemas import NetworkInterface

logger = logging.getLogger(__name__)


def _get_interfaces_via_scapy() -> List[NetworkInterface]:
    """Use Scapy's interface listing when available and pcap is functional."""
    from scapy.arch import get_if_list  # type: ignore
    from scapy.interfaces import IFACES  # type: ignore

    names = get_if_list()
    # On Windows without Npcap/WinPcap, Scapy returns an empty list.
    # Raise so the caller falls through to the platform fallback.
    if not names:
        raise RuntimeError("Scapy returned no interfaces (libpcap/Npcap may not be installed)")

    ifaces: List[NetworkInterface] = []
    for name in names:
        try:
            iface_data = IFACES.get(name)
            description = name
            if iface_data and hasattr(iface_data, "description") and iface_data.description:
                description = iface_data.description
            ifaces.append(NetworkInterface(name=name, description=description, is_up=True))
        except Exception:
            ifaces.append(NetworkInterface(name=name, description=name, is_up=True))
    return ifaces


def _get_interfaces_fallback() -> List[NetworkInterface]:
    """Minimal fallback that works everywhere without extra libraries."""
    import sys

    ifaces: List[NetworkInterface] = []
    try:
        if sys.platform.startswith("win"):
            import subprocess
            result = subprocess.run(
                ["netsh", "interface", "show", "interface"],
                capture_output=True, text=True, timeout=5
            )
            for line in result.stdout.splitlines():
                parts = line.strip().split()
                if len(parts) >= 4 and parts[0] in ("Enabled", "Disabled"):
                    name = " ".join(parts[3:])
                    is_up = parts[1].lower() == "connected"
                    ifaces.append(NetworkInterface(name=name, description=name, is_up=is_up))
        else:
            import os
            net_path = "/sys/class/net"
            if os.path.exists(net_path):
                for name in os.listdir(net_path):
                    try:
                        with open(f"{net_path}/{name}/operstate") as f:
                            state = f.read().strip()
                        is_up = state == "up"
                    except OSError:
                        is_up = False
                    ifaces.append(NetworkInterface(name=name, description=name, is_up=is_up))
    except Exception as e:
        logger.debug("Interface fallback enumeration error: %s", e)

    if not ifaces:
        # Last resort: at least report the loopback
        ifaces.append(NetworkInterface(name="lo", description="Loopback", is_up=True))
    return ifaces


def list_interfaces() -> List[NetworkInterface]:
    """Return available network interfaces, best-effort."""
    try:
        return _get_interfaces_via_scapy()
    except ImportError:
        logger.debug("Scapy not available — using fallback interface enumeration")
        return _get_interfaces_fallback()
    except Exception as e:
        logger.warning("Interface enumeration via Scapy failed: %s", e)
        return _get_interfaces_fallback()
