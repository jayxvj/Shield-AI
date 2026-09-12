/**
 * Shield-AI API client
 * Connects to the FastAPI backend via the Next.js rewrite proxy at /api/backend
 */

const API_BASE = '/api/backend/api/v1';

// ── Backend schema (mirrors backend/schemas.py) ──────────────────────────────

export type BackendSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type BackendStatus =
  | 'detected'
  | 'analyzing'
  | 'mitigated'
  | 'resolved'
  | 'false_positive';

export interface BackendThreat {
  id: number;
  threat_type: string;
  severity: BackendSeverity;
  status: BackendStatus;
  source_ip: string | null;
  destination_ip: string | null;
  description: string;
  ai_analysis: string | null;
  confidence_score: number | null;
  detected_at: string;
  updated_at: string | null;
  resolved_at: string | null;
  mitigation_action: string | null;
}

export interface BackendThreatCreate {
  threat_type: string;
  severity: BackendSeverity;
  source_ip?: string | null;
  destination_ip?: string | null;
  description: string;
  confidence_score?: number | null;
}

export interface BackendThreatUpdate {
  status?: BackendStatus;
  ai_analysis?: string | null;
  mitigation_action?: string | null;
  resolved_at?: string | null;
}

// ── Mapping: BackendThreat → frontend ThreatAlert ────────────────────────────

import type { ThreatAlert } from './mock-data';

function severityMap(s: BackendSeverity): ThreatAlert['severityLevel'] {
  if (s === 'critical' || s === 'high') return 'high';
  if (s === 'medium') return 'medium';
  return 'low';
}

function statusMap(s: BackendStatus): ThreatAlert['status'] {
  switch (s) {
    case 'mitigated':
    case 'resolved':
      return 'Mitigated';
    case 'analyzing':
      return 'Investigating';
    case 'false_positive':
      return 'Blocked';
    default:
      return 'Active';
  }
}

export function backendThreatToAlert(t: BackendThreat): ThreatAlert {
  return {
    alertId: `ALT-${String(t.id).padStart(4, '0')}`,
    timestamp: t.detected_at,
    sourceIp: t.source_ip ?? '0.0.0.0',
    destIp: t.destination_ip ?? undefined,
    destinationIp: t.destination_ip ?? undefined,
    classification: t.threat_type as ThreatAlert['classification'],
    severityLevel: severityMap(t.severity),
    severityScore: t.confidence_score != null ? Math.round(t.confidence_score * 100) : 50,
    confidencePct: t.confidence_score != null ? Math.round(t.confidence_score * 100) : 50,
    status: statusMap(t.status),
    targetAsset: t.destination_ip ?? undefined,
  };
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export const threatsApi = {
  /** List threats, optionally filtered */
  list(params?: {
    skip?: number;
    limit?: number;
    severity?: BackendSeverity;
    status_filter?: BackendStatus;
  }): Promise<BackendThreat[]> {
    const qs = new URLSearchParams();
    if (params?.skip != null) qs.set('skip', String(params.skip));
    if (params?.limit != null) qs.set('limit', String(params.limit));
    if (params?.severity) qs.set('severity', params.severity);
    if (params?.status_filter) qs.set('status_filter', params.status_filter);
    const query = qs.toString();
    return request<BackendThreat[]>(`/threats/${query ? `?${query}` : ''}`);
  },

  /** Get single threat */
  get(id: number): Promise<BackendThreat> {
    return request<BackendThreat>(`/threats/${id}`);
  },

  /** Create a new threat */
  create(data: BackendThreatCreate): Promise<BackendThreat> {
    return request<BackendThreat>('/threats/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Update an existing threat */
  update(id: number, data: BackendThreatUpdate): Promise<BackendThreat> {
    return request<BackendThreat>(`/threats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Delete a threat */
  delete(id: number): Promise<void> {
    return request<void>(`/threats/${id}`, { method: 'DELETE' });
  },

  /** Health check */
  health(): Promise<{ status: string }> {
    return fetch('/api/backend/health').then((r) => r.json());
  },
};
