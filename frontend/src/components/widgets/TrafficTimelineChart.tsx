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
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  const filteredData = React.useMemo(() => {
    if (timeRange === '1h') return data.slice(-6);
    if (timeRange === '6h') return data.slice(-12);
    return data;
  }, [data, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl p-3 shadow-2xl text-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
          <p className="font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
            Time: <span className="font-mono">{label}</span>
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--accent-cyan)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
                Normal Traffic:
              </span>
              <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                {payload[0]?.value?.toLocaleString()} pkts/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--accent-red)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }} />
                Malicious Surges:
              </span>
              <span className="font-mono font-bold" style={{ color: 'var(--accent-red)' }}>
                {payload[1]?.value?.toLocaleString()} pkts/s
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const btnStyle = (active: boolean) => ({
    background: active ? 'linear-gradient(135deg, #1D4ED8, #0EA5E9)' : 'transparent',
    color: active ? 'white' : 'var(--text-muted)',
    border: active ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
    boxShadow: active ? '0 0 12px rgba(59,130,246,0.3)' : 'none',
  });

  return (
    <Card className="flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
            <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Network Traffic Timeline
            </h2>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time baseline vs. malicious ingress — {timeRange} window
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1 p-1 rounded-lg self-start sm:self-auto"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {(['1h', '6h', '24h'] as const).map((r) => (
            <button key={r} onClick={() => setTimeRange(r)}
              className="px-3 py-1 text-xs rounded-md font-semibold transition-all duration-200 font-mono"
              style={btnStyle(timeRange === r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradMalicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" vertical={false} />

            <XAxis dataKey="time" stroke="#4B5563" fontSize={11} tickLine={false}
              axisLine={{ stroke: 'rgba(59,130,246,0.1)' }} />

            <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />

            <Tooltip content={<CustomTooltip />} />

            <Area type="monotone" dataKey="normal" name="Normal Traffic"
              stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#gradNormal)" />

            <Area type="monotone" dataKey="malicious" name="Malicious Traffic"
              stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#gradMalicious)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between pt-3 mt-2 text-xs"
        style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#06B6D4' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Normal (Baseline)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
            <span style={{ color: '#F87171' }} className="font-medium">Malicious Anomaly</span>
          </div>
        </div>
        <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--accent-blue)' }}>{filteredData.length} points</strong> · {timeRange} window
        </span>
      </div>
    </Card>
  );
};

export default TrafficTimelineChart;
