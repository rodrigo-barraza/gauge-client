"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertHistory,
} from "@/services/GaugeService";
import { POLL_INTERVAL_DASHBOARD, Alert, AlertEvent } from "@/constants";

export function useAlerts({
  pollInterval = POLL_INTERVAL_DASHBOARD,
}: { pollInterval?: number } = {}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [alertsData, historyData] = await Promise.all([
        listAlerts(),
        getAlertHistory({ limit: "50" }),
      ]);
      setAlerts(alertsData.alerts || []);
      setHistory(historyData.history || []);
      setError(null);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function doFetch() {
      try {
        const [alertsData, historyData] = await Promise.all([
          listAlerts(),
          getAlertHistory({ limit: "50" }),
        ]);
        if (!cancelled) {
          setAlerts(alertsData.alerts || []);
          setHistory(historyData.history || []);
          setError(null);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : "Fetch failed");
          setLoading(false);
        }
      }
    }
    doFetch();
    const timer = pollInterval ? setInterval(doFetch, pollInterval) : null;
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [pollInterval]);

  const add = useCallback(async (data: Record<string, unknown>) => {
    const alert = await createAlert(data);
    setAlerts((prev: Alert[]) => [alert as Alert, ...prev]);
    return alert;
  }, []);

  const update = useCallback(async (id: string, data: Record<string, unknown>) => {
    const alert = await updateAlert(id, data);
    setAlerts((prev: Alert[]) => prev.map((alert: Alert) => (alert._id === id ? (alert as Alert) : alert)));
    return alert;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteAlert(id);
    setAlerts((prev: Alert[]) => prev.filter((alert: Alert) => alert._id !== id));
  }, []);

  return {
    alerts,
    history,
    loading,
    error,
    refetch: fetchData,
    add,
    update,
    remove,
  };
}
