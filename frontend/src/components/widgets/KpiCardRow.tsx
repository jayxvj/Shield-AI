'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { KpiMetric } from '@/types/threat';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface KpiCardRowProps {
  metrics: KpiMetric[];
}

const iconMap: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-5 h-5 text-[#EECC8C]" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-[#E8B298]" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-[#A36361]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#BDD1C5]" />,
};

export const KpiCardRow: React.FC<KpiCardRowProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const isHighRisk = metric.iconName === 'ShieldAlert';
        const isSafe = metric.iconName === 'ShieldCheck';

        return (
          <Card 
            key={idx} 
            hoverable 
            className="flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top decorative accent bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px] opacity-60 transition-opacity group-hover:opacity-100"
              style={{
                backgroundColor: isHighRisk 
                  ? '#A36361' 
                  : isSafe 
                    ? '#BDD1C5' 
                    : '#EECC8C'
              }} 
            />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">
                {metric.title}
              </span>
              <div className="p-2 rounded-lg bg-[#0B0F19] border border-white/[0.08]">
                {iconMap[metric.iconName] || <Activity className="w-5 h-5 text-[#EECC8C]" />}
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
                  {metric.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                    metric.isIncreasePositive
                      ? 'bg-[#9EABA2]/20 text-[#BDD1C5]'
                      : 'bg-[#A36361]/20 text-[#A36361]'
                  }`}
                >
                  {metric.isIncreasePositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metric.changePct}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                {metric.subtitle}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
