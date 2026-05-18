"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listSensors,
  createSensor,
  updateSensor,
  deleteSensor,
} from "@/services/GaugeService";
import { POLL_INTERVAL_DASHBOARD } from "@/constants";

export function useSensors({
  pollInterval = POLL_INTERVAL_DASHBOARD,
}: any = {}) {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await listSensors();
      setSensors(data.sensors || []);
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
        const data = await listSensors();
        if (!cancelled) {
          setSensors(data.sensors || []);
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
    const sensor = await createSensor(data);
    setSensors((prev: any) => [sensor, ...prev]);
    return sensor;
  }, []);

  const update = useCallback(async (id: any, data: any) => {
    const sensor = await updateSensor(id, data);
    setSensors((prev: any) =>
      prev.map((s: any) => (s._id === id ? sensor : s)),
    );
    return sensor;
  }, []);

  const remove = useCallback(async (id: any) => {
    await deleteSensor(id);
    setSensors((prev: any) => prev.filter((s: any) => s._id !== id));
  }, []);

  return { sensors, loading, error, refetch: fetchData, add, update, remove };
}
