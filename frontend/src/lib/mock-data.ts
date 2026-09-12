// PRD Section 9 - Data / API Boundary Definitions & Mock Data

export interface NetworkLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
  bytes: number;
  status?: 'Allowed' | 'Flagged' | 'Dropped';
}

export interface ThreatAlert {
  alertId: string;
  timestamp: string;
  sourceIp: string;
  destIp?: string;
  destinationIp?: string;
  classification: 'DoS' | 'Botnet' | 'Normal' | 'Port Scan' | 'SQL Injection' | 'Data Exfiltration' | 'Brute Force';
  severityLevel: 'low' | 'medium' | 'high';
  severityScore: number; // 0 - 100
  confidencePct: number; // 0 - 100
  status: 'Active' | 'Investigating' | 'Mitigated' | 'Blocked';
  protocol?: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'ICMP';
  bytesTransferred?: string;
  targetAsset?: string;
}

export interface SHAPFeature {
  name: string;
  displayName?: string;
  impact: number;
  impactPct?: number;
  value?: string;
}

export interface AIExplanation {
  alertId: string;
  summary?: string;
  modelConfidence?: number;
  anomalyScore?: number;
  topFeatures: SHAPFeature[];
  recommendation?: {
    playbookTitle: string;
    actionDescription: string;
    commandToExecute: string;
    estimatedImpact: string;
  };
}

export interface MitigationPlaybook {
  playbookTitle?: string;
  classification: string;
  recommendedAction: string;
  commandToExecute: string;
  estimatedImpact?: string;
}

// 1. Mock Network Logs
export const MOCK_NETWORK_LOGS: NetworkLog[] = [
  { id: 'LOG-1001', timestamp: '2026-09-12 18:45:10', sourceIp: '194.26.29.114', destIp: '10.0.4.15', protocol: 'UDP', bytes: 1420500, status: 'Flagged' },
  { id: 'LOG-1002', timestamp: '2026-09-12 18:45:08', sourceIp: '10.0.1.25', destIp: '10.0.2.14', protocol: 'HTTPS', bytes: 4820, status: 'Allowed' },
  { id: 'LOG-1003', timestamp: '2026-09-12 18:45:05', sourceIp: '45.154.255.89', destIp: '10.0.2.88', protocol: 'TCP', bytes: 342900, status: 'Flagged' },
  { id: 'LOG-1004', timestamp: '2026-09-12 18:45:01', sourceIp: '192.168.1.105', destIp: '10.0.2.14', protocol: 'TCP', bytes: 1240, status: 'Allowed' },
  { id: 'LOG-1005', timestamp: '2026-09-12 18:44:55', sourceIp: '185.220.101.5', destIp: '10.0.1.10', protocol: 'TCP', bytes: 48000, status: 'Flagged' },
  { id: 'LOG-1006', timestamp: '2026-09-12 18:44:48', sourceIp: '10.0.3.12', destIp: '10.0.3.40', protocol: 'HTTPS', bytes: 8940, status: 'Allowed' },
  { id: 'LOG-1007', timestamp: '2026-09-12 18:44:42', sourceIp: '103.145.13.22', destIp: '10.0.3.40', protocol: 'HTTPS', bytes: 128400, status: 'Flagged' },
  { id: 'LOG-1008', timestamp: '2026-09-12 18:44:35', sourceIp: '91.240.118.172', destIp: '10.0.5.21', protocol: 'HTTPS', bytes: 840000, status: 'Dropped' },
];

// 2. Mock Threat Alerts
export const MOCK_THREAT_ALERTS: ThreatAlert[] = [
  {
    alertId: 'ALT-9042',
    timestamp: '2026-09-12 18:44:12',
    sourceIp: '194.26.29.114',
    destIp: '10.0.4.15',
    destinationIp: '10.0.4.15',
    classification: 'DoS',
    severityLevel: 'high',
    severityScore: 94,
    confidencePct: 98.4,
    status: 'Active',
    protocol: 'UDP',
    bytesTransferred: '1.42 GB',
    targetAsset: 'App-Gateway-Cluster-01',
  },
  {
    alertId: 'ALT-9041',
    timestamp: '2026-09-12 18:41:40',
    sourceIp: '45.154.255.89',
    destIp: '10.0.2.88',
    destinationIp: '10.0.2.88',
    classification: 'Botnet',
    severityLevel: 'high',
    severityScore: 88,
    confidencePct: 94.7,
    status: 'Active',
    protocol: 'TCP',
    bytesTransferred: '342 MB',
    targetAsset: 'Auth-Service-Node-B',
  },
  {
    alertId: 'ALT-9040',
    timestamp: '2026-09-12 18:38:05',
    sourceIp: '185.220.101.5',
    destIp: '10.0.1.10',
    destinationIp: '10.0.1.10',
    classification: 'Port Scan',
    severityLevel: 'medium',
    severityScore: 68,
    confidencePct: 89.2,
    status: 'Investigating',
    protocol: 'TCP',
    bytesTransferred: '48 KB',
    targetAsset: 'DMZ-Firewall-Edge',
  },
  {
    alertId: 'ALT-9039',
    timestamp: '2026-09-12 18:32:19',
    sourceIp: '103.145.13.22',
    destIp: '10.0.3.40',
    destinationIp: '10.0.3.40',
    classification: 'SQL Injection',
    severityLevel: 'medium',
    severityScore: 62,
    confidencePct: 87.5,
    status: 'Active',
    protocol: 'HTTPS',
    bytesTransferred: '128 KB',
    targetAsset: 'Billing-DB-Primary',
  },
  {
    alertId: 'ALT-9038',
    timestamp: '2026-09-12 18:27:50',
    sourceIp: '91.240.118.172',
    destIp: '10.0.5.21',
    destinationIp: '10.0.5.21',
    classification: 'Data Exfiltration',
    severityLevel: 'high',
    severityScore: 89,
    confidencePct: 96.1,
    status: 'Blocked',
    protocol: 'HTTPS',
    bytesTransferred: '840 MB',
    targetAsset: 'Vault-Storage-S3',
  },
  {
    alertId: 'ALT-9037',
    timestamp: '2026-09-12 18:22:04',
    sourceIp: '192.168.1.105',
    destIp: '10.0.2.14',
    destinationIp: '10.0.2.14',
    classification: 'Normal',
    severityLevel: 'low',
    severityScore: 14,
    confidencePct: 99.1,
    status: 'Mitigated',
    protocol: 'TCP',
    bytesTransferred: '1.2 MB',
    targetAsset: 'Internal-API-Proxy',
  },
  {
    alertId: 'ALT-9036',
    timestamp: '2026-09-12 18:18:32',
    sourceIp: '77.88.55.60',
    destIp: '10.0.4.12',
    destinationIp: '10.0.4.12',
    classification: 'Brute Force',
    severityLevel: 'medium',
    severityScore: 56,
    confidencePct: 83.0,
    status: 'Blocked',
    protocol: 'TCP',
    bytesTransferred: '96 KB',
    targetAsset: 'VPN-Concentrator-02',
  },
  {
    alertId: 'ALT-9035',
    timestamp: '2026-09-12 18:14:15',
    sourceIp: '198.51.100.44',
    destIp: '10.0.4.15',
    destinationIp: '10.0.4.15',
    classification: 'DoS',
    severityLevel: 'high',
    severityScore: 91,
    confidencePct: 97.2,
    status: 'Active',
    protocol: 'UDP',
    bytesTransferred: '890 MB',
    targetAsset: 'App-Gateway-Cluster-01',
  },
  {
    alertId: 'ALT-9034',
    timestamp: '2026-09-12 18:09:48',
    sourceIp: '193.106.191.27',
    destIp: '10.0.2.88',
    destinationIp: '10.0.2.88',
    classification: 'Botnet',
    severityLevel: 'high',
    severityScore: 84,
    confidencePct: 92.8,
    status: 'Investigating',
    protocol: 'TCP',
    bytesTransferred: '210 MB',
    targetAsset: 'Auth-Service-Node-B',
  },
  {
    alertId: 'ALT-9033',
    timestamp: '2026-09-12 18:04:22',
    sourceIp: '10.0.1.45',
    destIp: '10.0.1.1',
    destinationIp: '10.0.1.1',
    classification: 'Normal',
    severityLevel: 'low',
    severityScore: 12,
    confidencePct: 99.4,
    status: 'Mitigated',
    protocol: 'HTTPS',
    bytesTransferred: '4.8 MB',
    targetAsset: 'Core-Router-East',
  },
  {
    alertId: 'ALT-9032',
    timestamp: '2026-09-12 17:58:09',
    sourceIp: '195.201.225.8',
    destIp: '10.0.2.88',
    destinationIp: '10.0.2.88',
    classification: 'Botnet',
    severityLevel: 'high',
    severityScore: 87,
    confidencePct: 95.3,
    status: 'Active',
    protocol: 'TCP',
    bytesTransferred: '512 MB',
    targetAsset: 'Auth-Service-Node-B',
  },
  {
    alertId: 'ALT-9031',
    timestamp: '2026-09-12 17:51:30',
    sourceIp: '172.16.0.12',
    destIp: '10.0.3.40',
    destinationIp: '10.0.3.40',
    classification: 'Normal',
    severityLevel: 'low',
    severityScore: 8,
    confidencePct: 99.8,
    status: 'Mitigated',
    protocol: 'TCP',
    bytesTransferred: '8.4 MB',
    targetAsset: 'Billing-DB-Primary',
  },
];

// 3. Mock AI Explanations
export const MOCK_AI_EXPLANATIONS: Record<string, AIExplanation> = {
  'ALT-9042': {
    alertId: 'ALT-9042',
    summary: 'Extreme spike in unsolicited UDP burst packets originating from known bulletproof subnet with 99.4% uniform inter-arrival variance.',
    modelConfidence: 98.4,
    anomalyScore: 94,
    topFeatures: [
      { name: 'flow_duration', displayName: 'Flow Duration Uniformity', impact: 0.82, impactPct: 42, value: '0.002 ms' },
      { name: 'packet_size', displayName: 'Packet Rate Surge (PPS > 80k)', impact: 0.68, impactPct: 34, value: '84,200 pps' },
      { name: 'dest_port_entropy', displayName: 'Destination Port Spread', impact: 0.30, impactPct: 15, value: '0.94 Entropy' },
      { name: 'geo_reputation', displayName: 'Source IP Threat Intel Feed', impact: 0.18, impactPct: 9, value: 'Malicious ASN' },
    ],
    recommendation: {
      playbookTitle: 'PB-409: Automated UDP Rate Limiting & BGP Flowspec Drop',
      actionDescription: 'Issue border ACL rule to drop all incoming UDP packets from subnet 194.26.29.0/24 and apply ephemeral rate-limiting on port 53/UDP.',
      commandToExecute: 'iptables -A INPUT -s 194.26.29.0/24 -p udp -j DROP && bgp-flowspec announce --prefix 194.26.29.114/32 --action rate-limit-0',
      estimatedImpact: 'Immediate 99.8% reduction in gateway saturation with zero legitimate client disruption.',
    },
  },
  'ALT-9041': {
    alertId: 'ALT-9041',
    summary: 'Periodic C2 beaconing pattern identified with SSL JA3 fingerprint matching Cobalt Strike Command & Control agent.',
    modelConfidence: 94.7,
    anomalyScore: 88,
    topFeatures: [
      { name: 'beacon_regularity', displayName: 'Heartbeat Periodicity (60s)', impact: 0.76, impactPct: 38, value: '60.02s mean' },
      { name: 'ja3_fingerprint', displayName: 'CobaltStrike JA3 Signature Match', impact: 0.58, impactPct: 29, value: 'Matched Signature' },
      { name: 'dns_entropy', displayName: 'High Entropy DGA Query', impact: 0.42, impactPct: 21, value: 'Entropy 4.8' },
      { name: 'outbound_ratio', displayName: 'Asymmetric Upload Ratio', impact: 0.24, impactPct: 12, value: '8.4:1 egress' },
    ],
    recommendation: {
      playbookTitle: 'PB-214: Host Isolation & Active C2 Sinkhole',
      actionDescription: 'Isolate compromised host Auth-Service-Node-B from internal LAN segment and sinkhole DNS queries for destination C2 domain.',
      commandToExecute: 'edr-agent --isolate-host 10.0.2.88 --reason "C2 Beaconing ALT-9041" && sinkhole-dns --domain-pattern "*.tor-exit.net"',
      estimatedImpact: 'Prevents lateral movement and halts active session token exfiltration.',
    },
  },
  'ALT-9035': {
    alertId: 'ALT-9035',
    summary: 'High volume volumetric UDP flood targeted at App Gateway ingress interface.',
    modelConfidence: 97.2,
    anomalyScore: 91,
    topFeatures: [
      { name: 'packet_count', displayName: 'Packet Ingress Spike', impact: 0.85, impactPct: 45, value: '92,000 pps' },
      { name: 'flow_duration', displayName: 'Short Flow Lifespan', impact: 0.60, impactPct: 30, value: '< 1ms' },
      { name: 'ip_reputation', displayName: 'Known Botnet Reflector', impact: 0.35, impactPct: 25, value: 'Tier 1 Botnet' },
    ],
    recommendation: {
      playbookTitle: 'PB-409: BGP Flowspec Ingress Mitigation',
      actionDescription: 'Drop all UDP traffic from source IP 198.51.100.44 on ingress edge routers.',
      commandToExecute: 'bgp-flowspec announce --prefix 198.51.100.44/32 --action drop',
      estimatedImpact: 'Guarantees immediate edge mitigation.',
    },
  },
};

// 4. Mock Mitigation Playbooks
export const MOCK_MITIGATION_PLAYBOOKS: Record<string, MitigationPlaybook> = {
  DoS: {
    playbookTitle: 'PB-409: Volumetric Ingress Rate-Limiting',
    classification: 'DoS',
    recommendedAction: 'Apply border ACL drop rules and announce BGP Flowspec rate-limiting on target UDP/TCP ports.',
    commandToExecute: 'iptables -A INPUT -s $SOURCE_IP -j DROP && bgp-flowspec announce --prefix $SOURCE_IP/32 --action rate-limit-0',
    estimatedImpact: 'Immediate 99.8% traffic mitigation at border gateway.',
  },
  Botnet: {
    playbookTitle: 'PB-214: Host Isolation & DNS Sinkhole',
    classification: 'Botnet',
    recommendedAction: 'Quarantine infected internal host via EDR sensor and blackhole C2 domain queries at DNS resolver.',
    commandToExecute: 'edr-agent --isolate-host $DEST_IP --reason "C2 Activity" && sinkhole-dns --domain-pattern "*.c2-relay.net"',
    estimatedImpact: 'Stops command execution and lateral credential hopping.',
  },
  'Port Scan': {
    playbookTitle: 'PB-102: Perimeter IP Blacklist',
    classification: 'Port Scan',
    recommendedAction: 'Add remote IP to the 24-hour perimeter dynamic blacklist table on DMZ edge firewalls.',
    commandToExecute: 'firewall-cmd --zone=drop --add-source=$SOURCE_IP --timeout=86400',
    estimatedImpact: 'Terminates reconnaissance phase before vulnerability scan.',
  },
  'SQL Injection': {
    playbookTitle: 'PB-305: WAF Regex Virtual Patch',
    classification: 'SQL Injection',
    recommendedAction: 'Deploy ModSecurity WAF regex virtual patch and terminate authenticated database session.',
    commandToExecute: 'waf-ctl --apply-rule "SecRule ARGS \"@rx (?i)(union.*select)\" \"id:9901,phase:2,deny,status:403\""',
    estimatedImpact: 'Guarantees parameter blocking without code downtime.',
  },
  'Data Exfiltration': {
    playbookTitle: 'PB-512: DLP Credentials Quarantine',
    classification: 'Data Exfiltration',
    recommendedAction: 'Revoke temporary IAM credentials for source pod and trigger DLP forensic memory snapshot.',
    commandToExecute: 'aws-iam revoke-role-session --role-name VaultStorageAccess --session-name pod-exfil-9038',
    estimatedImpact: 'Immediate data leak arrest and preservation of forensic evidence.',
  },
  Normal: {
    playbookTitle: 'PB-001: Verified Baseline',
    classification: 'Normal',
    recommendedAction: 'Verified baseline traffic. No defensive action required.',
    commandToExecute: 'echo "Baseline Verified: No Action Required"',
    estimatedImpact: 'Zero risk profile.',
  },
};

// 5. Raw Network Flow Telemetry (CIC-IDS Ingest Format)
export interface RawNetworkLog {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP';
  packetSize: number;
  flowDurationMs: number;
  status: 'Normal' | 'Suspicious' | 'Malicious';
  threatScore: number;
}

export const mockRawNetworkLogs: RawNetworkLog[] = [
  {
    id: 'FLOW-80921',
    timestamp: '18:45:30',
    srcIp: '192.168.1.105',
    srcPort: 54122,
    dstIp: '10.0.0.12',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 1420,
    flowDurationMs: 45,
    status: 'Normal',
    threatScore: 4,
  },
  {
    id: 'FLOW-80922',
    timestamp: '18:45:24',
    srcIp: '198.51.100.44',
    srcPort: 49152,
    dstIp: '10.0.0.8',
    dstPort: 80,
    protocol: 'TCP',
    packetSize: 64200,
    flowDurationMs: 12,
    status: 'Malicious',
    threatScore: 96,
  },
  {
    id: 'FLOW-80923',
    timestamp: '18:45:18',
    srcIp: '45.33.32.156',
    srcPort: 38291,
    dstIp: '10.0.0.4',
    dstPort: 22,
    protocol: 'TCP',
    packetSize: 340,
    flowDurationMs: 110,
    status: 'Suspicious',
    threatScore: 72,
  },
  {
    id: 'FLOW-80924',
    timestamp: '18:45:12',
    srcIp: '10.0.0.15',
    srcPort: 60124,
    dstIp: '8.8.8.8',
    dstPort: 53,
    protocol: 'UDP',
    packetSize: 128,
    flowDurationMs: 8,
    status: 'Normal',
    threatScore: 2,
  },
  {
    id: 'FLOW-80925',
    timestamp: '18:45:05',
    srcIp: '203.0.113.88',
    srcPort: 51200,
    dstIp: '10.0.0.2',
    dstPort: 8080,
    protocol: 'HTTP',
    packetSize: 8940,
    flowDurationMs: 340,
    status: 'Malicious',
    threatScore: 91,
  },
  {
    id: 'FLOW-80926',
    timestamp: '18:44:58',
    srcIp: '192.168.1.110',
    srcPort: 48900,
    dstIp: '10.0.0.14',
    dstPort: 445,
    protocol: 'TCP',
    packetSize: 4200,
    flowDurationMs: 180,
    status: 'Suspicious',
    threatScore: 65,
  },
  {
    id: 'FLOW-80927',
    timestamp: '18:44:51',
    srcIp: '192.168.1.20',
    srcPort: 55432,
    dstIp: '10.0.0.1',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 1280,
    flowDurationMs: 52,
    status: 'Normal',
    threatScore: 6,
  },
  {
    id: 'FLOW-80928',
    timestamp: '18:44:44',
    srcIp: '185.220.101.5',
    srcPort: 61002,
    dstIp: '10.0.0.5',
    dstPort: 3389,
    protocol: 'TCP',
    packetSize: 1560,
    flowDurationMs: 25,
    status: 'Malicious',
    threatScore: 88,
  },
  {
    id: 'FLOW-80929',
    timestamp: '18:44:38',
    srcIp: '10.0.0.30',
    srcPort: 0,
    dstIp: '10.0.0.1',
    dstPort: 0,
    protocol: 'ICMP',
    packetSize: 64,
    flowDurationMs: 2,
    status: 'Normal',
    threatScore: 0,
  },
  {
    id: 'FLOW-80930',
    timestamp: '18:44:30',
    srcIp: '194.26.29.112',
    srcPort: 44120,
    dstIp: '10.0.0.9',
    dstPort: 80,
    protocol: 'HTTP',
    packetSize: 18450,
    flowDurationMs: 420,
    status: 'Suspicious',
    threatScore: 68,
  },
  {
    id: 'FLOW-80931',
    timestamp: '18:44:22',
    srcIp: '192.168.1.45',
    srcPort: 58902,
    dstIp: '10.0.0.3',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 2048,
    flowDurationMs: 65,
    status: 'Normal',
    threatScore: 5,
  },
  {
    id: 'FLOW-80932',
    timestamp: '18:44:15',
    srcIp: '103.21.244.0',
    srcPort: 52331,
    dstIp: '10.0.0.2',
    dstPort: 8080,
    protocol: 'TCP',
    packetSize: 124500,
    flowDurationMs: 5,
    status: 'Malicious',
    threatScore: 98,
  },
  {
    id: 'FLOW-80933',
    timestamp: '18:44:08',
    srcIp: '192.168.1.80',
    srcPort: 47200,
    dstIp: '10.0.0.10',
    dstPort: 3306,
    protocol: 'TCP',
    packetSize: 560,
    flowDurationMs: 38,
    status: 'Normal',
    threatScore: 3,
  },
  {
    id: 'FLOW-80934',
    timestamp: '18:44:01',
    srcIp: '91.240.118.172',
    srcPort: 39014,
    dstIp: '10.0.0.8',
    dstPort: 80,
    protocol: 'HTTP',
    packetSize: 12200,
    flowDurationMs: 290,
    status: 'Malicious',
    threatScore: 89,
  },
  {
    id: 'FLOW-80935',
    timestamp: '18:43:55',
    srcIp: '10.0.0.18',
    srcPort: 53120,
    dstIp: '1.1.1.1',
    dstPort: 53,
    protocol: 'UDP',
    packetSize: 256,
    flowDurationMs: 14,
    status: 'Normal',
    threatScore: 1,
  },
  {
    id: 'FLOW-80936',
    timestamp: '18:43:48',
    srcIp: '192.168.1.19',
    srcPort: 59001,
    dstIp: '10.0.0.1',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 980,
    flowDurationMs: 40,
    status: 'Normal',
    threatScore: 2,
  },
  {
    id: 'FLOW-80937',
    timestamp: '18:43:40',
    srcIp: '185.190.140.22',
    srcPort: 41200,
    dstIp: '10.0.0.6',
    dstPort: 8443,
    protocol: 'TCP',
    packetSize: 2450,
    flowDurationMs: 210,
    status: 'Suspicious',
    threatScore: 61,
  },
  {
    id: 'FLOW-80938',
    timestamp: '18:43:32',
    srcIp: '192.168.1.72',
    srcPort: 51888,
    dstIp: '10.0.0.4',
    dstPort: 22,
    protocol: 'TCP',
    packetSize: 480,
    flowDurationMs: 95,
    status: 'Normal',
    threatScore: 8,
  },
  {
    id: 'FLOW-80939',
    timestamp: '18:43:25',
    srcIp: '198.51.100.19',
    srcPort: 60233,
    dstIp: '10.0.0.2',
    dstPort: 8080,
    protocol: 'HTTP',
    packetSize: 34100,
    flowDurationMs: 16,
    status: 'Malicious',
    threatScore: 94,
  },
  {
    id: 'FLOW-80940',
    timestamp: '18:43:18',
    srcIp: '10.0.0.22',
    srcPort: 0,
    dstIp: '10.0.0.5',
    dstPort: 0,
    protocol: 'ICMP',
    packetSize: 64,
    flowDurationMs: 1,
    status: 'Normal',
    threatScore: 0,
  },
  {
    id: 'FLOW-80941',
    timestamp: '18:43:10',
    srcIp: '192.168.1.102',
    srcPort: 50444,
    dstIp: '10.0.0.12',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 1890,
    flowDurationMs: 48,
    status: 'Normal',
    threatScore: 4,
  },
  {
    id: 'FLOW-80942',
    timestamp: '18:43:02',
    srcIp: '45.143.220.6',
    srcPort: 48110,
    dstIp: '10.0.0.7',
    dstPort: 9200,
    protocol: 'TCP',
    packetSize: 5200,
    flowDurationMs: 310,
    status: 'Suspicious',
    threatScore: 74,
  },
  {
    id: 'FLOW-80943',
    timestamp: '18:42:55',
    srcIp: '192.168.1.60',
    srcPort: 56780,
    dstIp: '10.0.0.3',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 1350,
    flowDurationMs: 50,
    status: 'Normal',
    threatScore: 3,
  },
  {
    id: 'FLOW-80944',
    timestamp: '18:42:48',
    srcIp: '178.62.204.101',
    srcPort: 53900,
    dstIp: '10.0.0.8',
    dstPort: 80,
    protocol: 'TCP',
    packetSize: 98400,
    flowDurationMs: 9,
    status: 'Malicious',
    threatScore: 97,
  },
  {
    id: 'FLOW-80945',
    timestamp: '18:42:40',
    srcIp: '10.0.0.14',
    srcPort: 55122,
    dstIp: '8.8.4.4',
    dstPort: 53,
    protocol: 'UDP',
    packetSize: 160,
    flowDurationMs: 11,
    status: 'Normal',
    threatScore: 1,
  },
  {
    id: 'FLOW-80946',
    timestamp: '18:42:30',
    srcIp: '192.168.1.15',
    srcPort: 51234,
    dstIp: '10.0.0.11',
    dstPort: 5432,
    protocol: 'TCP',
    packetSize: 720,
    flowDurationMs: 35,
    status: 'Normal',
    threatScore: 2,
  },
  {
    id: 'FLOW-80947',
    timestamp: '18:42:20',
    srcIp: '195.154.122.9',
    srcPort: 37890,
    dstIp: '10.0.0.4',
    dstPort: 21,
    protocol: 'TCP',
    packetSize: 1200,
    flowDurationMs: 440,
    status: 'Suspicious',
    threatScore: 63,
  },
  {
    id: 'FLOW-80948',
    timestamp: '18:42:10',
    srcIp: '192.168.1.108',
    srcPort: 58112,
    dstIp: '10.0.0.1',
    dstPort: 443,
    protocol: 'TCP',
    packetSize: 1640,
    flowDurationMs: 42,
    status: 'Normal',
    threatScore: 4,
  },
];

// 6. Threat Vector Signatures & SHAP Attribution Data
export interface ThreatVector {
  id: string;
  name: string;
  category: string;
  frequency: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  shapFeatures: { feature: string; impact: number }[];
  mitigationPlaybook: { action: string; codeSnippet: string };
}

export const mockThreatVectors: ThreatVector[] = [
  {
    id: 'TV-001',
    name: 'DDoS Attack (SYN Flood)',
    category: 'Volumetric / Denial of Service',
    frequency: '3,420 events / hr',
    severity: 'High',
    description: 'High-volume TCP SYN packet burst exploiting half-open connections to exhaust kernel connection tables and overwhelm target gateway sockets.',
    shapFeatures: [
      { feature: 'SYN Packet Ratio', impact: 0.88 },
      { feature: 'Flow Duration (< 10ms)', impact: 0.74 },
      { feature: 'Inter-arrival Uniformity', impact: 0.58 },
      { feature: 'Destination Port Entropy', impact: 0.42 },
      { feature: 'Packet Size Variance', impact: 0.22 },
    ],
    mitigationPlaybook: {
      action: 'Apply kernel TCP syncookies, throttle half-open state allocations, and broadcast BGP Flowspec rate-limiting on border edge routers.',
      codeSnippet: `sysctl -w net.ipv4.tcp_syncookies=1\niptables -A INPUT -p tcp --syn -m limit --limit 50/s --limit-burst 100 -j ACCEPT\nbgp-flowspec announce --match "proto tcp & flags syn" --action rate-limit-0`,
    },
  },
  {
    id: 'TV-002',
    name: 'Web Exploit (SQL Injection)',
    category: 'Application Layer / Exploitation',
    frequency: '840 events / hr',
    severity: 'High',
    description: 'Malicious SQL payload injection detected across HTTP POST requests attempting unauthorized authentication bypass and database schema extraction.',
    shapFeatures: [
      { feature: 'SQL Keyword Entropy', impact: 0.92 },
      { feature: 'Payload Hex Density', impact: 0.68 },
      { feature: 'URI Parameter Length', impact: 0.52 },
      { feature: 'HTTP Error Rate (403/500)', impact: 0.38 },
      { feature: 'User-Agent Anomaly Score', impact: 0.25 },
    ],
    mitigationPlaybook: {
      action: 'Deploy WAF regex signature virtual patch on ingress reverse proxy and terminate active database connection pool sessions.',
      codeSnippet: `waf-ctl --apply-rule "SecRule ARGS \\"@rx (?i)(union.*select|or\\s+1=1|drop\\s+table)\\" \\"id:9901,phase:2,deny,status:403\\""\npkill -u db_webapp -f "active_query"`,
    },
  },
  {
    id: 'TV-003',
    name: 'Botnet (C2 Beaconing)',
    category: 'Malware / Command & Control',
    frequency: '1,120 events / hr',
    severity: 'Medium',
    description: 'Periodic heartbeat beacons communicating with compromised external infrastructure and suspected darknet command-and-control servers.',
    shapFeatures: [
      { feature: 'Periodic Jitter (< 2%)', impact: 0.82 },
      { feature: 'Known Threat Intel CIDR', impact: 0.71 },
      { feature: 'Small Fixed Frame Size', impact: 0.48 },
      { feature: 'DNS DGA Probability', impact: 0.36 },
      { feature: 'Outbound Port Anomaly', impact: 0.19 },
    ],
    mitigationPlaybook: {
      action: 'Quarantine infected internal host via EDR agent and sinkhole C2 domain queries at local DNS resolver.',
      codeSnippet: `edr-agent --isolate-host 10.0.0.14 --reason "C2 Beaconing Pattern"\nsinkhole-dns --domain-pattern "*.c2-relay.net" --redirect-ip 127.0.0.1`,
    },
  },
  {
    id: 'TV-004',
    name: 'Port Scan & Reconnaissance',
    category: 'Reconnaissance / Probe',
    frequency: '2,890 events / hr',
    severity: 'Low',
    description: 'Sequential scanning of TCP ports across internal subnets to discover listening services and unpatched network vulnerabilities.',
    shapFeatures: [
      { feature: 'Distinct Port Count (> 50)', impact: 0.79 },
      { feature: 'RST Packet Response Rate', impact: 0.62 },
      { feature: 'Rapid Scan Inter-arrival', impact: 0.45 },
      { feature: 'SYN-ACK Missing Ratio', impact: 0.31 },
      { feature: 'Source IP Geo-Risk Score', impact: 0.15 },
    ],
    mitigationPlaybook: {
      action: 'Add scanning remote source IP to the 24-hour perimeter dynamic blacklist table on DMZ edge firewalls.',
      codeSnippet: `firewall-cmd --zone=drop --add-source=$SOURCE_IP --timeout=86400\niptables -A INPUT -m recent --name portscan --rcheck --seconds 86400 -j DROP`,
    },
  },
];

// -------------------------------------------------------------
// PRD-Aligned Security Alert Schema & 15 Mock Records
// -------------------------------------------------------------
export interface SecurityAlertRecord {
  id: string;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  is_attack: boolean;
  attack_type: string;
  confidence: number; // 0 - 100
  risk_score: number; // 0 - 100
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  anomaly_score: number;
  human_explanation: string;
  recommended_actions: string[];
}

export const MOCK_SECURITY_ALERTS: SecurityAlertRecord[] = [
  {
    id: 'ALT-7001',
    timestamp: '2026-09-12 18:45:22',
    src_ip: '198.51.100.44',
    dst_ip: '10.0.4.15',
    is_attack: true,
    attack_type: 'DoS (SYN Flood)',
    confidence: 98.4,
    risk_score: 94,
    severity: 'CRITICAL',
    anomaly_score: 0.942,
    human_explanation: 'Abnormal SYN packet ingress volume exceeding 48k pkts/sec. High ratio of half-open TCP handshakes detected targeting Prod-DB-Primary with near-zero flow duration.',
    recommended_actions: [
      'Enforce BGP Flowspec ingress drop rule on border router',
      'Enable Linux kernel SYN cookies (net.ipv4.tcp_syncookies = 1)',
      'Rate-limit subnet ingress to 500 pkts/sec via iptables',
    ],
  },
  {
    id: 'ALT-7002',
    timestamp: '2026-09-12 18:44:08',
    src_ip: '203.0.113.88',
    dst_ip: '10.0.1.10',
    is_attack: true,
    attack_type: 'SQL Injection (Union-Based)',
    confidence: 96.1,
    risk_score: 91,
    severity: 'CRITICAL',
    anomaly_score: 0.915,
    human_explanation: 'Malicious SQL syntax injection pattern observed in HTTP POST /api/v1/auth/login. Hex-encoded payloads attempting schema metadata extraction.',
    recommended_actions: [
      'Apply WAF virtual patch rule #942100 on Cloudflare / Envoy',
      'Isolate application pod and rotate database connection pool credentials',
      'Trigger static code analysis scan on authentication API handler',
    ],
  },
  {
    id: 'ALT-7003',
    timestamp: '2026-09-12 18:42:55',
    src_ip: '45.33.32.156',
    dst_ip: '10.0.2.88',
    is_attack: true,
    attack_type: 'Botnet C2 Beaconing',
    confidence: 94.7,
    risk_score: 88,
    severity: 'CRITICAL',
    anomaly_score: 0.884,
    human_explanation: 'Periodic outbound heartbeat bursts at exact 45.0s intervals with high Shannon entropy payload, matching known Mirai / CobaltStrike telemetry.',
    recommended_actions: [
      'Sever egress DNS tunneling connection to command-and-control IP',
      'Quarantine internal host 10.0.2.88 via EDR agent isolation',
      'Extract memory dump and check for persistent cron daemon injection',
    ],
  },
  {
    id: 'ALT-7004',
    timestamp: '2026-09-12 18:40:19',
    src_ip: '194.26.29.112',
    dst_ip: '10.0.3.40',
    is_attack: true,
    attack_type: 'Horizontal Port Scan',
    confidence: 89.5,
    risk_score: 76,
    severity: 'HIGH',
    anomaly_score: 0.762,
    human_explanation: 'Sequential SYN scanning across 1,024 destination ports within 1.8 seconds. Target port probing identified across management subnets.',
    recommended_actions: [
      'Add dynamic blackhole routing rule for 194.26.29.112 on perimeter firewall',
      'Close unauthenticated SSH / RDP ports on DMZ subnet',
      'Audit exposed honeypot telemetry for automated scanning fingerprints',
    ],
  },
  {
    id: 'ALT-7005',
    timestamp: '2026-09-12 18:38:44',
    src_ip: '185.220.101.5',
    dst_ip: '10.0.5.21',
    is_attack: true,
    attack_type: 'Data Exfiltration (HTTPS Tunnel)',
    confidence: 92.3,
    risk_score: 78,
    severity: 'HIGH',
    anomaly_score: 0.781,
    human_explanation: 'Sustained asymmetric outbound HTTPS bandwidth spike (>840 MB) from sensitive S3-backed vault storage node to Tor exit relay.',
    recommended_actions: [
      'Revoke AWS IAM role session tokens for Vault-Storage-S3 instance',
      'Inspect SSL/TLS egress proxy connection logs for exfiltrated file hashes',
      'Enable AWS GuardDuty S3 anomalous API invocation alerts',
    ],
  },
  {
    id: 'ALT-7006',
    timestamp: '2026-09-12 18:35:10',
    src_ip: '77.88.55.60',
    dst_ip: '10.0.4.12',
    is_attack: true,
    attack_type: 'Brute Force (SSH Credential Stuffing)',
    confidence: 87.8,
    risk_score: 72,
    severity: 'HIGH',
    anomaly_score: 0.725,
    human_explanation: 'Over 450 failed SSH authentication attempts within 60 seconds from external IP with dictionary-based username permutations.',
    recommended_actions: [
      'Enforce fail2ban jail IP ban on VPN-Concentrator-02',
      'Require FIDO2 / hardware MFA for all administrative SSH bastions',
      'Disable password authentication in /etc/ssh/sshd_config',
    ],
  },
  {
    id: 'ALT-7007',
    timestamp: '2026-09-12 18:31:02',
    src_ip: '103.145.13.22',
    dst_ip: '10.0.1.10',
    is_attack: true,
    attack_type: 'Web Exploit (Remote Code Execution)',
    confidence: 85.4,
    risk_score: 74,
    severity: 'HIGH',
    anomaly_score: 0.748,
    human_explanation: 'Attempted Log4j JNDI lookup string ${jndi:ldap://...} detected in User-Agent header of incoming HTTP requests.',
    recommended_actions: [
      'Block JNDI payload regex at application load balancer layer',
      'Verify JVM flag -Dlog4j2.formatMsgNoLookups=true is active across all pods',
      'Upgrade Apache Log4j dependencies to latest patched version',
    ],
  },
  {
    id: 'ALT-7008',
    timestamp: '2026-09-12 18:28:15',
    src_ip: '195.201.225.8',
    dst_ip: '10.0.2.14',
    is_attack: true,
    attack_type: 'Kerberoasting Attack',
    confidence: 81.2,
    risk_score: 68,
    severity: 'MEDIUM',
    anomaly_score: 0.682,
    human_explanation: 'Excessive Kerberos TGS-REQ requests requesting RC4-encrypted service tickets for high-privilege service accounts.',
    recommended_actions: [
      'Rotate service account passwords to >25 character random strings',
      'Enforce AES256-only Kerberos encryption policy across Active Directory',
      'Audit Group Policy for unconstrained delegation privileges',
    ],
  },
  {
    id: 'ALT-7009',
    timestamp: '2026-09-12 18:24:50',
    src_ip: '91.240.118.172',
    dst_ip: '10.0.3.12',
    is_attack: true,
    attack_type: 'DNS Tunneling / Data Leak',
    confidence: 79.6,
    risk_score: 64,
    severity: 'MEDIUM',
    anomaly_score: 0.640,
    human_explanation: 'High frequency of TXT and NULL record queries for abnormally long subdomains (>180 chars) to rogue authoritative name servers.',
    recommended_actions: [
      'Filter external DNS queries to enterprise Umbrella / Cloudflare resolvers',
      'Block domain root on recursive DNS resolver daemon',
      'Inspect endpoint DNS client cache for unauthorized resolving services',
    ],
  },
  {
    id: 'ALT-7010',
    timestamp: '2026-09-12 18:20:30',
    src_ip: '104.244.42.1',
    dst_ip: '10.0.4.15',
    is_attack: true,
    attack_type: 'Cross-Site Scripting (Reflected XSS)',
    confidence: 77.0,
    risk_score: 58,
    severity: 'MEDIUM',
    anomaly_score: 0.584,
    human_explanation: 'URI parameters containing <script> tag injections and DOM manipulation strings targeting session cookies.',
    recommended_actions: [
      'Enable strict Content-Security-Policy (CSP) headers with nonces',
      'Enforce HTML entity encoding on all reflected input parameters',
      'Set HttpOnly and SameSite=Strict flags on authentication session cookies',
    ],
  },
  {
    id: 'ALT-7011',
    timestamp: '2026-09-12 18:16:12',
    src_ip: '193.106.191.27',
    dst_ip: '10.0.1.45',
    is_attack: true,
    attack_type: 'Slowloris (Low & Slow DoS)',
    confidence: 74.5,
    risk_score: 52,
    severity: 'MEDIUM',
    anomaly_score: 0.520,
    human_explanation: 'Multiple incomplete HTTP request headers holding open socket connections without completing transmission, draining web server thread pool.',
    recommended_actions: [
      'Set aggressive client header timeout on NGINX (client_header_timeout 5s)',
      'Limit concurrent open connections per IP to 15 via mod_reqtimeout',
      'Place Envoy proxy with buffer queuing in front of backend servers',
    ],
  },
  {
    id: 'ALT-7012',
    timestamp: '2026-09-12 18:11:45',
    src_ip: '192.168.1.105',
    dst_ip: '10.0.2.14',
    is_attack: false,
    attack_type: 'Normal Traffic (Internal Backup Stream)',
    confidence: 99.2,
    risk_score: 14,
    severity: 'LOW',
    anomaly_score: 0.142,
    human_explanation: 'Scheduled weekly database incremental snapshot transfer between trusted VPC subnet hosts. Protocol conformant.',
    recommended_actions: [
      'Mark traffic flow signature as verified baseline in Isolation Forest',
      'No defensive mitigation required; telemetry logged for compliance audit',
    ],
  },
  {
    id: 'ALT-7013',
    timestamp: '2026-09-12 18:07:20',
    src_ip: '10.0.1.45',
    dst_ip: '10.0.1.1',
    is_attack: false,
    attack_type: 'Normal Traffic (NTP & Core Healthcheck)',
    confidence: 99.6,
    risk_score: 8,
    severity: 'LOW',
    anomaly_score: 0.082,
    human_explanation: 'Standard NTP clock synchronization packets on UDP port 123 from Core-Router-East to internal time source.',
    recommended_actions: [
      'Maintain active monitoring; traffic complies with SLA baseline parameters',
    ],
  },
  {
    id: 'ALT-7014',
    timestamp: '2026-09-12 18:02:11',
    src_ip: '172.16.0.12',
    dst_ip: '10.0.3.40',
    is_attack: false,
    attack_type: 'Normal Traffic (Kubernetes Pod Telemetry)',
    confidence: 98.9,
    risk_score: 11,
    severity: 'LOW',
    anomaly_score: 0.110,
    human_explanation: 'Prometheus metric scraping poll on internal gRPC endpoint. Expected flow duration and regular intervals.',
    recommended_actions: [
      'Traffic signature verified safe; no mitigation required',
    ],
  },
  {
    id: 'ALT-7015',
    timestamp: '2026-09-12 17:58:33',
    src_ip: '10.0.3.12',
    dst_ip: '10.0.3.40',
    is_attack: false,
    attack_type: 'Normal Traffic (OAuth Token Refresh)',
    confidence: 99.4,
    risk_score: 9,
    severity: 'LOW',
    anomaly_score: 0.091,
    human_explanation: 'Encrypted TLS 1.3 key exchange for microservice token authorization with verified mTLS certificates.',
    recommended_actions: [
      'Routine authorization flow; baseline signature registered',
    ],
  },
];

export const mockAlertRecords = MOCK_SECURITY_ALERTS;
export const mockSecurityAlerts = MOCK_SECURITY_ALERTS;
