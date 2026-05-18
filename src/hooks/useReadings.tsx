"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getReadings,
  getSparkline,
  getReadingStats,
} from "@/services/GaugeService";
import { POLL_INTERVAL_READINGS } from "@/constants";

export function useReadings(
  sensorId: any,
  { pollInterval = POLL_INTERVAL_READINGS, hours = 24 }: any = {},
) {
  const [readings, setReadings] = useState<any[]>([]);
  const [stats, setStats] = useState(null);
  const [sparkline, setSparkline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!sensorId) return;
    try {
      const [readingsData, statsData, sparklineData] = await Promise.all([
        getReadings(sensorId, { limit: 100, sort: "desc" }),
        getReadingStats(sensorId, hours),
        getSparkline(sensorId, hours, 50),
      ]);
      setReadings(readingsData.readings || []);
      setStats(statsData);
      setSparkline(sparklineData.data || []);
      setError(null);
    } catch (error: any) {
      setError(error.message);
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
          getReadings(sensorId, { limit: 100, sort: "desc" }),
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
  }, [sensorId, hours, pollInterval]);

  return { readings, stats, sparkline, loading, error, refetch: fetchData };
}
