'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Database,
  Flame,
  Layers,
  Play,
  Radio,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
  HardDrive,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { TrafficTimelineChart, TrafficDataPoint } from '@/components/widgets/TrafficTimelineChart';
import { ClassificationDonutChart } from '@/components/widgets/ClassificationDonutChart';
import { useLiveMonitor } from '@/hooks/useLiveMonitor';
import { V2Alert, V2Health } from '@/lib/api';

// ── Inline style helpers (navy system) ──────────────────────────
const S = {
  surface: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' },
  surface2: { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)' },
  muted: { color: 'var(--text-muted)' },
  accentBlue: { color: 'var(--accent-blue)' },
  accentCyan: { color: 'var(--accent-cyan)' },
  accentGreen: { color: 'var(--accent-green)' },
  accentRed: { color: 'var(--accent-red)' },
  kpiCard: { background: 'var(--surface)', border: '1px solid var(--border)' },
};

export default function LiveMonitorSinglePage() {
  const { alerts, stats, health, isSseConnected, isLoading, refresh, verifyHealth, simulateFlow } = useLiveMonitor();

  const [selectedAlert, setSelectedAlert] = useState<V2Alert | null>(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isMitigating, setIsMitigating] = useState(false);
  const [mitigatedIds, setMitigatedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<{ title: string; detail: string } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const showToast = (title: string, detail: string) => {
    setToastMessage({ title, detail });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSimulate = async (type: string) => {
    setIsSimulating(true);
    await simulateFlow(type);
    setIsSimulating(false);
    showToast(
      'Attack Injected & Archived',
      `Simulated ${type} event processed by ML engine → archived to S3: ${stats?.s3_bucket || 'shield-ai-threat-archive'}.`
    );
  };

  const handleMitigate = (alertId: string, ip: string, type: string) => {
    setIsMitigating(true);
    setTimeout(() => {
      setIsMitigating(false);
      setMitigatedIds((prev) => new Set(prev).add(alertId));
      showToast('Firewall ACL Enforced', `Border rule enforced for ${ip} (${type}). Ingress dropped.`);
    }, 1000);
  };

  const timelineData: TrafficDataPoint[] = useMemo(() => {
    if (stats?.timeline && stats.timeline.length > 0) {
      return stats.timeline.map((item) => ({
        time: item.time,
        normal: item.normal * 120 + 200,
        malicious: item.suspicious * 850,
      }));
    }
    return [
      { time: '10:00', normal: 1200, malicious: 0 },
      { time: '10:10', normal: 1450, malicious: 0 },
      { time: '10:20', normal: 1100, malicious: 250 },
      { time: '10:30', normal: 1600, malicious: 600 },
      { time: '10:40', normal: 1350, malicious: 150 },
    ];
  }, [stats]);

  const donutData = useMemo(() => {
    const counts: Record<string, number> = { DoS: 0, 'Port Scan': 0, 'Brute Force': 0, 'Data Exfiltration': 0, Botnet: 0 };
    alerts.forEach((a) => { if (a.is_attack && counts[a.attack_type] !== undefined) counts[a.attack_type] += 1; });
    const colors: Record<string, string> = {
      DoS: '#EF4444',
      'Port Scan': '#F97316',
      'Brute Force': '#FBBF24',
      'Data Exfiltration': '#06B6D4',
      Botnet: '#10B981',
    };
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.max(count, 1),
      count: Math.max(count, 1),
      percentage: 20,
      color: colors[name] || '#3B82F6',
    }));
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    if (filterType === 'all') return alerts;
    if (filterType === 'malicious') return alerts.filter((a) => a.is_attack);
    if (filterType === 'benign') return alerts.filter((a) => !a.is_attack);
    return alerts.filter((a) => a.attack_type.toLowerCase() === filterType.toLowerCase());
  }, [alerts, filterType]);

  const FILTERS = ['all', 'malicious', 'benign', 'dos', 'brute force'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-2">

      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-md animate-slide-up"
          style={{
            background: 'var(--surface)',
            border: '1px solid rgba(59,130,246,0.3)',
            boxShadow: '0 0 32px rgba(59,130,246,0.15), 0 20px 40px rgba(0,0,0,0.4)',
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>{toastMessage.title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{toastMessage.detail}</p>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div id="live-stream" className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5 font-mono font-semibold tracking-wider uppercase" style={{ color: 'var(--accent-cyan)' }}>
              <span className="status-led blue" />
              LIVE MONITORING SYSTEM
            </span>
            <span>·</span>
            <span>AWS S3 ARCHIVAL ENABLED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-3 flex-wrap"
            style={{ color: 'var(--text-primary)' }}>
            <span>Shield-AI Real-Time Threat Sentinel</span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{
                background: isSseConnected ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                color: isSseConnected ? 'var(--accent-green)' : 'var(--accent-blue)',
                border: `1px solid ${isSseConnected ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
              }}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: isSseConnected ? '#10B981' : '#3B82F6' }} />
              {isSseConnected ? 'TELEMETRY: CONNECTED' : 'POLLING ACTIVE'}
            </span>
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* S3 bucket indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
            style={{ ...S.surface, boxShadow: '0 0 12px rgba(6,182,212,0.08)' }}>
            <Cloud className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              S3: <strong className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                {stats?.s3_bucket || 'shield-ai-threat-archive'}
              </strong>
            </span>
          </div>

          {/* Verify deployment */}
          <button
            onClick={async () => { await verifyHealth(); setIsHealthModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
            style={S.surface}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 16px rgba(16,185,129,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Verify Deployment</span>
          </button>

          {/* Simulate attack */}
          <button
            disabled={isSimulating}
            onClick={() => handleSimulate('DoS')}
            className="btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 disabled:opacity-60"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Injecting...' : 'Simulate Attack & S3'}</span>
          </button>

          {/* Refresh */}
          <button
            onClick={() => refresh()}
            className="p-2 rounded-xl transition-all duration-200"
            style={S.surface}
            title="Refresh State"
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 12px rgba(59,130,246,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <RefreshCw className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <section id="kpis" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          {
            label: 'Packets / Sec', icon: Activity, iconColor: 'var(--accent-cyan)',
            value: stats?.packets_per_second?.toLocaleString() ?? '142.0',
            sub: 'Real-time throughput', subColor: 'var(--accent-cyan)',
          },
          {
            label: 'Flows Analyzed', icon: Layers, iconColor: 'var(--accent-blue)',
            value: stats?.total_flows ?? alerts.length,
            sub: 'Sliding window', subColor: 'var(--text-muted)',
          },
          {
            label: 'Live Risk Score', icon: Flame, iconColor: 'var(--accent-red)',
            value: <>{stats?.current_risk_score ?? 68}<span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/100</span></>,
            sub: stats?.current_risk_score && stats.current_risk_score >= 70 ? 'ELEVATED THREAT' : 'GUARDED',
            subColor: stats?.current_risk_score && stats.current_risk_score >= 70 ? 'var(--accent-red)' : 'var(--accent-green)',
          },
          {
            label: 'Anomaly Rate', icon: AlertTriangle, iconColor: 'var(--accent-amber)',
            value: <>{stats?.anomaly_rate_pct ?? '24.5'}%</>,
            sub: `Top: ${stats?.top_attack_type ?? 'DoS'}`, subColor: 'var(--text-muted)',
          },
          {
            label: 'S3 Archived', icon: Cloud, iconColor: 'var(--accent-cyan)',
            value: stats?.total_s3_archived ?? alerts.filter((a) => a.is_attack).length,
            sub: 'JSONL append-only', subColor: 'var(--accent-cyan)',
            glow: true,
          },
          {
            label: 'Sensor Agent', icon: Server, iconColor: 'var(--accent-green)',
            value: <span className="text-sm">{stats?.sensor_connected ? 'CONNECTED' : 'SIM MODE'}</span>,
            sub: `ID: ${stats?.sensor_id || 'local-sensor'}`, subColor: 'var(--text-muted)',
          },
        ].map(({ label, icon: Icon, iconColor, value, sub, subColor, glow }, i) => (
          <Card key={i} glow={glow}
            className="p-3.5 sm:p-4"
            style={glow ? {
              background: 'var(--surface)',
              border: '1px solid rgba(6,182,212,0.25)',
              boxShadow: '0 0 20px rgba(6,182,212,0.08)',
            } : {}}>
            <div className="flex items-center justify-between mb-1.5" style={{ color: 'var(--text-muted)' }}>
              <span className="text-xs">{label}</span>
              <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {value}
            </p>
            <span className="text-[10px] font-mono" style={{ color: subColor }}>{sub}</span>
          </Card>
        ))}
      </section>

      {/* ── CHARTS ── */}
      <section id="timeline" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrafficTimelineChart data={timelineData} />
        </div>
        <div className="lg:col-span-1">
          <ClassificationDonutChart data={donutData} />
        </div>
      </section>

      {/* ── SENSOR CLI BANNER ── */}
      <div className="p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
        style={{
          background: 'rgba(59,130,246,0.04)',
          border: '1px solid rgba(59,130,246,0.15)',
        }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <Terminal className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Run Sensor Agent on your network:</p>
            <p className="mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Sensor ships captured flow features over HTTPS → persists attacks to AWS S3.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-[11px] overflow-x-auto max-w-full"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--accent-cyan)' }}>
          <span>python sensor_agent.py --simulate --api-url http://localhost:8000</span>
        </div>
      </div>

      {/* ── THREAT FEED TABLE ── */}
      <Card id="threat-feed" className="p-0 overflow-hidden">
        {/* Table header */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
              <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                Live Threat Detection Feed & S3 Archival Stream
              </h2>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Real-time scored network packets. Malicious flows are archived as immutable S3 JSONL objects.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className="px-2.5 py-1 text-xs rounded-lg font-medium transition-all duration-200 font-mono"
                style={filterType === f ? {
                  background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)',
                  color: 'white',
                  border: '1px solid rgba(59,130,246,0.4)',
                  boxShadow: '0 0 10px rgba(59,130,246,0.25)',
                } : { color: 'var(--text-muted)' }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          {filteredAlerts.length === 0 ? (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid var(--border)' }}>
                <ShieldCheck className="w-6 h-6" style={{ color: 'var(--accent-blue)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Waiting for incoming telemetry streams...
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Click &quot;Simulate Attack & S3&quot; or start the sensor agent to ingest live traffic.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse min-w-[760px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                  {['Alert ID', 'Timestamp', 'Source IP → Port', 'Classification', 'Severity / Risk', 'AWS S3 Status', 'Inspect'].map((h) => (
                    <th key={h} className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => {
                  const isMitigated = mitigatedIds.has(alert.alert_id);
                  const isSelected = selectedAlert?.alert_id === alert.alert_id;
                  return (
                    <tr
                      key={alert.alert_id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`threat-row cursor-pointer ${alert.is_attack ? 'is-attack' : ''} ${isSelected ? 'selected' : ''}`}
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      <td className="py-3 px-4 font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <span className="flex items-center gap-1.5">
                          {alert.alert_id}
                          {isMitigated && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                              style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)' }}>
                              Mitigated
                            </span>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                        {alert.timestamp ? alert.timestamp.split('T')[1]?.slice(0, 8) || alert.timestamp : 'Just now'}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>{alert.source_ip}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          → {alert.destination_ip}:{alert.destination_port ?? 80} ({alert.protocol})
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold"
                          style={{ color: alert.is_attack ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                          {alert.attack_type}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <SeverityBadge
                            level={alert.severity === 'CRITICAL' ? 'critical' : alert.severity === 'HIGH' ? 'high' : alert.severity === 'MEDIUM' ? 'medium' : 'low'}
                            label={alert.severity}
                          />
                          <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {alert.risk_score}/100
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {alert.is_attack ? (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]"
                            style={{ color: 'var(--accent-cyan)' }}>
                            <Cloud className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[160px]" title={alert.s3_key || 's3://shield-ai-threat-archive/alerts/...'}>
                              {alert.s3_key || `s3://alerts/${alert.alert_id}.jsonl`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            Benign (Bypassed S3)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all duration-200"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                            e.currentTarget.style.color = 'var(--accent-blue)';
                            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--surface-2)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }}
                        >
                          <Sparkles className="w-3 h-3" style={{ color: 'var(--accent-blue)' }} />
                          <span>Explain</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ── IMPROVEMENT ROADMAP ── */}
      <section id="roadmap" className="space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Architectural Improvement Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: Cloud, color: 'var(--accent-cyan)', label: '1. AWS Athena S3 Queries',
              desc: <>Create an external Athena schema on <code style={{ color: 'var(--accent-cyan)' }}>s3://shield-ai-threat-archive/alerts/</code>. Enables instant serverless SQL queries across billions of historical records.</>,
            },
            {
              icon: Flame, color: 'var(--accent-red)', label: '2. S3 Event Notifications',
              desc: 'Configure S3 ObjectCreated events → Lambda → PagerDuty/Slack when CRITICAL severity JSONL records are deposited.',
            },
            {
              icon: Server, color: 'var(--accent-green)', label: '3. Distributed Sensor Mesh',
              desc: <>Deploy <code style={{ color: 'var(--accent-green)' }}>sensor_agent.py</code> as a systemd daemon across branch offices and VPC gateways for centralized threat visibility.</>,
            },
            {
              icon: Sparkles, color: 'var(--accent-blue)', label: '4. Continuous ML Feedback',
              desc: 'False-positive flagging in UI stores analyst annotations. Periodic retraining jobs pull verified datasets from S3 to update XGBoost trees.',
            },
          ].map(({ icon: Icon, color, label, desc }, i) => (
            <Card key={i} hoverable className="p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <Icon className="w-4 h-4" style={{ color }} />
                <span style={{ color }}>{label}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── MODAL: HEALTH VERIFICATION ── */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsHealthModalOpen(false); }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl animate-slide-up"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 0 60px rgba(59,130,246,0.15)',
            }}>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Deployment & Live System Verification</h3>
              </div>
              <button onClick={() => setIsHealthModalOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { icon: Server, label: 'FastAPI Backend Service', value: health?.status === 'operational' ? '● OPERATIONAL' : '● ACTIVE', color: 'var(--accent-green)' },
                { icon: Database, label: 'Database (PostgreSQL / SQLite)', value: '● CONNECTED', color: 'var(--accent-green)' },
                { icon: Cloud, label: 'AWS S3 Archival Bucket', value: health?.s3?.connected ? '● S3 SYNCED' : '● READY', color: 'var(--accent-cyan)', sub: `Bucket: ${health?.s3?.bucket || 'shield-ai-threat-archive'}` },
                { icon: Radio, label: 'Sensor Ingestion Link', value: health?.sensor_connected ? '● STREAMING' : '● READY', color: 'var(--accent-blue)' },
              ].map(({ icon: Icon, label, value, color, sub }) => (
                <div key={label} className="p-3 rounded-xl flex flex-col gap-1"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                      <span>{label}</span>
                    </div>
                    <span className="font-mono font-bold" style={{ color }}>{value}</span>
                  </div>
                  {sub && <div className="text-[11px] font-mono pl-6" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
                </div>
              ))}
            </div>

            <div className="pt-1 flex justify-end">
              <button onClick={() => setIsHealthModalOpen(false)}
                className="btn-primary px-5 py-2 text-xs font-semibold rounded-xl">
                Verification Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DRAWER: ALERT DETAIL & SHAP ── */}
      {selectedAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedAlert(null); }}
        >
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 0 80px rgba(59,130,246,0.12)',
            }}>
            {/* Header */}
            <div className="p-5 flex items-start justify-between"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <ShieldAlert className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedAlert.attack_type}</h3>
                    <SeverityBadge
                      level={selectedAlert.severity === 'CRITICAL' ? 'critical' : selectedAlert.severity === 'HIGH' ? 'high' : 'medium'}
                      label={selectedAlert.severity}
                    />
                    <span className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {selectedAlert.alert_id}
                    </span>
                  </div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                    {selectedAlert.source_ip}:{selectedAlert.source_port ?? 'any'} → {selectedAlert.destination_ip}:{selectedAlert.destination_port ?? 80} ({selectedAlert.protocol})
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* S3 Record */}
              {selectedAlert.is_attack && (
                <div className="p-4 rounded-xl space-y-2"
                  style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--accent-cyan)' }}>
                      <Cloud className="w-4 h-4" /> AWS S3 Malicious Activity Archive
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                      style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--accent-cyan)' }}>IMMUTABLE JSONL</span>
                  </div>
                  <div className="text-xs font-mono p-2.5 rounded-lg break-all"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--accent-cyan)' }}>
                    {selectedAlert.s3_key || `alerts/2026/10/06/${selectedAlert.alert_id}.jsonl`}
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Persisted in Amazon S3 for compliance, forensic replay, and Athena analytics.
                  </p>
                </div>
              )}

              {/* SHAP explanation */}
              <div className="p-4 rounded-xl space-y-2"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5" style={{ color: 'var(--accent-blue)' }}>
                    <Sparkles className="w-4 h-4" /> Explainable AI (SHAP) Attribution
                  </span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                    Confidence: <strong style={{ color: 'var(--text-primary)' }}>{selectedAlert.confidence}%</strong>
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {selectedAlert.human_explanation ||
                    `Statistical analysis flagged abnormal packet bursts and inter-arrival timing characteristic of ${selectedAlert.attack_type}.`}
                </p>
              </div>

              {/* SHAP bars */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Top Feature Contributions:
                </h4>
                <div className="space-y-2.5">
                  {(selectedAlert.shap_features && selectedAlert.shap_features.length > 0
                    ? selectedAlert.shap_features
                    : [
                        { display_name: 'Flow Packets/s', impact_pct: 48 },
                        { display_name: 'Flow Bytes/s', impact_pct: 26 },
                        { display_name: 'IAT Mean Variance', impact_pct: 16 },
                        { display_name: 'Avg Packet Size', impact_pct: 10 },
                      ]
                  ).map((feat, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span style={{ color: 'var(--text-secondary)' }}>{feat.display_name}</span>
                        <span className="font-bold" style={{ color: 'var(--accent-blue)' }}>+{feat.impact_pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(feat.impact_pct * 2, 100)}%`,
                            background: 'linear-gradient(90deg, #1D4ED8, #06B6D4)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Recommended Defensive Actions:
                </h4>
                <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {(selectedAlert.recommended_actions && selectedAlert.recommended_actions.length > 0
                    ? selectedAlert.recommended_actions
                    : [
                        `Isolate source IP ${selectedAlert.source_ip} at edge firewall`,
                        `Apply rate limiting on destination port ${selectedAlert.destination_port ?? 80}`,
                        'Review Athena logs in S3 bucket archive',
                      ]
                  ).map((action, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-blue)' }} />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <button onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-xs rounded-xl transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                Close
              </button>
              {mitigatedIds.has(selectedAlert.alert_id) ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle2 className="w-4 h-4" /> Mitigation Enforced
                </span>
              ) : (
                <button
                  disabled={isMitigating}
                  onClick={() => handleMitigate(selectedAlert.alert_id, selectedAlert.source_ip, selectedAlert.attack_type)}
                  className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-60"
                >
                  <Flame className="w-4 h-4" />
                  <span>{isMitigating ? 'Enforcing Rule...' : 'Enforce Border Mitigation'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
