"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertHistory,
} from "@/services/GaugeService";
import { POLL_INTERVAL_DASHBOARD } from "@/constants";

export function useAlerts({
  pollInterval = POLL_INTERVAL_DASHBOARD,
}: any = {}) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [alertsData, historyData] = await Promise.all([
        listAlerts(),
        getAlertHistory({ limit: 50 }),
      ]);
      setAlerts(alertsData.alerts || []);
      setHistory(historyData.history || []);
      setError(null);
    } catch (error: any) {
      setError(error.message);
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
          getAlertHistory({ limit: 50 }),
        ]);
        if (!cancelled) {
          setAlerts(alertsData.alerts || []);
          setHistory(historyData.history || []);
          setError(null);
          setLoading(false);
        }
      } catch (error: any) {
        if (!cancelled) {
          setError(error.message);
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

  const add = useCallback(async (data: any) => {
    const alert = await createAlert(data);
    setAlerts((prev: any) => [alert, ...prev]);
    return alert;
  }, []);

  const update = useCallback(async (id: any, data: any) => {
    const alert = await updateAlert(id, data);
    setAlerts((prev: any) => prev.map((a: any) => (a._id === id ? alert : a)));
    return alert;
  }, []);

  const remove = useCallback(async (id: any) => {
    await deleteAlert(id);
    setAlerts((prev: any) => prev.filter((a: any) => a._id !== id));
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
