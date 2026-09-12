import { ThreatAlert, AIExplanation, TargetedDevice, KpiMetric, TrafficDataPoint, ClassificationDataPoint } from '../types/threat';
import { MOCK_THREAT_ALERTS, MOCK_AI_EXPLANATIONS } from '../lib/mock-data';

export const KPI_METRICS: KpiMetric[] = [
  {
    title: 'Total Packets Analyzed',
    value: '4.82M',
    changePct: '+12.4%',
    isIncreasePositive: true,
    subtitle: 'Past 24 hours throughput',
    iconName: 'Activity',
  },
  {
    title: 'Anomalies Detected',
    value: '1,429',
    changePct: '+8.1%',
    isIncreasePositive: false,
    subtitle: 'Flagged by Isolation Forest',
    iconName: 'AlertTriangle',
  },
  {
    title: 'High-Risk Threats',
    value: '38',
    changePct: '-14.3%',
    isIncreasePositive: true,
    subtitle: 'Requiring analyst triage',
    iconName: 'ShieldAlert',
  },
  {
    title: 'Auto-Mitigated Events',
    value: '1,391',
    changePct: '+96.2%',
    isIncreasePositive: true,
    subtitle: 'Zero-touch policy executions',
    iconName: 'ShieldCheck',
  },
];

export const OVERALL_RISK_SCORE = 74;

export const TRAFFIC_TIMELINE_DATA: TrafficDataPoint[] = [
  { time: '00:00', normal: 2100, malicious: 120 },
  { time: '01:00', normal: 1950, malicious: 90 },
  { time: '02:00', normal: 1800, malicious: 80 },
  { time: '03:00', normal: 1750, malicious: 110 },
  { time: '04:00', normal: 1900, malicious: 95 },
  { time: '05:00', normal: 2300, malicious: 140 },
  { time: '06:00', normal: 2800, malicious: 160 },
  { time: '07:00', normal: 3400, malicious: 210 },
  { time: '08:00', normal: 4100, malicious: 290 },
  { time: '09:00', normal: 4700, malicious: 340 },
  { time: '10:00', normal: 5050, malicious: 410 },
  { time: '11:00', normal: 4900, malicious: 380 },
  { time: '12:00', normal: 4600, malicious: 310 },
  { time: '13:00', normal: 4800, malicious: 350 },
  { time: '14:00', normal: 5200, malicious: 420 },
  { time: '15:00', normal: 5800, malicious: 890 }, // Infiltration surge
  { time: '16:00', normal: 5400, malicious: 620 },
  { time: '17:00', normal: 4900, malicious: 380 },
  { time: '18:00', normal: 5100, malicious: 750 }, // Second peak
  { time: '19:00', normal: 5300, malicious: 490 },
  { time: '20:00', normal: 4700, malicious: 310 },
  { time: '21:00', normal: 4300, malicious: 260 },
  { time: '22:00', normal: 3900, malicious: 210 },
  { time: '23:00', normal: 3400, malicious: 170 },
];

export const ATTACK_CLASSIFICATION_DATA: ClassificationDataPoint[] = [
  { name: 'DoS Floods', value: 38, color: '#A36361' },
  { name: 'Botnet C2', value: 24, color: '#D3A29D' },
  { name: 'Port Scan / Recon', value: 18, color: '#E8B298' },
  { name: 'SQL Injection', value: 12, color: '#EECC8C' },
  { name: 'Normal / Baseline', value: 8, color: '#9EABA2' },
];

export const THREAT_ALERTS: ThreatAlert[] = MOCK_THREAT_ALERTS;
export const AI_EXPLANATIONS: Record<string, AIExplanation> = MOCK_AI_EXPLANATIONS;

export const TARGETED_DEVICES: TargetedDevice[] = [
  {
    id: 'DEV-01',
    name: 'App-Gateway-Cluster-01',
    ip: '10.0.4.15',
    type: 'Gateway',
    threatCount: 14,
    status: 'Critical',
    lastPing: '2s ago',
  },
  {
    id: 'DEV-02',
    name: 'Auth-Service-Node-B',
    ip: '10.0.2.88',
    type: 'Server',
    threatCount: 8,
    status: 'Critical',
    lastPing: '5s ago',
  },
  {
    id: 'DEV-03',
    name: 'Billing-DB-Primary',
    ip: '10.0.3.40',
    type: 'Database',
    threatCount: 3,
    status: 'Warning',
    lastPing: '12s ago',
  },
  {
    id: 'DEV-04',
    name: 'DMZ-Firewall-Edge',
    ip: '10.0.1.10',
    type: 'Firewall',
    threatCount: 2,
    status: 'Warning',
    lastPing: '1s ago',
  },
  {
    id: 'DEV-05',
    name: 'Vault-Storage-S3',
    ip: '10.0.5.21',
    type: 'Server',
    threatCount: 1,
    status: 'Healthy',
    lastPing: '4s ago',
  },
  {
    id: 'DEV-06',
    name: 'Internal-API-Proxy',
    ip: '10.0.2.14',
    type: 'Server',
    threatCount: 0,
    status: 'Healthy',
    lastPing: '1s ago',
  },
];
