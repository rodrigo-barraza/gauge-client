// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from "react";
import { getEnvironmentDashboard, getCurrentWeather } from "@/services/GaugeService";
import { POLL_INTERVAL_WEATHER } from "@/constants";

export function useWeather({ pollInterval = POLL_INTERVAL_WEATHER } = {}) {
  const [weather, setWeather] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [weatherData, envData] = await Promise.all([
        getCurrentWeather(),
        getEnvironmentDashboard(),
      ]);
      setWeather(weatherData);
      setEnvironment(envData);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function doFetch() {
      try {
        const [weatherData, envData] = await Promise.all([
          getCurrentWeather(),
          getEnvironmentDashboard(),
        ]);
        if (!cancelled) {
          setWeather(weatherData);
          setEnvironment(envData);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
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

  return { weather, environment, loading, error, refetch: fetchData };
}
