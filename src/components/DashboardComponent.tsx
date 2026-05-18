"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Cpu, Bell, CloudSun } from "lucide-react";
import { getDashboardSummary } from "@/services/GaugeService";
import { SENSOR_TYPE_LABELS, POLL_INTERVAL_DASHBOARD } from "@/constants";
import styles from "./DashboardComponent.module.css";

export default function DashboardComponent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (err: any) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
    const interval = setInterval(fetchDashboard, POLL_INTERVAL_DASHBOARD);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <h1 className={styles.pageTitle}>
          <LayoutDashboard size={24} />
          Dashboard
        </h1>
        <div className={styles.loadingGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Sensors",
      value: data?.totalSensors || 0,
      icon: Cpu,
      color: "var(--color-accent)",
    },
    {
      label: "Active Alerts",
      value: data?.alerts?.active || 0,
      icon: Bell,
      color:
        data?.alerts?.active > 0
          ? "var(--color-warning)"
          : "var(--color-success)",
    },
    {
      label: "Triggered (24h)",
      value: data?.alerts?.triggered24h || 0,
      icon: Bell,
      color:
        data?.alerts?.triggered24h > 0
          ? "var(--color-error)"
          : "var(--color-muted)",
    },
    {
      label: "Sensor Types",
      value: data?.sensorsByType?.length || 0,
      icon: CloudSun,
      color: "var(--color-info)",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>
        <LayoutDashboard size={24} />
        Dashboard
      </h1>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className={styles.statGrid}>
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.statCard}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={styles.statIcon} style={{ color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sensor Type Breakdown ───────────────────────── */}
      {data?.sensorsByType?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sensors by Type</h2>
          <div className={styles.typeGrid}>
            {data.sensorsByType.map((item: any) => (
              <div key={item._id} className={styles.typeChip}>
                <span className={styles.typeLabel}>
                  {(SENSOR_TYPE_LABELS as any)[item._id] || item._id}
                </span>
                <span className={styles.typeCount}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Latest Readings ─────────────────────────────── */}
      {data?.latestReadings?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Latest Readings</h2>
          <div className={styles.readingsGrid}>
            {data.latestReadings.map((reading: any) => (
              <div key={reading._id.toString()} className={styles.readingCard}>
                <span className={styles.readingValue}>
                  {typeof reading.value === "number"
                    ? reading.value.toFixed(1)
                    : reading.value}
                </span>
                <span className={styles.readingTime}>
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────── */}
      {data?.totalSensors === 0 && (
        <div className={styles.emptyState}>
          <Cpu size={48} className={styles.emptyIcon} />
          <h3>No Sensors Registered</h3>
          <p>Add your first sensor to start monitoring environmental data.</p>
        </div>
      )}
    </div>
  );
}
