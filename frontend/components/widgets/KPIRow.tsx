'use client';

import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Clock, 
  Shield 
} from 'lucide-react';

interface KPIRowProps {
  score?: number;
  totalEvents?: string;
  threats?: string;
  critical?: string;
  high?: string;
  aiLatency?: string;
  threatLevel?: string;
}

export const KPIRow: React.FC<KPIRowProps> = ({
  totalEvents = '18,390',
  threats = '330',
  critical = '20',
  high = '73',
  aiLatency = '23.2ms',
  threatLevel = 'CRITICAL',
}) => {
  const cards = [
    {
      id: 'total-events',
      value: totalEvents,
      label: 'Total Events',
      icon: Activity,
      iconColor: 'text-[#EECC8C]',
      iconBg: 'bg-[#EECC8C]/15',
      borderColor: 'hover:border-[#EECC8C]/40',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      id: 'threats',
      value: threats,
      label: 'Threats',
      icon: AlertTriangle,
      iconColor: 'text-[#E8B298]',
      iconBg: 'bg-[#E8B298]/15',
      borderColor: 'hover:border-[#E8B298]/40',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      id: 'critical',
      value: critical,
      label: 'Critical',
      icon: Zap,
      iconColor: 'text-[#A36361]',
      iconBg: 'bg-[#A36361]/15',
      borderColor: 'hover:border-[#A36361]/40',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      id: 'high',
      value: high,
      label: 'High',
      icon: TrendingUp,
      iconColor: 'text-yellow-700 dark:text-[#EECC8C]',
      iconBg: 'bg-[#EECC8C]/15',
      borderColor: 'hover:border-[#EECC8C]/40',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      id: 'ai-latency',
      value: aiLatency,
      label: 'AI Latency',
      icon: Clock,
      iconColor: 'text-[#5F6F65] dark:text-[#BDD1C5]',
      iconBg: 'bg-[#9EABA2]/15',
      borderColor: 'hover:border-[#9EABA2]/40',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      id: 'threat-level',
      value: threatLevel,
      label: 'Threat Level',
      icon: Shield,
      iconColor: 'text-[#A36361]',
      iconBg: 'bg-[#A36361]/15',
      borderColor: 'hover:border-[#A36361]/40',
      valueColor: 'text-[#A36361]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 shadow-sm flex items-center gap-3.5 transition-all duration-200 ${card.borderColor} min-w-0`}
          >
            {/* Colored Icon on the Left */}
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5`}
            >
              <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
            </div>

            {/* Large Value stacked above small Label on the Right */}
            <div className="flex flex-col min-w-0">
              <span
                className={`text-xl sm:text-2xl font-bold font-mono tracking-tight leading-tight truncate ${card.valueColor}`}
                title={card.value}
              >
                {card.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPIRow;
