/**
 * API client for the Live Monitoring backend endpoints.
 * All requests go through the existing Next.js proxy at /api/backend.
 * No existing api.ts code is modified.
 */

const LM_BASE = '/api/backend/api/live-monitoring';

// ── Types (mirror backend/live_monitoring/schemas.py) ────────────────────────

export interface NetworkInterface {
  name: string;
  description: string;
  is_up: boolean;
}

export interface MonitoringStatus {
  feature_enabled: boolean;
  is_capturing: boolean;
  selected_interface: string | null;
  session_started_at: string | null;
  packets_captured: number;
  flows_processed: number;
  packets_per_second: number;
  flows_per_second: number;
  error_message: string | null;
}

export interface SHAPFeature {
  feature: string;
  display_name: string;
  impact: number;
  impact_pct: number;
}

export interface LiveAlert {
  alert_id: string;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  source_port: number;
  destination_port: number;
  protocol: string;
  flow_duration_ms: number;
  bytes_transferred: number;
  packets_in_flow: number;
  is_attack: boolean;
  attack_type: string;
  confidence: number;
  risk_score: number;
  anomaly_score: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  shap_features: SHAPFeature[];
  human_explanation: string;
  recommended_actions: string[];
}

export interface TimelineBucket {
  time: string;
  normal: number;
  suspicious: number;
}

export interface LiveStats {
  window_seconds: number;
  total_flows: number;
  normal_flows: number;
  suspicious_flows: number;
  packets_per_second: number;
  flows_per_second: number;
  top_attack_type: string | null;
  current_risk_score: number;
  anomaly_rate_pct: number;
  recent_alerts: LiveAlert[];
  timeline: TimelineBucket[];
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${LM_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Live Monitoring API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── API methods ───────────────────────────────────────────────────────────────

export const liveMonitoringApi = {
  getStatus(): Promise<MonitoringStatus> {
    return request<MonitoringStatus>('/status');
  },

  getInterfaces(): Promise<NetworkInterface[]> {
    return request<NetworkInterface[]>('/interfaces');
  },

  startCapture(iface: string): Promise<MonitoringStatus> {
    return request<MonitoringStatus>('/start', {
      method: 'POST',
      body: JSON.stringify({ interface: iface }),
    });
  },

  stopCapture(): Promise<MonitoringStatus> {
    return request<MonitoringStatus>('/stop', { method: 'POST' });
  },

  getStats(): Promise<LiveStats> {
    return request<LiveStats>('/stats');
  },

  getAlerts(limit = 50): Promise<LiveAlert[]> {
    return request<LiveAlert[]>(`/alerts?limit=${limit}`);
  },
};
