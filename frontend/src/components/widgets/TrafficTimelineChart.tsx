'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity } from 'lucide-react';
import { TRAFFIC_TIMELINE_DATA } from '@/mock-data/threats';

export interface TrafficDataPoint {
  time: string;
  normal: number;
  malicious: number;
}

interface TrafficTimelineChartProps {
  data?: TrafficDataPoint[];
}

export const TrafficTimelineChart: React.FC<TrafficTimelineChartProps> = ({
  data = TRAFFIC_TIMELINE_DATA,
}) => {
  // 1. Initialize state variable for active filter (default '1h')
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  // 2. Derived filteredData slicing based on timeRange
  const filteredData = React.useMemo(() => {
    if (timeRange === '1h') {
      return data.slice(-6); // Last 6 data points
    }
    if (timeRange === '6h') {
      return data.slice(-12); // Last 12 data points
    }
    return data; // Full 24h array
  }, [data, timeRange]);

  // Custom tooltip strictly styled with theme tokens
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EECC8C]" />
            Time: <span className="text-gray-900 dark:text-white font-mono">{label}</span>
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#5F6F65] dark:text-[#BDD1C5]">
                <span className="w-2 h-2 rounded-full bg-[#BDD1C5]" />
                Normal Traffic:
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {payload[0]?.value?.toLocaleString()} pkts/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A36361]">
                <span className="w-2 h-2 rounded-full bg-[#A36361]" />
                Malicious Surges:
              </span>
              <span className="font-mono font-bold text-[#A36361]">
                {payload[1]?.value?.toLocaleString()} pkts/s
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col justify-between h-full bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-yellow-600 dark:text-[#EECC8C]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
              Network Traffic Timeline (Detect)
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time multi-series comparison: Normal Baseline vs. Malicious Ingress ({timeRange} window)
          </p>
        </div>

        {/* Time Filter Buttons with dynamic highlighting */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#0B0F19] p-1 rounded-lg border border-gray-200 dark:border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('1h')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              timeRange === '1h'
                ? 'bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white border border-gray-300 dark:border-[#EECC8C]/40 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            1h
          </button>
          <button
            onClick={() => setTimeRange('6h')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              timeRange === '6h'
                ? 'bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white border border-gray-300 dark:border-[#EECC8C]/40 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            6h
          </button>
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
              timeRange === '24h'
                ? 'bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white border border-gray-300 dark:border-[#EECC8C]/40 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            24h
          </button>
        </div>
      </div>

      {/* Area Chart Container with filteredData */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="timelineColorNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BDD1C5" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#BDD1C5" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="timelineColorMalicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A36361" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#A36361" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-white/[0.05]" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'currentColor', className: 'text-gray-200 dark:text-white/10' }}
            />

            <YAxis
              stroke="#9CA3AF"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="normal"
              name="Normal Traffic"
              stroke="#5F6F65"
              className="dark:stroke-[#BDD1C5]"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#timelineColorNormal)"
            />

            <Area
              type="monotone"
              dataKey="malicious"
              name="Malicious Traffic"
              stroke="#A36361"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#timelineColorMalicious)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between pt-3 mt-2 border-t border-gray-200 dark:border-white/[0.07] text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BDD1C5]" />
            <span className="text-gray-700 dark:text-gray-300">Normal (Baseline)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A36361]" />
            <span className="text-[#A36361] font-medium">Malicious Anomaly Surges</span>
          </div>
        </div>

        <span className="text-gray-500 dark:text-gray-400 text-[11px] font-mono">
          Viewing: <strong className="text-yellow-700 dark:text-[#EECC8C]">{filteredData.length} data points ({timeRange})</strong>
        </span>
      </div>
    </Card>
  );
};

export default TrafficTimelineChart;
