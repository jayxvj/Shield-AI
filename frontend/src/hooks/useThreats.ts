/**
 * useThreats — fetches live threats from the FastAPI backend.
 * Falls back to MOCK_THREAT_ALERTS when the backend is unreachable.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { threatsApi, backendThreatToAlert } from '@/lib/api';
import { MOCK_THREAT_ALERTS, ThreatAlert } from '@/lib/mock-data';

export type DataSource = 'live' | 'mock' | 'loading';

interface UseThreatsResult {
  threats: ThreatAlert[];
  source: DataSource;
  refresh: () => void;
  updateThreatStatus: (alertId: string, status: ThreatAlert['status']) => void;
}

export function useThreats(): UseThreatsResult {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [source, setSource] = useState<DataSource>('loading');

  const load = useCallback(async () => {
    setSource('loading');
    try {
      const data = await threatsApi.list({ limit: 200 });
      if (data.length > 0) {
        setThreats(data.map(backendThreatToAlert));
        setSource('live');
      } else {
        // Backend is up but empty — seed with a few mock entries then use live
        setThreats(MOCK_THREAT_ALERTS);
        setSource('mock');
      }
    } catch {
      // Backend unreachable — use mock data silently
      setThreats(MOCK_THREAT_ALERTS);
      setSource('mock');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateThreatStatus = useCallback(
    (alertId: string, status: ThreatAlert['status']) => {
      setThreats((prev) =>
        prev.map((t) => (t.alertId === alertId ? { ...t, status } : t))
      );
    },
    []
  );

  return { threats, source, refresh: load, updateThreatStatus };
}
