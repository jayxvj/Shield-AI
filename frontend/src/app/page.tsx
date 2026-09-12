'use client';

import React, { useState } from 'react';
import { KPIRow } from '@/components/widgets/KPIRow';
import { TrafficTimelineChart } from '@/components/widgets/TrafficTimelineChart';
import { ClassificationDonutChart } from '@/components/widgets/ClassificationDonutChart';
import { ThreatTable } from '@/components/widgets/ThreatTable';
import { TargetedDevicesList } from '@/components/widgets/TargetedDevicesList';
import { ExplanationModal } from '@/components/widgets/ExplanationModal';
import { ThreatAlert } from '@/lib/mock-data';
import {
  TRAFFIC_TIMELINE_DATA,
  ATTACK_CLASSIFICATION_DATA,
  TARGETED_DEVICES
} from '@/mock-data/threats';
import { RefreshCw, Radio, ShieldCheck } from 'lucide-react';
import { useThreats } from '@/hooks/useThreats';
import { BackendStatusBadge } from '@/components/ui/BackendStatusBadge';

export default function SecurityDashboard() {
  const { threats, source, refresh, updateThreatStatus } = useThreats();
  const [selectedThreat, setSelectedThreat] = useState<ThreatAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; detail: string } | null>(null);

  // Row click handler to trigger XAI Explanation & Mitigation modal
  const handleSelectThreat = (threat: ThreatAlert) => {
    setSelectedThreat(threat);
    setIsModalOpen(true);
  };

  const handleMitigateSuccess = (
    alertId: string,
    details?: { sourceIp: string; classification: string; playbookTitle: string }
  ) => {
    // Update threat status to Mitigated in active state
    updateThreatStatus(alertId, 'Mitigated');

    const sourceIp = details?.sourceIp || 'Target IP';
    const classification = details?.classification || 'Threat';

    // Trigger success toast notification confirming firewall rule application
    setToastMessage({
      title: 'Firewall Rule Applied Successfully',
      detail: `Border ACL rule enforced for ${sourceIp} (${classification}). Traffic dropped on ingress ports.`,
    });

    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 bg-[#1A1F2B] border border-[#BDD1C5]/50 text-white px-4 sm:px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="w-9 h-9 rounded-lg bg-[#9EABA2]/20 border border-[#BDD1C5]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#BDD1C5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#BDD1C5]">{toastMessage.title}</p>
            <p className="text-xs text-gray-300 mt-0.5">{toastMessage.detail}</p>
          </div>
        </div>
      )}

      {/* Top Banner / Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>SOC Central</span>
            <span>/</span>
            <span className="text-yellow-700 dark:text-[#EECC8C] font-medium">Live Threat Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>AI Cyber Threat Detection & Response</span>
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] border border-[#EECC8C]/30">
              AI Pipeline: XGBoost + Isolation Forest + SHAP
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 self-start md:self-auto flex-wrap">
          <BackendStatusBadge source={source} onRefresh={refresh} />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5] animate-pulse" />
            <span>Telemetry Stream: Active</span>
          </div>

          <button
            onClick={() => {
              refresh();
              setToastMessage({
                title: 'Baseline Recalculated',
                detail: 'Real-time telemetry baseline re-synchronized across 4.82M packet flows.',
              });
              setTimeout(() => setToastMessage(null), 3500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
            <span>Resync Baseline</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Row (Clean 6-Card Grid) */}
      <section aria-label="Key Performance Indicators and Risk Level">
        <KPIRow />
      </section>

      {/* Row 2 (Middle): Traffic Timeline Chart (2/3 width on desktop) + Attack Classification Donut (1/3 width on desktop) */}
      <section aria-label="Traffic Timeline and Classification">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="grid-cols-1 lg:col-span-2">
            <TrafficTimelineChart data={TRAFFIC_TIMELINE_DATA} />
          </div>
          <div className="grid-cols-1 lg:col-span-1">
            <ClassificationDonutChart data={ATTACK_CLASSIFICATION_DATA} />
          </div>
        </div>
      </section>

      {/* Row 3 (Bottom): Threat Table (2/3 width on desktop) + Targeted Devices List (1/3 width on desktop) */}
      <section aria-label="Threat Details and Endpoint Inventory">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="grid-cols-1 lg:col-span-2 overflow-hidden">
            <ThreatTable
              threats={threats}
              onSelectThreat={handleSelectThreat}
              selectedAlertId={selectedThreat?.alertId}
            />
          </div>
          <div className="grid-cols-1 lg:col-span-1">
            <TargetedDevicesList devices={TARGETED_DEVICES} />
          </div>
        </div>
      </section>

      {/* Explanation & Mitigation Modal (Triggered on Threat Table Row Click) */}
      <ExplanationModal
        threat={selectedThreat}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMitigateSuccess={handleMitigateSuccess}
      />
    </div>
  );
}
