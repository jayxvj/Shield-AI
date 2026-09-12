/**
 * useLiveMonitoring — polls the live monitoring backend endpoints.
 *
 * - Polls /status every 3 s when idle; every 1 s while capturing.
 * - Polls /stats every 2 s while capturing.
 * - Exposes start/stop controls.
 * - If the backend is unreachable or the feature is disabled, the hook
 *   returns a safe default state — the rest of the app is unaffected.
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  liveMonitoringApi,
  MonitoringStatus,
  LiveStats,
  LiveAlert,
  NetworkInterface,
} from '@/lib/liveMonitoringApi';

export type LMConnectionState = 'connecting' | 'connected' | 'error' | 'disabled';

export interface UseLiveMonitoringResult {
  connectionState: LMConnectionState;
  status: MonitoringStatus | null;
  stats: LiveStats | null;
  interfaces: NetworkInterface[];
  recentAlerts: LiveAlert[];
  startCapture: (iface: string) => Promise<void>;
  stopCapture: () => Promise<void>;
  refreshInterfaces: () => Promise<void>;
  errorMessage: string | null;
}

const POLL_IDLE_MS = 3_000;
const POLL_ACTIVE_MS = 1_000;
const STATS_POLL_MS = 2_000;

export function useLiveMonitoring(): UseLiveMonitoringResult {
  const [connectionState, setConnectionState] = useState<LMConnectionState>('connecting');
  const [status, setStatus] = useState<MonitoringStatus | null>(null);
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<LiveAlert[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const s = await liveMonitoringApi.getStatus();
      if (!isMounted.current) return;
      setStatus(s);
      if (!s.feature_enabled) {
        setConnectionState('disabled');
      } else {
        setConnectionState('connected');
        setErrorMessage(s.error_message);
      }
    } catch (e: unknown) {
      if (!isMounted.current) return;
      setConnectionState('error');
      setErrorMessage(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const s = await liveMonitoringApi.getStats();
      if (!isMounted.current) return;
      setStats(s);
      if (s.recent_alerts?.length) {
        setRecentAlerts(s.recent_alerts);
      }
    } catch {
      // Stats fetch failure is non-critical — silently ignore
    }
  }, []);

  // Status polling loop
  useEffect(() => {
    let active = true;

    const poll = async () => {
      await fetchStatus();
      if (!active) return;
      const delay = status?.is_capturing ? POLL_ACTIVE_MS : POLL_IDLE_MS;
      statusTimerRef.current = setTimeout(poll, delay);
    };

    poll();

    return () => {
      active = false;
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.is_capturing, fetchStatus]);

  // Stats polling loop (only while capturing)
  useEffect(() => {
    if (!status?.is_capturing) return;

    let active = true;

    const poll = async () => {
      await fetchStats();
      if (!active) return;
      statsTimerRef.current = setTimeout(poll, STATS_POLL_MS);
    };

    poll();

    return () => {
      active = false;
      if (statsTimerRef.current) clearTimeout(statsTimerRef.current);
    };
  }, [status?.is_capturing, fetchStats]);

  const refreshInterfaces = useCallback(async () => {
    try {
      const ifaces = await liveMonitoringApi.getInterfaces();
      if (isMounted.current) setInterfaces(ifaces);
    } catch (e: unknown) {
      if (isMounted.current)
        setErrorMessage(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const startCapture = useCallback(async (iface: string) => {
    try {
      setErrorMessage(null);
      const s = await liveMonitoringApi.startCapture(iface);
      if (isMounted.current) setStatus(s);
    } catch (e: unknown) {
      if (isMounted.current)
        setErrorMessage(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const stopCapture = useCallback(async () => {
    try {
      const s = await liveMonitoringApi.stopCapture();
      if (isMounted.current) {
        setStatus(s);
        setStats(null);
        setRecentAlerts([]);
      }
    } catch (e: unknown) {
      if (isMounted.current)
        setErrorMessage(e instanceof Error ? e.message : String(e));
    }
  }, []);

  return {
    connectionState,
    status,
    stats,
    interfaces,
    recentAlerts,
    startCapture,
    stopCapture,
    refreshInterfaces,
    errorMessage,
  };
}
