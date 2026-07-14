"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getReadings,
  getSparkline,
  getReadingStats,
} from "@/services/GaugeService";
import { POLL_INTERVAL_READINGS } from "@/constants";
import { getErrorMessage } from "@rodrigo-barraza/utilities-library";

export function useReadings(
  sensorId: string,
  { pollInterval = POLL_INTERVAL_READINGS, hours = 24 }: { pollInterval?: number; hours?: number } = {},
) {
  const [readings, setReadings] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState(null);
  const [sparkline, setSparkline] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!sensorId) return;
    try {
      const [readingsData, statsData, sparklineData] = await Promise.all([
        getReadings(sensorId, { limit: "100", sort: "desc" }),
        getReadingStats(sensorId, hours),
        getSparkline(sensorId, hours, 50),
      ]);
      setReadings(readingsData.readings || []);
      setStats(statsData);
      setSparkline(sparklineData.data || []);
      setError(null);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Fetch failed"));
    } finally {
      setLoading(false);
    }
  }, [sensorId, hours]);

  useEffect(() => {
    if (!sensorId) return;
    let cancelled = false;
    async function doFetch() {
      try {
        const [readingsData, statsData, sparklineData] = await Promise.all([
          getReadings(sensorId, { limit: "100", sort: "desc" }),
          getReadingStats(sensorId, hours),
          getSparkline(sensorId, hours, 50),
        ]);
        if (!cancelled) {
          setReadings(readingsData.readings || []);
          setStats(statsData);
          setSparkline(sparklineData.data || []);
          setError(null);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Fetch failed"));
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
  }, [sensorId, hours, pollInterval]);

  return { readings, stats, sparkline, loading, error, refetch: fetchData };
}
