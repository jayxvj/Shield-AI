'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { useLiveMonitoring } from '@/hooks/useLiveMonitoring';
import type { LiveAlert } from '@/lib/liveMonitoringApi';
import {
  Radio,
  Play,
  Square,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  Shield,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Network,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { clsx } from 'clsx';

// ── Severity helpers ──────────────────────────────────────────────────────────

function severityColor(sev: string) {
  switch (sev) {
    case 'CRITICAL': return { text: 'text-[#A36361]', bg: 'bg-[#A36361]/20', border: 'border-[#A36361]/40', dot: 'bg-[#A36361]' };
    case 'HIGH':     return { text: 'text-[#E8B298]', bg: 'bg-[#E8B298]/20', border: 'border-[#E8B298]/40', dot: 'bg-[#E8B298]' };
    case 'MEDIUM':   return { text: 'text-yellow-800 dark:text-[#EECC8C]', bg: 'bg-[#EECC8C]/20', border: 'border-[#EECC8C]/40', dot: 'bg-[#EECC8C]' };
    default:         return { text: 'text-[#5F6F65] dark:text-[#BDD1C5]', bg: 'bg-[#9EABA2]/20', border: 'border-[#9EABA2]/40', dot: 'bg-[#9EABA2]' };
  }
}

function SeverityBadge({ sev }: { sev: string }) {
  const c = severityColor(sev);
  return (
    <span className={clsx('inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border font-mono', c.bg, c.text, c.border)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', c.dot)} />
      {sev}
    </span>
  );
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 80 ? '#A36361' : score >= 60 ? '#E8B298' : score >= 40 ? '#EECC8C' : '#9EABA2';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ── Alert row ─────────────────────────────────────────────────────────────────

function AlertRow({ alert }: { alert: LiveAlert }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const sev = severityColor(alert.severity);

  return (
    <React.Fragment>
      <tr
        onClick={() => setExpanded((p) => !p)}
        className={clsx(
          'cursor-pointer transition-colors',
          expanded ? 'bg-[#EECC8C]/5 dark:bg-[#EECC8C]/10' : 'hover:bg-gray-50 dark:hover:bg-[#1A1F2B]/60'
        )}
      >
        {/* ID + time */}
        <td className="py-3 px-4">
          <div className="flex flex-col">
            <span className="font-mono font-semibold text-gray-900 dark:text-white text-xs">{alert.alert_id}</span>
            <span className="text-[10px] text-gray-400 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
          </div>
        </td>
        {/* IPs */}
        <td className="py-3 px-4">
          <div className="flex flex-col font-mono text-[11px]">
            <span className="text-gray-900 dark:text-white">{alert.source_ip}:{alert.source_port}</span>
            <span className="text-gray-400 text-[10px]">➔ {alert.destination_ip}:{alert.destination_port}</span>
          </div>
        </td>
        {/* Attack type */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            {alert.is_attack ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#A36361] shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#9EABA2] shrink-0" />
            )}
            <span className={clsx('font-semibold text-xs', alert.is_attack ? 'text-gray-900 dark:text-white' : 'text-[#5F6F65] dark:text-[#BDD1C5]')}>
              {alert.attack_type}
            </span>
          </div>
        </td>
        {/* Severity */}
        <td className="py-3 px-4 whitespace-nowrap"><SeverityBadge sev={alert.severity} /></td>
        {/* Risk */}
        <td className="py-3 px-4 min-w-[120px]"><RiskBar score={alert.risk_score} /></td>
        {/* Confidence */}
        <td className="py-3 px-4 text-center whitespace-nowrap">
          <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">{alert.confidence.toFixed(1)}%</span>
        </td>
        {/* Expand */}
        <td className="py-3 px-4 text-right whitespace-nowrap">
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((p) => !p); }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#1A1F2B] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 transition"
          >
            <span className="font-medium text-[11px]">{expanded ? 'Hide' : 'Details'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </td>
      </tr>

      {/* Expanded detail panel */}
      {expanded && (
        <tr className="bg-gray-50/80 dark:bg-[#0B0F19]/80 border-b border-gray-200 dark:border-white/[0.08]">
          <td colSpan={7} className="p-4 sm:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: SHAP + anomaly + explanation */}
              <div className="lg:col-span-7 space-y-3.5">
                {/* Anomaly score */}
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#EECC8C]/15 text-[#EECC8C]"><Activity className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Isolation Forest Anomaly Score</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Normalised zero-day unsupervised deviation metric</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-bold text-yellow-700 dark:text-[#EECC8C]">{alert.anomaly_score.toFixed(3)}</span>
                    <span className="text-[10px] text-gray-400 ml-1">/ 1.000</span>
                  </div>
                </div>

                {/* SHAP waterfall */}
                {alert.shap_features.length > 0 && (
                  <div className="p-4 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                      <Layers className="w-3.5 h-3.5 text-yellow-600 dark:text-[#EECC8C]" />
                      <span>SHAP Feature Attribution</span>
                    </div>
                    {alert.shap_features.map((f, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={clsx('font-medium', idx === 0 ? 'text-yellow-800 dark:text-[#EECC8C] font-semibold' : 'text-gray-700 dark:text-gray-300')}>
                            {idx === 0 && <span className="text-[10px] px-1.5 py-0.5 bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] rounded font-mono mr-1.5">TOP</span>}
                            {f.display_name}
                          </span>
                          <span className={clsx('font-mono font-bold', idx === 0 ? 'text-yellow-800 dark:text-[#EECC8C]' : 'text-gray-600 dark:text-gray-400')}>
                            +{f.impact_pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-[#0B0F19] rounded-full overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full', idx === 0 ? 'bg-[#EECC8C]' : 'bg-[#E8B298]')}
                            style={{ width: `${Math.min(f.impact_pct * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Explanation */}
                <div className="p-4 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-[#EECC8C]" />
                    <span>AI Decision Explainability & Root Cause</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#0B0F19] p-3 rounded border border-gray-200 dark:border-white/5">
                    {alert.human_explanation}
                  </p>
                </div>
              </div>

              {/* Right: Recommended actions */}
              <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08]">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5]" />
                      Recommended Mitigations
                    </span>
                    <span className="text-[10px] font-mono bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] px-2 py-0.5 rounded font-semibold">
                      {alert.recommended_actions.length} Actions
                    </span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {alert.recommended_actions.map((action, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 p-2.5 rounded bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/5 hover:border-[#EECC8C]/40 transition">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="w-4 h-4 rounded-full bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                          <span className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{action}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(action)}
                          className="p-1 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white transition shrink-0"
                          title="Copy action"
                        >
                          {copied === action ? <Check className="w-3.5 h-3.5 text-[#9EABA2]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Human approval required before execution</span>
                  <span className="font-mono text-[#9EABA2]">Pending Review</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LiveMonitoringPage() {
  const {
    connectionState,
    status,
    stats,
    interfaces,
    recentAlerts,
    startCapture,
    stopCapture,
    refreshInterfaces,
    errorMessage,
  } = useLiveMonitoring();

  const [selectedIface, setSelectedIface] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  // When interfaces load, pre-select the first one
  useEffect(() => {
    if (interfaces.length > 0 && !selectedIface) {
      setSelectedIface(interfaces[0].name);
    }
  }, [interfaces, selectedIface]);

  const handleStart = async () => {
    if (!selectedIface) return;
    setIsStarting(true);
    await startCapture(selectedIface);
    setIsStarting(false);
  };

  const handleStop = async () => {
    setIsStopping(true);
    await stopCapture();
    setIsStopping(false);
  };

  const isCapturing = status?.is_capturing ?? false;

  // ── Connection state badge ────────────────────────────────────────────────
  const connBadge = () => {
    if (connectionState === 'connecting') return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-500 shadow-sm">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Connecting to backend…</span>
      </div>
    );
    if (connectionState === 'error') return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-[#A36361]/40 text-xs text-[#A36361] shadow-sm">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Backend unreachable</span>
      </div>
    );
    if (connectionState === 'disabled') return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-[#EECC8C]/40 text-xs text-yellow-700 dark:text-[#EECC8C] shadow-sm">
        <Info className="w-3.5 h-3.5" />
        <span>Feature disabled</span>
      </div>
    );
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-[#9EABA2]/40 text-xs text-[#5F6F65] dark:text-[#BDD1C5] shadow-sm">
        <Wifi className="w-3.5 h-3.5" />
        <span>Backend: Live</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8 min-w-0">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>SOC Central</span><span>/</span>
            <span className="text-yellow-700 dark:text-[#EECC8C] font-medium">Live Network Monitoring</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>Live Network Monitoring</span>
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] border border-[#EECC8C]/30">
              Scapy → Flow Aggregation → XGBoost + Isolation Forest → SHAP
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Real-time packet capture and flow-level ML classification. Only flow metadata is captured — no payload storage.
            All recommended actions require human approval.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {connBadge()}
          {isCapturing && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm">
              <Radio className="w-3.5 h-3.5 text-[#A36361] animate-pulse" />
              <span className="font-mono text-[#A36361] font-semibold">● CAPTURING</span>
            </div>
          )}
        </div>
      </div>

      {/* Cloud-mode notice — shown when backend is unreachable (normal on Vercel) */}
      {connectionState === 'error' && (
        <div className="flex items-start gap-4 p-5 rounded-xl bg-[#1A1F2B] border border-[#EECC8C]/30">
          <div className="p-2.5 rounded-lg bg-[#EECC8C]/10 border border-[#EECC8C]/20 shrink-0">
            <Info className="w-4 h-4 text-[#EECC8C]" />
          </div>
          <div className="space-y-2 min-w-0">
            <p className="text-sm font-semibold text-white">Live Capture Requires Local Backend</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Live packet capture uses <span className="text-[#EECC8C] font-mono">Scapy</span> to monitor your
              network interface in real time. Cloud servers cannot access physical network adapters, so this
              feature must run on your own machine.
            </p>
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                <Terminal className="w-3.5 h-3.5 text-[#BDD1C5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Step 1 — Start local backend</p>
                  <p className="font-mono text-[10px] text-gray-400 break-all">
                    Right-click start-backend.bat → Run as Administrator
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                <Wifi className="w-3.5 h-3.5 text-[#BDD1C5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Step 2 — Open local dashboard</p>
                  <p className="font-mono text-[10px] text-gray-400">
                    http://localhost:3000/live-monitoring
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              All other dashboard pages (Alerts, Analytics, Threat Intel…) continue working normally on this deployment.
            </p>
          </div>
        </div>
      )}

      {/* Non-cloud error banner — shown for other errors when backend is reachable */}
      {errorMessage && connectionState !== 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#A36361]/10 border border-[#A36361]/30 text-sm text-[#A36361]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Live Monitoring Error</p>
            <p className="text-xs mt-0.5 text-[#A36361]/80">{errorMessage}</p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              The existing application continues to work normally. Live monitoring is an optional feature.
            </p>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Interface selector */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              Network Interface
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedIface}
                onChange={(e) => setSelectedIface(e.target.value)}
                disabled={isCapturing}
                className="flex-1 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#EECC8C]/50 disabled:opacity-50"
              >
                {interfaces.length === 0 && (
                  <option value="">— load interfaces first —</option>
                )}
                {interfaces.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name} {i.description && i.description !== i.name ? `— ${i.description}` : ''} {i.is_up ? '● UP' : '○ DOWN'}
                  </option>
                ))}
              </select>
              <button
                onClick={refreshInterfaces}
                disabled={isCapturing}
                title="Refresh interface list"
                className="p-2 rounded-lg bg-gray-100 dark:bg-[#1A1F2B] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Start / Stop */}
          <div className="flex items-center gap-3">
            {!isCapturing ? (
              <button
                onClick={handleStart}
                disabled={isStarting || connectionState !== 'connected' || !selectedIface}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5F6F65] dark:bg-[#BDD1C5]/20 hover:bg-[#4a5a50] dark:hover:bg-[#BDD1C5]/30 border border-[#9EABA2]/50 text-white dark:text-[#BDD1C5] text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Start Capture
              </button>
            ) : (
              <button
                onClick={handleStop}
                disabled={isStopping}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A36361]/80 hover:bg-[#A36361] border border-[#A36361]/60 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {isStopping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                Stop Capture
              </button>
            )}
          </div>
        </div>

        {/* Session metadata strip */}
        {status && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span>Interface: <strong className="text-gray-900 dark:text-white">{status.selected_interface ?? '—'}</strong></span>
            <span>Packets: <strong className="text-gray-900 dark:text-white">{status.packets_captured.toLocaleString()}</strong></span>
            <span>Flows: <strong className="text-gray-900 dark:text-white">{status.flows_processed.toLocaleString()}</strong></span>
            <span>Pkt/s: <strong className="text-gray-900 dark:text-white">{status.packets_per_second.toFixed(1)}</strong></span>
            {status.session_started_at && (
              <span>Started: <strong className="text-gray-900 dark:text-white">{new Date(status.session_started_at).toLocaleTimeString()}</strong></span>
            )}
          </div>
        )}
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Packets/s', value: stats?.packets_per_second.toFixed(1) ?? '—',
            sub: 'Current ingestion rate', icon: Activity, color: 'text-[#BDD1C5]',
          },
          {
            label: 'Flows Processed', value: stats?.total_flows.toLocaleString() ?? '—',
            sub: 'Since session start', icon: Layers, color: 'text-[#EECC8C]',
          },
          {
            label: 'Anomaly Rate', value: stats ? `${stats.anomaly_rate_pct.toFixed(1)}%` : '—',
            sub: 'Suspicious vs total', icon: Zap, color: 'text-[#E8B298]',
          },
          {
            label: 'Risk Score', value: stats?.current_risk_score.toString() ?? '—',
            sub: 'Aggregate 0–100', icon: Shield, color: 'text-[#A36361]',
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{kpi.label}</span>
                <Icon className={clsx('w-4 h-4', kpi.color)} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{kpi.value}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Traffic timeline chart */}
      {stats && stats.timeline.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Live Traffic Timeline</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Normal vs Suspicious flows per second (last 60 s)</p>
            </div>
            {stats.top_attack_type && (
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#A36361]/20 text-[#A36361] border border-[#A36361]/30 font-semibold">
                Top: {stats.top_attack_type}
              </span>
            )}
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9EABA2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9EABA2" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="suspGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A36361" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#A36361" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888818" />
                <XAxis dataKey="time" tick={{ fill: '#888', fontSize: 10 }} stroke="#88888830" />
                <YAxis tick={{ fill: '#888', fontSize: 10 }} stroke="#88888830" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1F2B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#aaa' }}
                />
                <Area type="monotone" dataKey="normal" name="Normal" stroke="#9EABA2" fill="url(#normalGrad)" strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="suspicious" name="Suspicious" stroke="#A36361" fill="url(#suspGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#9EABA2]" />Normal</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#A36361]" />Suspicious</span>
          </div>
        </Card>
      )}

      {/* Alert timeline table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-white/[0.08]">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#A36361]" />
              Live Alert Timeline
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {recentAlerts.length > 0
                ? `${recentAlerts.length} flow${recentAlerts.length !== 1 ? 's' : ''} analysed — ${recentAlerts.filter(a => a.is_attack).length} attack${recentAlerts.filter(a => a.is_attack).length !== 1 ? 's' : ''} detected`
                : isCapturing ? 'Waiting for flows…' : 'Start capture to see live alerts.'}
            </p>
          </div>
          {stats && (
            <div className="text-right text-xs font-mono text-gray-500 dark:text-gray-400">
              <p>Normal: <strong className="text-[#BDD1C5]">{stats.normal_flows}</strong></p>
              <p>Suspicious: <strong className="text-[#A36361]">{stats.suspicious_flows}</strong></p>
            </div>
          )}
        </div>

        {/* Idle placeholder */}
        {!isCapturing && recentAlerts.length === 0 && (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            <Radio className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No capture session active</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Select a network interface above and click <strong>Start Capture</strong> to begin live analysis.
              Administrator privileges may be required.
            </p>
          </div>
        )}

        {/* Table */}
        {recentAlerts.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/[0.08] bg-gray-50/70 dark:bg-[#0B0F19]/60 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Alert ID & Time</th>
                  <th className="py-3 px-4">Source → Destination</th>
                  <th className="py-3 px-4">Attack Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05] text-xs">
                {recentAlerts.map((alert) => (
                  <AlertRow key={`${alert.alert_id}-${alert.timestamp}`} alert={alert} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Privacy / permission notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
        <div className="space-y-1">
          <p className="font-semibold text-gray-700 dark:text-gray-300">Privacy & Permission Notice</p>
          <p>Only flow metadata (IPs, ports, packet counts, byte counts, inter-arrival times) is captured. Packet payloads are never stored or transmitted.</p>
          <p>Packet capture requires administrator / root privileges on the monitoring host. Firewall and router settings are never modified automatically.</p>
          <p>All recommended mitigation actions require explicit human approval before execution.</p>
        </div>
      </div>
    </div>
  );
}
