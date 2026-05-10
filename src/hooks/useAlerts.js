"use client";

import { useState, useEffect, useCallback } from "react";
import { listAlerts, createAlert, updateAlert, deleteAlert, getAlertHistory } from "@/services/GaugeService";
import { POLL_INTERVAL_DASHBOARD } from "@/constants";

export function useAlerts({ pollInterval = POLL_INTERVAL_DASHBOARD } = {}) {
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
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
    } catch (err) {
      setError(err.message);
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
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
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

  const add = useCallback(async (data) => {
    const alert = await createAlert(data);
    setAlerts((prev) => [alert, ...prev]);
    return alert;
  }, []);

  const update = useCallback(async (id, data) => {
    const alert = await updateAlert(id, data);
    setAlerts((prev) => prev.map((a) => (a._id === id ? alert : a)));
    return alert;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteAlert(id);
    setAlerts((prev) => prev.filter((a) => a._id !== id));
  }, []);

  return { alerts, history, loading, error, refetch: fetchData, add, update, remove };
}
