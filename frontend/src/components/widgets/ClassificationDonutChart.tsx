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

const DEFAULT_CLASSIFICATION_DATA: AttackClassificationItem[] = [
  { name: 'DoS / Volumetric', value: 38, color: '#A36361' },
  { name: 'Botnet C2', value: 24, color: '#D3A29D' },
  { name: 'Reconnaissance / Scan', value: 18, color: '#E8B298' },
  { name: 'Exploitation / SQLi', value: 12, color: '#EECC8C' },
  { name: 'Normal / Verified', value: 8, color: '#9EABA2' },
];

interface ClassificationDonutChartProps {
  data?: AttackClassificationItem[];
}

export const ClassificationDonutChart: React.FC<ClassificationDonutChartProps> = ({
  data = DEFAULT_CLASSIFICATION_DATA,
}) => {
  const totalCount = data.reduce((acc, curr) => acc + curr.value, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as AttackClassificationItem;
      const pct = ((item.value / totalCount) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 rounded-lg p-2.5 shadow-xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-mono">
            {item.value} detections ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col justify-between h-full bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-yellow-600 dark:text-[#EECC8C]" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
            Attack Classification (Classify)
          </h2>
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
          {data.length} Vectors
        </span>
      </div>

      {/* Donut Chart with Center Text */}
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
          <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono leading-none">
            {totalCount}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5">
            Total Signatures
          </span>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-1.5 pt-2 border-t border-gray-200 dark:border-white/[0.07]">
        {data.map((item) => {
          const pct = ((item.value / totalCount) * 100).toFixed(0);
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-0.5 hover:bg-gray-50 dark:hover:bg-[#1e2532] px-1.5 rounded transition"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[130px]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-gray-500 dark:text-gray-400 text-[11px]">{item.value}</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white w-8 text-right font-mono">
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
