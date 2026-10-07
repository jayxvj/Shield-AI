'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { v2Api, V2Alert, V2Stats, V2Health } from '@/lib/api';

export function useLiveMonitor() {
  const [alerts, setAlerts] = useState<V2Alert[]>([]);
  const [stats, setStats] = useState<V2Stats | null>(null);
  const [health, setHealth] = useState<V2Health | null>(null);
  const [isSseConnected, setIsSseConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initial load & periodic stats polling
  const fetchStatsAndAlerts = useCallback(async () => {
    try {
      const [fetchedStats, fetchedAlerts] = await Promise.all([
        v2Api.getStats().catch(() => null),
        v2Api.getAlerts(50).catch(() => []),
      ]);

      if (fetchedStats) {
        setStats(fetchedStats);
      }
      if (fetchedAlerts && fetchedAlerts.length > 0) {
        setAlerts((prev) => {
          // Merge unique alerts
          const existingIds = new Set(prev.map((a) => a.alert_id));
          const newUnique = fetchedAlerts.filter((a) => !existingIds.has(a.alert_id));
          return [...newUnique, ...prev].slice(0, 100);
        });
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('Error fetching live stats/alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // System Health Check for Deployment Verification
  const verifyHealth = useCallback(async (): Promise<V2Health | null> => {
    try {
      const h = await v2Api.getHealth();
      setHealth(h);
      return h;
    } catch (err) {
      console.error('Health check failed:', err);
      const fallbackHealth: V2Health = {
        status: 'disconnected',
        app: 'Shield-AI',
        version: '1.0.0',
        db: 'error',
        s3: { status: 'unreachable', bucket: 'unknown', error: String(err) },
        sensor_connected: false,
        total_ingested_flows: 0,
        total_malicious_archived: 0,
      };
      setHealth(fallbackHealth);
      return fallbackHealth;
    }
  }, []);

  // Simulate an attack for quick testing & immediate S3 archival verification
  const simulateFlow = useCallback(
    async (attackType = 'DoS') => {
      try {
        const res = await v2Api.simulateFlow(true, attackType);
        if (res.alert) {
          setAlerts((prev) => [res.alert, ...prev.filter((a) => a.alert_id !== res.alert.alert_id)].slice(0, 100));
        }
        await fetchStatsAndAlerts();
      } catch (err) {
        console.error('Simulate flow failed:', err);
      }
    },
    [fetchStatsAndAlerts]
  );

  // Setup Server-Sent Events (SSE) Stream
  useEffect(() => {
    fetchStatsAndAlerts();
    verifyHealth();

    // Stats polling every 4 seconds
    const intervalId = setInterval(fetchStatsAndAlerts, 4000);

    // Initialize SSE connection
    try {
      const es = v2Api.createEventSource();
      eventSourceRef.current = es;

      es.addEventListener('connected', () => {
        setIsSseConnected(true);
      });

      es.addEventListener('alert', (event: MessageEvent) => {
        setIsSseConnected(true);
        try {
          const newAlert: V2Alert = JSON.parse(event.data);
          setAlerts((prev) => [newAlert, ...prev.filter((a) => a.alert_id !== newAlert.alert_id)].slice(0, 100));
          setLastUpdated(new Date());
        } catch (e) {
          console.error('Failed to parse SSE alert event:', e);
        }
      });

      es.onerror = () => {
        setIsSseConnected(false);
      };
    } catch (err) {
      console.warn('SSE connection unsupported or failed:', err);
      setIsSseConnected(false);
    }

    return () => {
      clearInterval(intervalId);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [fetchStatsAndAlerts, verifyHealth]);

  return {
    alerts,
    stats,
    health,
    isSseConnected,
    isLoading,
    lastUpdated,
    refresh: fetchStatsAndAlerts,
    verifyHealth,
    simulateFlow,
  };
}
