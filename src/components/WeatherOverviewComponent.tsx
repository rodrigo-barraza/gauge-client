"use client";

import { CloudSun, Thermometer, Droplets, Wind, Eye, Sun, Gauge } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import styles from "./WeatherOverviewComponent.module.css";

export default function WeatherOverviewComponent() {
  const { weather, environment, loading, error } = useWeather();

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>
          <CloudSun size={24} />
          Weather
        </h1>
        <div className={styles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>
          <CloudSun size={24} />
          Weather
        </h1>
        <div className={styles.errorState}>
          <CloudSun size={48} style={{ opacity: 0.3 }} />
          <h3>Weather Data Unavailable</h3>
          <p>{error}</p>
          <p className={styles.hint}>Make sure tools-service is running and reachable.</p>
        </div>
      </div>
    );
  }

  // Extract current conditions from the weather data
  const current = weather?.current || weather || {};
  const temp = current.temperature ?? current.temp ?? "—";
  const humidity = current.humidity ?? "—";
  const windSpeed = current.windSpeed ?? current.wind_speed ?? "—";
  const visibility = current.visibility ?? "—";
  const description = current.description || current.condition || current.summary || "";
  const feelsLike = current.feelsLike ?? current.feels_like ?? null;
  const pressure = current.pressure ?? null;
  const uvIndex = current.uvIndex ?? current.uv ?? null;

  const weatherCards = [
    { label: "Temperature", value: typeof temp === "number" ? `${temp.toFixed(1)}°C` : temp, icon: Thermometer, color: "var(--color-accent)" },
    { label: "Humidity", value: typeof humidity === "number" ? `${humidity}%` : humidity, icon: Droplets, color: "var(--color-info)" },
    { label: "Wind Speed", value: typeof windSpeed === "number" ? `${windSpeed} km/h` : windSpeed, icon: Wind, color: "var(--color-success)" },
    { label: "Visibility", value: typeof visibility === "number" ? `${visibility} km` : visibility, icon: Eye, color: "var(--color-text-secondary)" },
  ];

  if (feelsLike !== null) {
    weatherCards.push({ label: "Feels Like", value: typeof feelsLike === "number" ? `${feelsLike.toFixed(1)}°C` : feelsLike, icon: Thermometer, color: "var(--color-warning)" });
  }
  if (pressure !== null) {
    weatherCards.push({ label: "Pressure", value: typeof pressure === "number" ? `${pressure} hPa` : pressure, icon: Gauge, color: "var(--color-text-muted)" });
  }
  if (uvIndex !== null) {
    weatherCards.push({ label: "UV Index", value: uvIndex, icon: Sun, color: "var(--color-warning)" });
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>
        <CloudSun size={24} />
        Weather
      </h1>

      {/* ── Current Conditions ──────────────────────────── */}
      {description && (
        <div className={styles.conditionBanner}>
          <span className={styles.conditionText}>{description}</span>
        </div>
      )}

      <div className={styles.weatherGrid}>
        {weatherCards.map((card, i) => (
          <div
            key={card.label}
            className={styles.weatherCard}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={styles.cardIcon} style={{ color: card.color }}>
              <card.icon size={20} />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>{card.value}</span>
              <span className={styles.cardLabel}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Environment Data ────────────────────────────── */}
      {environment && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Environment</h2>
          <div className={styles.envGrid}>
            {environment.airQuality && !environment.airQuality.error && (
              <div className={styles.envCard}>
                <h3>Air Quality</h3>
                <pre className={styles.envData}>
                  {JSON.stringify(environment.airQuality, null, 2).slice(0, 300)}
                </pre>
              </div>
            )}
            {environment.spaceWeather && !environment.spaceWeather.error && (
              <div className={styles.envCard}>
                <h3>Space Weather</h3>
                <pre className={styles.envData}>
                  {JSON.stringify(environment.spaceWeather, null, 2).slice(0, 300)}
                </pre>
              </div>
            )}
            {environment.pollen && !environment.pollen.error && (
              <div className={styles.envCard}>
                <h3>Pollen</h3>
                <pre className={styles.envData}>
                  {JSON.stringify(environment.pollen, null, 2).slice(0, 300)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
