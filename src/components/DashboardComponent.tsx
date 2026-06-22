"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Cpu, Bell, CloudSun } from "lucide-react";
import { getDashboardSummary } from "@/services/GaugeService";
import { SENSOR_TYPE_LABELS, POLL_INTERVAL_DASHBOARD } from "@/constants";
import styles from "./DashboardComponent.module.css";

export default function DashboardComponent() {
  const [data, setData] = useState<{
    totalSensors?: number;
    alerts?: { active?: number; triggered24h?: number };
    sensorsByType?: { _id: string; count: number }[];
    latestReadings?: { _id: string; value: number | string; timestamp: string | number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (err: unknown) {
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
        <h1 className={styles['page-title']}>
          <LayoutDashboard size={24} />
          Dashboard
        </h1>
        <div className={styles['loading-grid']}>
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
        (data?.alerts?.active || 0) > 0
          ? "var(--color-warning)"
          : "var(--color-success)",
    },
    {
      label: "Triggered (24h)",
      value: data?.alerts?.triggered24h || 0,
      icon: Bell,
      color:
        (data?.alerts?.triggered24h || 0) > 0
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
      <h1 className={styles['page-title']}>
        <LayoutDashboard size={24} />
        Dashboard
      </h1>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className={styles['stat-grid']}>
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={styles['stat-card']}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={styles['stat-icon']} style={{ color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className={styles['stat-info']}>
              <span className={styles['stat-value']}>{stat.value}</span>
              <span className={styles['stat-label']}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sensor Type Breakdown ───────────────────────── */}
      {data?.sensorsByType && data.sensorsByType.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Sensors by Type</h2>
          <div className={styles['type-grid']}>
            {data.sensorsByType.map((item: { _id: string; count: number }) => (
              <div key={item._id} className={styles['type-chip']}>
                <span className={styles['type-label']}>
                  {SENSOR_TYPE_LABELS[item._id] || item._id}
                </span>
                <span className={styles['type-count']}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Latest Readings ─────────────────────────────── */}
      {data?.latestReadings && data.latestReadings.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Latest Readings</h2>
          <div className={styles['readings-grid']}>
            {data.latestReadings.map((reading: { _id: string; value: number | string; timestamp: string | number }) => (
              <div key={reading._id.toString()} className={styles['reading-card']}>
                <span className={styles['reading-value']}>
                  {typeof reading.value === "number"
                    ? reading.value.toFixed(1)
                    : reading.value}
                </span>
                <span className={styles['reading-time']}>
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────── */}
      {data?.totalSensors === 0 && (
        <div className={styles['empty-state']}>
          <Cpu size={48} className={styles['empty-icon']} />
          <h3>No Sensors Registered</h3>
          <p>Add your first sensor to start monitoring environmental data.</p>
        </div>
      )}
    </div>
  );
}
