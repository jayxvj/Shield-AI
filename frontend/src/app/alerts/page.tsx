'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  MOCK_SECURITY_ALERTS, 
  SecurityAlertRecord 
} from '@/lib/mock-data';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Terminal, 
  Copy, 
  Check, 
  ArrowUpDown,
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlertRecord[]>(MOCK_SECURITY_ALERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [attackFilter, setAttackFilter] = useState<string>('ALL');
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set([MOCK_SECURITY_ALERTS[0]?.id || '']));
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedRowIds(new Set(alerts.map((a) => a.id)));
  };

  const collapseAll = () => {
    setExpandedRowIds(new Set());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(text);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((item) => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.src_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dst_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.attack_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.human_explanation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = 
        severityFilter === 'ALL' || item.severity === severityFilter;

      const matchesAttack = 
        attackFilter === 'ALL' || 
        (attackFilter === 'ATTACK' && item.is_attack) ||
        (attackFilter === 'BENIGN' && !item.is_attack);

      return matchesSearch && matchesSeverity && matchesAttack;
    });
  }, [alerts, searchTerm, severityFilter, attackFilter]);

  const severityBadge = (sev: SecurityAlertRecord['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#A36361]/20 text-[#A36361] border border-[#A36361]/40 shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A36361] animate-pulse" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8B298]/20 text-[#E8B298] border border-[#E8B298]/40 shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B298]" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] border border-[#EECC8C]/40 shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EECC8C]" />
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border border-[#9EABA2]/40 shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9EABA2]" />
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>SOC Central</span>
            <span>/</span>
            <span className="text-yellow-700 dark:text-[#EECC8C] font-medium">Alerts Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>Live Security Threat Alerts</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#A36361]/20 text-[#A36361] border border-[#A36361]/30">
              {filteredAlerts.filter(a => a.is_attack).length} Active Intrusions
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Real-time supervised XGBoost classification combined with Isolation Forest zero-day anomaly scores and deterministic severity scoring.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 transition shadow-sm"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 transition shadow-sm"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by IP, attack classification, ID, or root cause explanation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#EECC8C]/50 focus:border-[#EECC8C] transition min-w-0"
            />
          </div>

          {/* Severity & Attack Type Filters */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-400 font-medium">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-gray-900 dark:text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Attack / Benign Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300">
              <span className="text-[11px] text-gray-400 font-medium">Type:</span>
              <select
                value={attackFilter}
                onChange={(e) => setAttackFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-gray-900 dark:text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="ALL">All Telemetry</option>
                <option value="ATTACK">Attacks Only</option>
                <option value="BENIGN">Benign Verified</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Alerts Table Card */}
      <Card className="p-0 overflow-hidden border border-gray-200 dark:border-white/[0.08] shadow-sm">
        <div className="w-full overflow-x-auto min-w-0">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/[0.08] bg-gray-50/70 dark:bg-[#0B0F19]/60 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Alert ID & Time</th>
                <th className="py-3.5 px-4">Source & Target IP</th>
                <th className="py-3.5 px-4">Attack Classification</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05] text-xs">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-gray-400 opacity-50" />
                    <p className="text-sm font-semibold">No telemetry alerts match your current filter.</p>
                    <p className="text-xs text-gray-400 mt-1">Try resetting the search query or severity dropdown.</p>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isExpanded = expandedRowIds.has(alert.id);

                  return (
                    <React.Fragment key={alert.id}>
                      {/* Main Table Row */}
                      <tr 
                        onClick={() => toggleRow(alert.id)}
                        className={`group transition-colors duration-150 cursor-pointer ${
                          isExpanded 
                            ? 'bg-[#EECC8C]/5 dark:bg-[#EECC8C]/10' 
                            : 'hover:bg-gray-50 dark:hover:bg-[#1A1F2B]/60'
                        }`}
                      >
                        {/* ID & Timestamp */}
                        <td className="py-3.5 px-4 min-w-0">
                          <div className="flex flex-col">
                            <span className="font-mono font-semibold text-gray-900 dark:text-white group-hover:text-[#EECC8C] transition-colors">
                              {alert.id}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                              {alert.timestamp.split(' ')[1] || alert.timestamp}
                            </span>
                          </div>
                        </td>

                        {/* Source & Destination IP */}
                        <td className="py-3.5 px-4 min-w-0">
                          <div className="flex flex-col font-mono text-[11px]">
                            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[140px]" title={alert.src_ip}>
                              {alert.src_ip}
                            </span>
                            <span className="text-gray-400 text-[10px] truncate max-w-[140px]" title={`Target: ${alert.dst_ip}`}>
                              ➔ {alert.dst_ip}
                            </span>
                          </div>
                        </td>

                        {/* Attack Classification */}
                        <td className="py-3.5 px-4 min-w-0">
                          <div className="flex items-center gap-2">
                            {alert.is_attack ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-[#A36361] shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#9EABA2] shrink-0" />
                            )}
                            <span className={`font-semibold truncate max-w-[200px] ${
                              alert.is_attack 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-[#5F6F65] dark:text-[#BDD1C5]'
                            }`} title={alert.attack_type}>
                              {alert.attack_type}
                            </span>
                          </div>
                        </td>

                        {/* Severity Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {severityBadge(alert.severity)}
                        </td>

                        {/* Risk Score */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 font-mono font-bold">
                            <span className={`text-sm ${
                              alert.risk_score >= 80 
                                ? 'text-[#A36361]' 
                                : alert.risk_score >= 60 
                                ? 'text-[#E8B298]' 
                                : alert.risk_score >= 40 
                                ? 'text-yellow-700 dark:text-[#EECC8C]' 
                                : 'text-[#5F6F65] dark:text-[#BDD1C5]'
                            }`}>
                              {alert.risk_score}
                            </span>
                            <span className="text-[10px] text-gray-400">/100</span>
                          </div>
                        </td>

                        {/* Confidence Percentage */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {alert.confidence.toFixed(1)}%
                            </span>
                            <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="h-full bg-[#EECC8C]"
                                style={{ width: `${alert.confidence}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Expand Button */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(alert.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#1A1F2B] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 transition"
                            aria-label={isExpanded ? 'Collapse row details' : 'Expand row details'}
                          >
                            <span className="font-medium text-[11px]">{isExpanded ? 'Hide' : 'Expand'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Inline Details Panel */}
                      {isExpanded && (
                        <tr className="bg-gray-50/80 dark:bg-[#0B0F19]/80 border-b border-gray-200 dark:border-white/[0.08]">
                          <td colSpan={7} className="p-4 sm:p-6 min-w-0">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
                              {/* Left Column: AI Anomaly Score & Explainability Callout (7 cols) */}
                              <div className="lg:col-span-7 space-y-3.5 min-w-0">
                                {/* Anomaly Score Card */}
                                <div className="flex items-center justify-between p-3.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08]">
                                  <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-[#EECC8C]/15 text-[#EECC8C]">
                                      <Activity className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                        Isolation Forest Anomaly Score
                                      </p>
                                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                        Normalized zero-day unsupervised deviation metric
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right font-mono">
                                    <span className="text-base font-bold text-yellow-700 dark:text-[#EECC8C]">
                                      {alert.anomaly_score.toFixed(3)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 ml-1">/ 1.000</span>
                                  </div>
                                </div>

                                {/* Human-Readable AI Explanation */}
                                <div className="p-4 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] space-y-2">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-[#EECC8C]" />
                                    <span>AI Decision Explainability & Root Cause Analysis</span>
                                  </div>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans bg-gray-50 dark:bg-[#0B0F19] p-3 rounded border border-gray-200 dark:border-white/5">
                                    {alert.human_explanation}
                                  </p>
                                </div>
                              </div>

                              {/* Right Column: Recommended Actions & Playbooks (5 cols) */}
                              <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] min-w-0">
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
                                      <div 
                                        key={idx} 
                                        className="flex items-start justify-between gap-2 p-2.5 rounded bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/5 group hover:border-[#EECC8C]/40 transition"
                                      >
                                        <div className="flex items-start gap-2 min-w-0">
                                          <span className="w-4 h-4 rounded-full bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                            {idx + 1}
                                          </span>
                                          <span className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                                            {action}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => handleCopy(action)}
                                          className="p-1 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white transition shrink-0"
                                          title="Copy action to clipboard"
                                          aria-label="Copy action"
                                        >
                                          {copiedAction === action ? (
                                            <Check className="w-3.5 h-3.5 text-[#9EABA2]" />
                                          ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                  <span>Automated SOC Policy Engine</span>
                                  <span className="font-mono text-[#9EABA2]">Ready to Apply</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
