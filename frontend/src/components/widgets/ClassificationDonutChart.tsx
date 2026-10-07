'use client';

import React from 'react';
import { Card } from '../ui/Card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

export interface AttackClassificationItem {
  name: string;
  value: number;
  color: string;
}

// Navy blue palette for attack types
const DEFAULT_CLASSIFICATION_DATA: AttackClassificationItem[] = [
  { name: 'DoS / Volumetric', value: 38, color: '#EF4444' },
  { name: 'Botnet C2', value: 24, color: '#F97316' },
  { name: 'Reconnaissance', value: 18, color: '#FBBF24' },
  { name: 'Exploitation / SQLi', value: 12, color: '#06B6D4' },
  { name: 'Normal / Verified', value: 8, color: '#10B981' },
];

interface ClassificationDonutChartProps {
  data?: AttackClassificationItem[];
}

export const ClassificationDonutChart: React.FC<ClassificationDonutChartProps> = ({
  data = DEFAULT_CLASSIFICATION_DATA,
}) => {
  const totalCount = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as AttackClassificationItem;
      const pct = ((item.value / totalCount) * 100).toFixed(1);
      return (
        <div className="rounded-xl p-2.5 shadow-2xl text-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold">{item.name}</span>
          </div>
          <p className="font-mono" style={{ color: 'var(--text-muted)' }}>
            {item.value} detections ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Attack Classification
          </h2>
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {data.length} Vectors
        </span>
      </div>

      {/* Donut Chart */}
      <div className="relative w-full h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono leading-none" style={{ color: 'var(--text-primary)' }}>
            {totalCount}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Total Sigs
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        {data.map((item) => {
          const pct = ((item.value / totalCount) * 100).toFixed(0);
          return (
            <div key={item.name}
              className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg transition-colors cursor-default"
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="truncate max-w-[130px]" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                <span className="text-xs font-semibold w-8 text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ClassificationDonutChart;
