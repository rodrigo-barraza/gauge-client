"use client";

import Link from "next/link";
import { Thermometer, Droplets, Wind, Activity, Bell, BarChart3, CloudSun, Cpu } from "lucide-react";
import styles from "./LandingPageComponent.module.css";

const FEATURES = [
  {
    icon: Thermometer,
    title: "Multi-Sensor Support",
    description: "Temperature, humidity, pressure, air quality, UV, CO₂, PM2.5, and custom sensor types.",
  },
  {
    icon: CloudSun,
    title: "Live Weather Data",
    description: "Real-time weather, forecasts, air quality, space weather, and pollen data via integrated services.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Threshold-based alerts with severity levels. Get notified when sensors breach critical limits.",
  },
  {
    icon: BarChart3,
    title: "Time-Series Analytics",
    description: "Sparkline visualizations, aggregate stats, and historical trend analysis for every sensor.",
  },
  {
    icon: Activity,
    title: "Real-Time Dashboard",
    description: "Live sensor grid with auto-refreshing readings, status indicators, and at-a-glance metrics.",
  },
  {
    icon: Cpu,
    title: "Hardware Agnostic",
    description: "REST API accepts readings from any source — ESP32, Raspberry Pi, Arduino, or custom IoT devices.",
  },
];

export default function LandingPageComponent() {
  return (
    <div className={styles.landing}>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Thermometer size={14} />
            Weather & Sensor Monitoring
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>Gauge</span>
            <br />
            Your Environment,
            <br />
            Measured.
          </h1>
          <p className={styles.heroDescription}>
            Real-time sensor monitoring dashboard with weather integration,
            smart alerts, and time-series analytics. Track temperature,
            humidity, air quality, and more from one unified platform.
          </p>
          <div className={styles.heroCta}>
            <Link href="/app/dashboard" className={styles.ctaPrimary}>
              Open Dashboard
            </Link>
            <Link href="/app/sensors" className={styles.ctaSecondary}>
              Manage Sensors
            </Link>
          </div>
        </div>

        {/* ── Animated Sensor Grid ──────────────────────────── */}
        <div className={styles.heroVisual}>
          <div className={styles.sensorGrid}>
            {[
              { label: "Temperature", value: "22.4°C", icon: Thermometer, color: "var(--color-accent)" },
              { label: "Humidity", value: "67%", icon: Droplets, color: "var(--color-info)" },
              { label: "Wind", value: "12 km/h", icon: Wind, color: "var(--color-success)" },
              { label: "AQI", value: "42", icon: Activity, color: "var(--color-warning)" },
            ].map((sensor, i) => (
              <div
                key={sensor.label}
                className={styles.sensorPreview}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <sensor.icon size={18} style={{ color: sensor.color }} />
                <span className={styles.sensorPreviewValue}>{sensor.value}</span>
                <span className={styles.sensorPreviewLabel}>{sensor.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything You Need</h2>
        <p className={styles.sectionSubtitle}>
          Built for makers, developers, and anyone who wants to understand
          their environment better.
        </p>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={styles.featureCard}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={styles.featureIcon}>
                <feature.icon size={22} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="copyright-footer">
        <a href="https://rod.dev" target="_blank" rel="noopener noreferrer">
          © 2023–2026 Rodrigo Barraza
        </a>
      </footer>
    </div>
  );
}
