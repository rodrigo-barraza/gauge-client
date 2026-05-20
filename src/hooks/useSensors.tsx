"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listSensors,
  createSensor,
  updateSensor,
  deleteSensor,
} from "@/services/GaugeService";
import { POLL_INTERVAL_DASHBOARD, Sensor } from "@/constants";

export function useSensors({
  pollInterval = POLL_INTERVAL_DASHBOARD,
}: { pollInterval?: number | null } = {}) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await listSensors();
      setSensors(data.sensors || []);
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
        const data = await listSensors();
        if (!cancelled) {
          setSensors(data.sensors || []);
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
    const sensor = await createSensor(data);
    setSensors((prev: Sensor[]) => [sensor as Sensor, ...prev]);
    return sensor;
  }, []);

  const update = useCallback(async (id: string, data: Record<string, unknown>) => {
    const sensor = await updateSensor(id, data);
    setSensors((prev: Sensor[]) =>
      prev.map((s: Sensor) => (s._id === id ? (sensor as Sensor) : s)),
    );
    return sensor;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteSensor(id);
    setSensors((prev: Sensor[]) => prev.filter((s: Sensor) => s._id !== id));
  }, []);

  return { sensors, loading, error, refetch: fetchData, add, update, remove };
}
