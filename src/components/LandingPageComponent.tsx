"use client";

import Link from "next/link";
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Bell,
  BarChart3,
  CloudSun,
  Cpu,
} from "lucide-react";
import styles from "./LandingPageComponent.module.css";

const FEATURES = [
  {
    icon: Thermometer,
    title: "Multi-Sensor Support",
    description:
      "Temperature, humidity, pressure, air quality, UV, CO₂, PM2.5, and custom sensor types.",
  },
  {
    icon: CloudSun,
    title: "Live Weather Data",
    description:
      "Real-time weather, forecasts, air quality, space weather, and pollen data via integrated services.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Threshold-based alerts with severity levels. Get notified when sensors breach critical limits.",
  },
  {
    icon: BarChart3,
    title: "Time-Series Analytics",
    description:
      "Sparkline visualizations, aggregate stats, and historical trend analysis for every sensor.",
  },
  {
    icon: Activity,
    title: "Real-Time Dashboard",
    description:
      "Live sensor grid with auto-refreshing readings, status indicators, and at-a-glance metrics.",
  },
  {
    icon: Cpu,
    title: "Hardware Agnostic",
    description:
      "REST API accepts readings from any source — ESP32, Raspberry Pi, Arduino, or custom IoT devices.",
  },
];

export default function LandingPageComponent() {
  return (
    <div className={styles.landing}>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles['hero-glow']} />
        <div className={styles['hero-content']}>
          <div className={styles['hero-badge']}>
            <Thermometer size={14} />
            Weather & Sensor Monitoring
          </div>
          <h1 className={styles['hero-title']}>
            <span className={styles['hero-title-accent']}>Gauge</span>
            <br />
            Your Environment,
            <br />
            Measured.
          </h1>
          <p className={styles['hero-description']}>
            Real-time sensor monitoring dashboard with weather integration,
            smart alerts, and time-series analytics. Track temperature,
            humidity, air quality, and more from one unified platform.
          </p>
          <div className={styles['hero-cta']}>
            <Link href="/app/dashboard" className={styles['cta-primary']}>
              Open Dashboard
            </Link>
            <Link href="/app/sensors" className={styles['cta-secondary']}>
              Manage Sensors
            </Link>
          </div>
        </div>

        {/* ── Animated Sensor Grid ──────────────────────────── */}
        <div className={styles['hero-visual']}>
          <div className={styles['sensor-grid']}>
            {[
              {
                label: "Temperature",
                value: "22.4°C",
                icon: Thermometer,
                color: "var(--color-accent)",
              },
              {
                label: "Humidity",
                value: "67%",
                icon: Droplets,
                color: "var(--color-info)",
              },
              {
                label: "Wind",
                value: "12 km/h",
                icon: Wind,
                color: "var(--color-success)",
              },
              {
                label: "AQI",
                value: "42",
                icon: Activity,
                color: "var(--color-warning)",
              },
            ].map((sensor, i) => (
              <div
                key={sensor.label}
                className={styles['sensor-preview']}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <sensor.icon size={18} style={{ color: sensor.color }} />
                <span className={styles['sensor-preview-value']}>
                  {sensor.value}
                </span>
                <span className={styles['sensor-preview-label']}>
                  {sensor.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className={styles.features}>
        <h2 className={styles['section-title']}>Everything You Need</h2>
        <p className={styles['section-subtitle']}>
          Built for makers, developers, and anyone who wants to understand their
          environment better.
        </p>
        <div className={styles['feature-grid']}>
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={styles['feature-card']}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={styles['feature-icon']}>
                <feature.icon size={22} />
              </div>
              <h3 className={styles['feature-title']}>{feature.title}</h3>
              <p className={styles['feature-description']}>{feature.description}</p>
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
