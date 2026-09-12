'use client';

import React, { useState } from 'react';
import { ThreatAlert } from '@/lib/mock-data';
import { MOCK_AI_EXPLANATIONS, MOCK_MITIGATION_PLAYBOOKS } from '@/lib/mock-data';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ActionBtn } from '../ui/ActionBtn';
import { ThreatPlaybookCard } from './ThreatPlaybookCard';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Flame, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ExplanationModalProps {
  threat: ThreatAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onMitigateSuccess?: (alertId: string, details?: { sourceIp: string; classification: string; playbookTitle: string }) => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  threat,
  isOpen,
  onClose,
  onMitigateSuccess,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isMitigated, setIsMitigated] = useState(false);

  if (!isOpen || !threat) return null;

  // Retrieve AI explanation & playbook for the selected threat
  const explanation = MOCK_AI_EXPLANATIONS[threat.alertId] || {
    alertId: threat.alertId,
    summary: `Automated Isolation Forest decision for ${threat.classification} traffic pattern from ${threat.sourceIp}.`,
    modelConfidence: threat.confidencePct || 94.5,
    anomalyScore: threat.severityScore || 85,
    topFeatures: [
      { name: 'flow_rate', displayName: 'Packet Transfer Burst Rate', impact: 0.78, impactPct: 44, value: 'High Ingress' },
      { name: 'session_interarrival', displayName: 'Inter-arrival Uniformity', impact: 0.56, impactPct: 32, value: '0.004 ms' },
      { name: 'port_entropy', displayName: 'Destination Port Probing', impact: 0.32, impactPct: 18, value: 'Spread > 20' },
      { name: 'ip_reputation', displayName: 'Subnet Threat Intelligence Feed', impact: 0.12, impactPct: 6, value: 'Flagged CIDR' },
    ],
    recommendation: {
      playbookTitle: `Defensive Playbook: ${threat.classification} Mitigation`,
      actionDescription: `Deploy automated rate-limiting rule on ingress interfaces and isolate source IP ${threat.sourceIp}.`,
      commandToExecute: `iptables -A INPUT -s ${threat.sourceIp} -j DROP && edr-ctl --isolate --target ${threat.targetAsset || threat.destIp || '10.0.0.1'}`,
      estimatedImpact: 'Immediate 99.8% reduction in anomalous load.',
    },
  };

  const playbook = explanation.recommendation || MOCK_MITIGATION_PLAYBOOKS[threat.classification] || null;

  const handleApplyMitigation = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsMitigated(true);
      if (onMitigateSuccess) {
        onMitigateSuccess(threat.alertId, {
          sourceIp: threat.sourceIp,
          classification: threat.classification,
          playbookTitle: (playbook as any)?.playbookTitle || `${threat.classification} Defensive Rule`,
        });
      }
      setTimeout(() => {
        onClose();
        setIsMitigated(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal / Drawer Dialog */}
      <div 
        className="bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.12] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-gray-900 dark:text-white animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explanation-modal-title"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#141823] flex items-start justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#A36361]/20 border border-[#A36361]/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-[#A36361]" />
            </div>

            <div>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <h2 id="explanation-modal-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {threat.classification}
                </h2>
                <SeverityBadge level={threat.severityLevel} label={threat.severityLevel.toUpperCase()} />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-[#0B0F19] px-2 py-0.5 rounded border border-gray-300 dark:border-white/10">
                  {threat.alertId}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-mono flex-wrap">
                <span>Source: <strong className="text-gray-900 dark:text-gray-200">{threat.sourceIp}</strong></span>
                <span>•</span>
                <span>Target: <strong className="text-gray-900 dark:text-gray-200">{threat.targetAsset || threat.destIp || threat.destinationIp || 'Primary Asset'}</strong></span>
                <span>•</span>
                <span>Protocol: <strong className="text-yellow-700 dark:text-[#EECC8C]">{threat.protocol || 'TCP'}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* AI Explanation Synthesis Header */}
          <div className="bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-yellow-800 dark:text-[#EECC8C]">
                <Sparkles className="w-4 h-4" />
                <span>Explainable AI (XAI) Synthesis</span>
              </div>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                Model Confidence: <strong className="text-gray-900 dark:text-[#BDD1C5]">{explanation.modelConfidence || 95}%</strong>
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {explanation.summary}
            </p>
          </div>

          {/* Section 1: Horizontal Bar Chart representing AI Feature Importance (SHAP values) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-yellow-700 dark:text-[#EECC8C]" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                  AI Feature Importance (SHAP Waterfall)
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Attribution weight towards anomaly verdict
              </span>
            </div>

            <div className="space-y-3 bg-gray-50 dark:bg-[#141823]/90 border border-gray-200 dark:border-white/[0.06] rounded-xl p-3.5 sm:p-4">
              {explanation.topFeatures.map((feat, idx) => {
                const impactPercentage = feat.impactPct ?? Math.round(feat.impact * 100);
                const isTopFeature = idx === 0;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium flex items-center gap-2 ${
                        isTopFeature ? 'text-yellow-800 dark:text-[#EECC8C] font-semibold' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {isTopFeature && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] rounded font-mono font-normal">
                            TOP DRIVER
                          </span>
                        )}
                        <span>{feat.displayName || feat.name}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-gray-500 dark:text-gray-400 text-[11px]">{feat.value || `${impactPercentage}%`}</span>
                        <span className={`font-mono font-bold w-12 text-right ${
                          isTopFeature ? 'text-yellow-800 dark:text-[#EECC8C] text-sm' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          +{impactPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar */}
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-[#0B0F19] rounded-full overflow-hidden border border-gray-300 dark:border-white/[0.04]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isTopFeature
                            ? 'bg-[#EECC8C] shadow-glow'
                            : 'bg-gradient-to-r from-[#E8B298] to-[#D3A29D]'
                        }`}
                        style={{ width: `${Math.min(impactPercentage * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Recommended Threat Playbook Card */}
          <div>
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                Recommended Defensive Playbook
              </h3>
            </div>

            <ThreatPlaybookCard
              playbook={playbook as any}
              classification={threat.classification}
              sourceIp={threat.sourceIp}
              targetAsset={threat.targetAsset || threat.destIp}
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#141823] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
          >
            Dismiss
          </button>

          <div className="flex items-center gap-3">
            {isMitigated ? (
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#9EABA2]/20 border border-[#BDD1C5]/40 text-[#5F6F65] dark:text-[#BDD1C5] text-xs sm:text-sm font-semibold animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-[#5F6F65] dark:text-[#BDD1C5]" />
                <span>Firewall Rule Enforced Successfully</span>
              </div>
            ) : (
              <ActionBtn
                variant="primary"
                size="md"
                isLoading={isApplying}
                onClick={handleApplyMitigation}
                leftIcon={<Flame className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="transition-all duration-200"
              >
                Apply Mitigation
              </ActionBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
