'use client';

import React from 'react';

export const AsciiDashboard: React.FC = () => {
  return (
    <pre className="font-mono text-xs sm:text-sm text-[#9EABA2] bg-[#0B0F19] p-6 rounded-lg border border-[#EECC8C]/30 shadow-2xl overflow-x-auto whitespace-pre leading-tight">
      {`
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║  `}<span className="text-white font-bold">SHIELD</span><span className="text-[#EECC8C] font-bold">-AI</span>{` // `}<span className="text-[#EECC8C]">CYBER THREAT DETECTION & RESPONSE SYSTEM</span>{`                        `}<span className="text-[#9EABA2]">[● ML ENGINE: ONLINE]</span>{`  ║
║  SOC ANALYST: `}<span className="text-white font-bold">ALEX VANCE (SOC-T2)</span>{`  |  INGESTION: `}<span className="text-[#EECC8C]">48.2k pkts/sec</span>{`  |  STREAM: `}<span className="text-[#9EABA2]">10 Gbps (LIVE)</span>{`      ║
╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                                  ║
║  ┌─ [1] TOTAL PACKETS ───┐ ┌─ [2] ANOMALIES ───────┐ ┌─ [3] HIGH-RISK ───────┐ ┌─ [4] AUTO-MITIGATED ─┐ ┌─ [5] THREAT INDEX ──┐ ║
║  │ `}<span className="text-white font-bold">4.82M</span>{` Flows          │ │ `}<span className="text-[#E8B298] font-bold">1,429</span>{` Flagged       │ │ `}<span className="text-[#A36361] font-bold">38</span>{` Triage Alerts   │ │ `}<span className="text-[#9EABA2] font-bold">1,391</span>{` Enforced      │ │     `}<span className="text-[#A36361] font-bold text-base">74 / 100</span>{`     │ ║
║  │ `}<span className="text-[#9EABA2]">▲ +12.4% Past 24h</span>{`     │ │ `}<span className="text-[#E8B298]">▲ +8.1% IsolForest</span>{` │ │ `}<span className="text-[#A36361]">▼ -14.3% Critical</span>{`  │ │ `}<span className="text-[#9EABA2]">▲ +96.2% Flowspec</span>{`  │ │  `}<span className="text-[#A36361] font-bold">[ CRITICAL RISK ]</span>{`  │ ║
║  └───────────────────────┘ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘ ║
║                                                                                                                  ║
║  ┌── [SECTION 1: NETWORK TRAFFIC TIMELINE (1h Window)] ────────────────────────────────────────────────────────┐ ║
║  │  pkts/s                                                                                                     │ ║
║  │   60k ┤                                     `}<span className="text-[#A36361]">▲ MALICIOUS INGRESS SURGE (SYN FLOOD)</span>{`                        │ ║
║  │   45k ┤                       `}<span className="text-[#A36361]">╭───╮</span>{`         `}<span className="text-[#A36361]">╭─────╮</span>{`                                                   │ ║
║  │   30k ┤         `}<span className="text-[#A36361]">╭───╮</span>{`         `}<span className="text-[#A36361]">│   │</span>{`         `}<span className="text-[#A36361]">│     │</span>{`    `}<span className="text-[#9EABA2]">╭────────────────────────╮</span>{`                            │ ║
║  │   15k ┤ `}<span className="text-[#9EABA2]">╭───────╯   ╰─────────╯   ╰─────────╯     ╰────╯                        ╰───────────╮</span>{`              │ ║
║  │    0k ┴─`}<span className="text-[#9EABA2]">┴───────────────────────────────────────────────────────────────────────────────────┴──</span>{`              │ ║
║  │         18:00       18:15       18:30       18:45       19:00       19:15       19:30       19:45       │ ║
║  │         `}<span className="text-[#9EABA2]">[■] Normal Baseline Traffic (CIC-IDS)</span>{`        `}<span className="text-[#A36361]">[■] Flagged Malicious Traffic</span>{`                          │ ║
║  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                                  ║
║  ┌── [SECTION 2: ATTACK CLASSIFICATION] ─────────────────┐ ┌── [SECTION 3: TARGETED ENDPOINTS] ─────────────────┐ ║
║  │  • `}<span className="text-[#A36361]">DoS / Volumetric Attack</span>{`        [██████████] 38% │ │  [1] `}<span className="text-white">Prod-DB-Primary (10.0.0.12)</span>{`    `}<span className="text-[#A36361]">[CRITICAL: 14]</span>{` │ ║
║  │  • `}<span className="text-[#D3A29D]">Botnet C2 Relay</span>{`                [██████    ] 24% │ │  [2] `}<span className="text-white">DMZ-Edge-Gateway (10.0.0.1)</span>{`    `}<span className="text-[#E8B298]">[WARNING:   6]</span>{` │ ║
║  │  • `}<span className="text-[#E8B298]">Reconnaissance / Port Scan</span>{`     [████      ] 18% │ │  [3] `}<span className="text-white">Auth-Vault-Node (10.0.0.4)</span>{`     `}<span className="text-[#9EABA2]">[NORMAL:    0]</span>{` │ ║
║  │  • `}<span className="text-[#EECC8C]">Exploitation / SQL Injection</span>{`   [███       ] 12% │ │  [4] `}<span className="text-white">Internal-Worker-09 (10.0.0.8)</span>{`  `}<span className="text-[#9EABA2]">[NORMAL:    0]</span>{` │ ║
║  │  • `}<span className="text-[#9EABA2]">Verified Normal Baseline</span>{`       [██        ]  8% │ │  EDR Sensor: `}<span className="text-[#9EABA2]">ALL 4 HOSTS AGENTS ACTIVE</span>{`             │ ║
║  └───────────────────────────────────────────────────────┘ └────────────────────────────────────────────────────┘ ║
║                                                                                                                  ║
║  ┌── [SECTION 4: ACTIVE THREAT TRIAGE TABLE] ──────────────────────────────────────────────────────────────────┐ ║
║  │ ALERT ID  TIMESTAMP  SOURCE IP        TARGET ASSET     CLASSIFICATION    SEVERITY  CONFIDENCE  ACTION       │ ║
║  ├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ ║
║  │ `}<span className="text-[#EECC8C]">ALT-9041</span>{`  18:45:22   `}<span className="text-white">198.51.100.44</span>{`   Prod-DB-Primary  `}<span className="text-[#A36361]">DoS (SYN Flood)</span>{`   `}<span className="text-[#A36361]">HIGH</span>{`      96.8%       `}<span className="text-[#EECC8C]">[EXPLAIN XAI]</span>{`  │ ║
║  │ `}<span className="text-[#EECC8C]">ALT-9042</span>{`  18:44:08   `}<span className="text-white">203.0.113.88</span>{`    DMZ-Edge-Gateway `}<span className="text-[#A36361]">SQL Injection</span>{`     `}<span className="text-[#A36361]">HIGH</span>{`      94.2%       `}<span className="text-[#EECC8C]">[EXPLAIN XAI]</span>{`  │ ║
║  │ `}<span className="text-[#EECC8C]">ALT-9043</span>{`  18:42:55   `}<span className="text-white">45.33.32.156</span>{`    Auth-Vault-Node  `}<span className="text-[#E8B298]">Botnet C2</span>{`         `}<span className="text-[#E8B298]">MEDIUM</span>{`    87.5%       `}<span className="text-[#EECC8C]">[EXPLAIN XAI]</span>{`  │ ║
║  │ `}<span className="text-[#EECC8C]">ALT-9044</span>{`  18:41:19   `}<span className="text-white">194.26.29.112</span>{`   Worker-Cluster-3 `}<span className="text-[#E8B298]">Port Scan</span>{`         `}<span className="text-[#E8B298]">MEDIUM</span>{`    81.0%       `}<span className="text-[#EECC8C]">[EXPLAIN XAI]</span>{`  │ ║
║  │ `}<span className="text-[#EECC8C]">ALT-9045</span>{`  18:39:40   `}<span className="text-white">192.168.1.105</span>{`   Core-Router-01   `}<span className="text-[#9EABA2]">Normal Verified</span>{`   `}<span className="text-[#9EABA2]">LOW</span>{`       99.1%       `}<span className="text-[#9EABA2]">[VERIFIED OK]</span>{`  │ ║
║  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                                  ║
║  ┌── [SECTION 5: EXPLAINABLE AI (SHAP ATTRIBUTION & DEFENSIVE PLAYBOOK)] ──────────────────────────────────────┐ ║
║  │ TOP DRIVER: `}<span className="text-[#EECC8C] font-bold">SYN Packet Ratio (+88%)</span>{`  |  FLOW DURATION: `}<span className="text-[#E8B298]">Short Burst Lifespan (+74%)</span>{`  |  ENTROPY: `}<span className="text-[#E8B298]">Dest Port (+58%)</span>{`   │ ║
║  │ AUTOMATED PLAYBOOK: `}<span className="text-[#9EABA2]">PB-409: BGP Flowspec Ingress Rate-Limiting & Kernel TCP Syncookies Enforcement</span>{`       │ ║
║  │ COMMAND: `}<span className="text-[#EECC8C]">iptables -A INPUT -p tcp --syn -m limit --limit 50/s -j ACCEPT && bgp-flowspec --action drop</span>{`     │ ║
║  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
`}
    </pre>
  );
};

export default AsciiDashboard;
