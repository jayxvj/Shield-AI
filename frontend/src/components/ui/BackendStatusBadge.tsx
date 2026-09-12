'use client';

import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import type { DataSource } from '@/hooks/useThreats';

interface BackendStatusBadgeProps {
  source: DataSource;
  onRefresh?: () => void;
}

export function BackendStatusBadge({ source, onRefresh }: BackendStatusBadgeProps) {
  if (source === 'loading') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-500 dark:text-gray-400 shadow-sm">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Connecting to backend…</span>
      </div>
    );
  }

  if (source === 'live') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-[#9EABA2]/40 dark:border-[#BDD1C5]/20 text-xs text-[#5F6F65] dark:text-[#BDD1C5] shadow-sm">
        <Wifi className="w-3.5 h-3.5" />
        <span>Backend: Live</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="ml-1 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Refresh threats"
            aria-label="Refresh threats from backend"
          >
            ↻
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-[#EECC8C]/40 dark:border-[#EECC8C]/30 text-xs text-yellow-700 dark:text-[#EECC8C] shadow-sm">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Backend offline — mock data</span>
    </div>
  );
}
