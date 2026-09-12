export * from '@/lib/mock-data';

export interface TargetedDevice {
  id: string;
  name: string;
  ip: string;
  type: 'Server' | 'Firewall' | 'Database' | 'Workstation' | 'Gateway';
  threatCount: number;
  status: 'Critical' | 'Warning' | 'Healthy';
  lastPing: string;
}

export interface KpiMetric {
  title: string;
  value: string;
  changePct: string;
  isIncreasePositive: boolean;
  subtitle: string;
  iconName: string;
}

export interface TrafficDataPoint {
  time: string;
  normal: number;
  malicious: number;
}

export interface ClassificationDataPoint {
  name: string;
  value: number;
  color: string;
}
