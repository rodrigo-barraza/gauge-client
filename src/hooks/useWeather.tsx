"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getEnvironmentDashboard,
  getCurrentWeather,
} from "@/services/GaugeService";
import { POLL_INTERVAL_WEATHER } from "@/constants";

export interface WeatherData {
  temperature?: number;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  wind_speed?: number;
  visibility?: number;
  description?: string;
  condition?: string;
  summary?: string;
  feelsLike?: number;
  feels_like?: number;
  pressure?: number;
  uvIndex?: number;
  uv?: number;
  current?: WeatherData;
  [key: string]: unknown;
}

export interface EnvironmentData {
  airQuality?: { error?: string; [key: string]: unknown };
  spaceWeather?: { error?: string; [key: string]: unknown };
  pollen?: { error?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export function useWeather({ pollInterval = POLL_INTERVAL_WEATHER }: { pollInterval?: number } = {}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [weatherData, envData] = await Promise.all([
        getCurrentWeather(),
        getEnvironmentDashboard(),
      ]);
      setWeather(weatherData);
      setEnvironment(envData);
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

  return { weather, environment, loading, error, refetch: fetchData };
}
