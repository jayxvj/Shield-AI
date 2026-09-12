'use client';

import React, { useState } from 'react';
import { Terminal, Check, Copy } from 'lucide-react';
import { MitigationPlaybook } from '@/lib/mock-data';

interface ThreatPlaybookCardProps {
  playbook?: MitigationPlaybook | {
    playbookTitle: string;
    actionDescription: string;
    commandToExecute: string;
    estimatedImpact: string;
  } | null;
  classification?: string;
  sourceIp?: string;
  targetAsset?: string;
}

export const ThreatPlaybookCard: React.FC<ThreatPlaybookCardProps> = ({
  playbook,
  classification = 'Threat',
  sourceIp = '0.0.0.0',
  targetAsset = 'Target Asset',
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  const title = (playbook as any)?.playbookTitle || `Defensive Playbook for ${classification}`;
  const description = (playbook as any)?.actionDescription || (playbook as any)?.recommendedAction || 'Execute perimeter ACL rate limit and host isolation.';
  const command = (playbook as any)?.commandToExecute?.replace('$SOURCE_IP', sourceIp).replace('$DEST_IP', targetAsset) || `iptables -A INPUT -s ${sourceIp} -j DROP`;
  const impact = (playbook as any)?.estimatedImpact || 'Immediate mitigation with zero disruption to legitimate baseline traffic.';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 dark:bg-[#141823] border border-gray-200 dark:border-[#BDD1C5]/20 rounded-xl p-4 sm:p-4.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#5F6F65] dark:text-[#BDD1C5]" />
          <span className="text-xs font-bold text-gray-900 dark:text-[#BDD1C5] font-mono">
            {title}
          </span>
        </div>
        <span className="text-[10px] bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] px-2 py-0.5 rounded font-semibold uppercase">
          Ready for Execution
        </span>
      </div>

      <p className="text-xs text-gray-700 dark:text-gray-300 leading-normal">
        {description}
      </p>

      {/* Command Snippet */}
      <div className="bg-gray-100 dark:bg-[#0B0F19] border border-gray-300 dark:border-white/10 rounded-lg p-3 flex items-center justify-between gap-3 font-mono text-xs shadow-inner">
        <code className="text-gray-900 dark:text-[#EECC8C] overflow-x-auto whitespace-nowrap scrollbar-none font-bold">
          $ {command}
        </code>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shrink-0"
          title="Copy command"
          aria-label="Copy command snippet"
        >
          {hasCopied ? (
            <Check className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5F6F65] dark:bg-[#BDD1C5]" />
        <span><strong>Projected Impact:</strong> {impact}</span>
      </div>
    </div>
  );
};

export default ThreatPlaybookCard;
