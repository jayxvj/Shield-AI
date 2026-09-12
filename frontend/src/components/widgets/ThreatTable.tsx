'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ThreatAlert } from '@/lib/mock-data';
import { 
  ShieldAlert, 
  Server, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';

interface ThreatTableProps {
  threats: ThreatAlert[];
  onSelectThreat: (threat: ThreatAlert) => void;
  selectedAlertId?: string;
}

export const ThreatTable: React.FC<ThreatTableProps> = ({
  threats,
  onSelectThreat,
  selectedAlertId,
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'dos' | 'botnet'>('all');

  const filteredThreats = threats.filter((item) => {
    if (filter === 'high') return item.severityLevel === 'high';
    if (filter === 'dos') return item.classification === 'DoS';
    if (filter === 'botnet') return item.classification === 'Botnet';
    return true;
  });

  return (
    <Card className="flex flex-col justify-between h-full p-0 overflow-hidden bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1A1F2B]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#A36361]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
              Active Threat Detections & ML Triage
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Click any row to open Explainable AI (SHAP) inspection & mitigation playbook
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#0B0F19] p-1 rounded-lg border border-gray-200 dark:border-white/[0.08] self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white border border-gray-300 dark:border-[#EECC8C]/40 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All ({threats.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              filter === 'high'
                ? 'bg-[#A36361]/20 text-[#A36361] border border-[#A36361]/40 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setFilter('dos')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              filter === 'dos'
                ? 'bg-white dark:bg-[#1A1F2B] text-yellow-800 dark:text-[#EECC8C] border border-gray-300 dark:border-[#EECC8C]/40 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            DoS
          </button>
          <button
            onClick={() => setFilter('botnet')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              filter === 'botnet'
                ? 'bg-white dark:bg-[#1A1F2B] text-[#A36361] dark:text-[#D3A29D] border border-gray-300 dark:border-[#D3A29D]/40 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Botnet
          </button>
        </div>
      </div>

      {/* Table Content or Empty State */}
      <div className="overflow-x-auto w-full">
        {filteredThreats.length === 0 ? (
          /* Empty State View */
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/50 dark:bg-[#141823]/30">
            <div className="w-12 h-12 rounded-full bg-[#9EABA2]/15 border border-[#9EABA2]/30 flex items-center justify-center text-[#5F6F65] dark:text-[#BDD1C5]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">No active threats detected in the selected timeframe.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                All network streams matching this filter have been verified nominal or already mitigated.
              </p>
            </div>
            <button
              onClick={() => setFilter('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-300 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
              <span>Reset Filter</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#141823]/60 text-gray-600 dark:text-gray-400 font-medium">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source IP / Protocol</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Severity Status</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
              {filteredThreats.map((threat) => {
                const isSelected = selectedAlertId === threat.alertId;

                return (
                  <tr
                    key={threat.alertId}
                    onClick={() => onSelectThreat(threat)}
                    className={`cursor-pointer transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-[#1e2532] ${
                      isSelected
                        ? 'bg-gray-100 dark:bg-[#1e2532] border-l-2 border-l-[#EECC8C]'
                        : ''
                    }`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Inspect threat ${threat.alertId}: ${threat.classification}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectThreat(threat);
                      }
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-900 dark:text-white">
                      <span className="group-hover:text-yellow-700 dark:group-hover:text-[#EECC8C] transition-colors duration-200 flex items-center gap-1.5">
                        {threat.alertId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">
                      {threat.timestamp.split(' ')[1] || threat.timestamp}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-gray-900 dark:text-gray-200 font-medium">{threat.sourceIp}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                        {threat.protocol || 'TCP'} {threat.bytesTransferred ? `• ${threat.bytesTransferred}` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5 truncate max-w-[150px]">
                        <Server className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{threat.targetAsset || threat.destIp || threat.destinationIp || 'Core-Asset'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gray-900 dark:text-white font-medium">{threat.classification}</span>
                    </td>

                    {/* Status / Severity column using SeverityBadge */}
                    <td className="py-3.5 px-4">
                      <SeverityBadge level={threat.severityLevel} label={threat.severityLevel.toUpperCase()} />
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900 dark:text-white">{threat.confidencePct}%</span>
                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#0B0F19] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-500 dark:bg-[#EECC8C] transition-all duration-300"
                            style={{ width: `${threat.confidencePct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 dark:bg-[#0B0F19] group-hover:bg-[#EECC8C] text-gray-700 dark:text-gray-300 group-hover:text-[#0B0F19] font-medium text-[11px] border border-gray-300 dark:border-white/10 group-hover:border-[#EECC8C] transition-all duration-200 shadow-sm"
                        aria-label="Inspect AI decision"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-600 dark:text-[#EECC8C] group-hover:text-[#0B0F19] transition-colors duration-200" />
                        <span>Explain</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 px-5 border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#141823]/40 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Showing {filteredThreats.length} verified security alerts</span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9EABA2] dark:bg-[#BDD1C5]" />
          Isolation Forest & SHAP Ingestion: Nominal
        </span>
      </div>
    </Card>
  );
};

export default ThreatTable;
