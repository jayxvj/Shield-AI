"""
Network interface discovery.
Works without Scapy — falls back to basic socket/platform enumeration.
"""
from __future__ import annotations

import logging
import sys
from typing import List

from backend.live_monitoring.schemas import NetworkInterface

logger = logging.getLogger(__name__)


def _get_interfaces_windows() -> List[NetworkInterface]:
    """
    On Windows with Npcap installed, use scapy.arch.windows.get_windows_if_list()
    which returns human-readable names (WiFi, Ethernet, …) and the correct
    NPF device name needed by Scapy's sniff().

    Only interfaces that have an associated NPF device are included — those
    are the ones Scapy can actually capture on.
    """
    from scapy.arch.windows import get_windows_if_list  # type: ignore

    win_ifaces = get_windows_if_list()
    if not win_ifaces:
        raise RuntimeError("No capturable interfaces found (Npcap may not be installed)")

    # Scapy's sniff() on Windows requires \Device\NPF_{GUID}.
    # get_if_list() returns bare {GUID} strings — we must prefix them.
    from scapy.arch import get_if_list  # type: ignore
    npf_names = get_if_list()  # ['{GUID}', ..., '\\Device\\NPF_Loopback']
    guid_to_npf: dict = {}
    for npf in npf_names:
        if npf.startswith("\\Device\\NPF_"):
            # Already a full NPF path (e.g. Loopback)
            guid = npf.split("NPF_", 1)[-1]
            guid_to_npf[guid] = npf
        elif npf.startswith("{") and npf.endswith("}"):
            # Bare GUID — construct the NPF path Scapy sniff() requires
            guid_to_npf[npf] = f"\\Device\\NPF_{npf}"

    result: List[NetworkInterface] = []
    seen_names: set = set()

    for iface in win_ifaces:
        friendly_name: str = iface.get("name", "")
        description: str = iface.get("description", friendly_name)
        guid: str = iface.get("guid", "")

        # Skip virtual/filter sub-interfaces (names contain '-')
        if "-" in friendly_name and any(
            kw in friendly_name
            for kw in ("WFP", "QoS", "Filter", "Npcap Packet Driver")
        ):
            continue
        # Skip duplicates
        if friendly_name in seen_names:
            continue

        # Find the NPF device name Scapy needs for sniff()
        npf_device = guid_to_npf.get(guid, "")
        if not npf_device and guid:
            npf_device = f"\\Device\\NPF_{guid}"

        if friendly_name:
            seen_names.add(friendly_name)
            result.append(NetworkInterface(
                name=npf_device or friendly_name,
                description=f"{friendly_name} — {description}" if description != friendly_name else friendly_name,
                is_up=True,
            ))

    if not result:
        raise RuntimeError("No capturable interfaces resolved after filtering")

    return result


def _get_interfaces_unix() -> List[NetworkInterface]:
    """Linux / macOS: use /sys/class/net or scapy get_if_list."""
    import os
    ifaces: List[NetworkInterface] = []
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
    if not ifaces:
        try:
            from scapy.arch import get_if_list  # type: ignore
            for name in get_if_list():
                ifaces.append(NetworkInterface(name=name, description=name, is_up=True))
        except Exception:
            pass
    return ifaces or [NetworkInterface(name="lo", description="Loopback", is_up=True)]


def list_interfaces() -> List[NetworkInterface]:
    """Return available network interfaces suitable for packet capture."""
    try:
        if sys.platform.startswith("win"):
            return _get_interfaces_windows()
        return _get_interfaces_unix()
    except Exception as e:
        logger.warning("Interface enumeration failed (%s), using netsh fallback", e)
        # Last-resort Windows fallback via netsh
        ifaces: List[NetworkInterface] = []
        try:
            import subprocess
            result = subprocess.run(
                ["netsh", "interface", "show", "interface"],
                capture_output=True, text=True, timeout=5,
            )
            for line in result.stdout.splitlines():
                parts = line.strip().split()
                if len(parts) >= 4 and parts[0] in ("Enabled", "Disabled"):
                    name = " ".join(parts[3:])
                    is_up = parts[1].lower() == "connected"
                    ifaces.append(NetworkInterface(name=name, description=name, is_up=is_up))
        except Exception as fe:
            logger.debug("netsh fallback also failed: %s", fe)
        return ifaces or [NetworkInterface(name="lo", description="Loopback", is_up=True)]
