'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ThreatAlert } from '@/types/threat';
import { 
  ShieldAlert, 
  ExternalLink, 
  Filter, 
  Clock, 
  Server, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ThreatDetailsTableProps {
  threats: ThreatAlert[];
  onSelectThreat: (threat: ThreatAlert) => void;
  selectedAlertId?: string;
}

export const ThreatDetailsTable: React.FC<ThreatDetailsTableProps> = ({
  threats,
  onSelectThreat,
  selectedAlertId,
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'active'>('all');

  const filteredThreats = threats.filter((item) => {
    if (filter === 'high') return item.severityLevel === 'high';
    if (filter === 'active') return item.status === 'Active';
    return true;
  });

  return (
    <Card className="flex flex-col justify-between h-full p-0 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1A1F2B]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#A36361]" />
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Active Threat Details & ML Triage (Score & Classify)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Click any row to open the Explainable AI (SHAP) inspection & mitigation playbook
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0B0F19] p-1 rounded-lg border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
              filter === 'all'
                ? 'bg-[#1A1F2B] text-white border border-[#EECC8C]/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Events ({threats.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
              filter === 'high'
                ? 'bg-[#A36361]/20 text-[#A36361] border border-[#A36361]/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            High Risk Only
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
              filter === 'active'
                ? 'bg-[#1A1F2B] text-white border border-[#EECC8C]/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07] bg-[#141823]/60 text-gray-400 font-medium">
              <th className="py-3 px-4">Alert ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Source IP / Protocol</th>
              <th className="py-3 px-4">Target Asset</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">AI Conf.</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredThreats.map((threat) => {
              const isSelected = selectedAlertId === threat.alertId;

              return (
                <tr
                  key={threat.alertId}
                  onClick={() => onSelectThreat(threat)}
                  className={`cursor-pointer transition-colors duration-150 group ${
                    isSelected
                      ? 'bg-[#222938] border-l-2 border-l-[#EECC8C]'
                      : 'hover:bg-[#222938]/70'
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
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    <span className="group-hover:text-[#EECC8C] transition-colors flex items-center gap-1.5">
                      {threat.alertId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-400 font-mono whitespace-nowrap">
                    {threat.timestamp.split(' ')[1]}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-gray-200 font-medium">{threat.sourceIp}</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {threat.protocol} • {threat.bytesTransferred}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-gray-200 flex items-center gap-1.5 truncate max-w-[150px]">
                      <Server className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{threat.targetAsset}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-white font-medium">{threat.classification}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <SeverityBadge level={threat.severityLevel} />
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{threat.confidencePct}%</span>
                      <div className="w-12 h-1.5 bg-[#0B0F19] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#EECC8C]"
                          style={{ width: `${threat.confidencePct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B0F19] group-hover:bg-[#EECC8C] text-gray-300 group-hover:text-[#0B0F19] font-medium text-[11px] border border-white/10 group-hover:border-[#EECC8C] transition-all"
                      aria-label="Inspect AI decision"
                    >
                      <Sparkles className="w-3 h-3 text-[#EECC8C] group-hover:text-[#0B0F19]" />
                      <span>Explain</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 px-5 border-t border-white/[0.07] bg-[#141823]/40 flex items-center justify-between text-xs text-gray-400">
        <span>Showing {filteredThreats.length} detected security events</span>
        <span className="flex items-center gap-1 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BDD1C5]" />
          Isolation Forest Confidence Interval: 95%
        </span>
      </div>
    </Card>
  );
};
