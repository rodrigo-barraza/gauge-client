"use client";

import { useState } from "react";
import { Bell, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { useSensors } from "@/hooks/useSensors";
import {
  ALERT_CONDITIONS,
  ALERT_SEVERITY,
  SENSOR_TYPE_LABELS,
} from "@/constants";
import styles from "./AlertListComponent.module.css";

export default function AlertListComponent() {
  const { alerts, history, loading, add, remove } = useAlerts();
  const { sensors } = useSensors({ pollInterval: null });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sensorId: "",
    condition: "above",
    threshold: "",
    severity: "warning",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await add({
        ...formData,
        threshold: parseFloat(formData.threshold),
      });
      setFormData({
        name: "",
        sensorId: "",
        condition: "above",
        threshold: "",
        severity: "warning",
        message: "",
      });
      setShowForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Create alert failed:", err.message);
      } else {
        console.error("Create alert failed:", err);
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          <Bell size={24} />
          Alerts
        </h1>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          Add Alert
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Alert name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            className={styles.select}
            value={formData.sensorId}
            onChange={(e) =>
              setFormData({ ...formData, sensorId: e.target.value })
            }
            required
          >
            <option value="">Select sensor...</option>
            {sensors.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({SENSOR_TYPE_LABELS[s.type || ""] || s.type})
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
          >
            {Object.values(ALERT_CONDITIONS).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className={styles.input}
            type="number"
            step="any"
            placeholder="Threshold"
            value={formData.threshold}
            onChange={(e) =>
              setFormData({ ...formData, threshold: e.target.value })
            }
            required
          />
          <select
            className={styles.select}
            value={formData.severity}
            onChange={(e) =>
              setFormData({ ...formData, severity: e.target.value })
            }
          >
            {Object.values(ALERT_SEVERITY).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Create Alert
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles.loadingList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <div className={styles.alertList}>
          {alerts.map((alert) => {
            const sensor = sensors.find(
              (s) => s._id === alert.sensorId?.toString(),
            );
            return (
              <div key={alert._id} className={styles.alertRow}>
                <div className={styles.alertInfo}>
                  <div className={styles.alertName}>
                    <span className={`badge ${alert.severity}`}>
                      {alert.severity}
                    </span>
                    {alert.name}
                  </div>
                  <div className={styles.alertMeta}>
                    {sensor?.name || "Unknown sensor"} · {alert.condition}{" "}
                    {alert.threshold}
                    {(alert.triggerCount || 0) > 0 && (
                      <span className={styles.triggerCount}>
                        <AlertTriangle size={12} />
                        {alert.triggerCount}× triggered
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.alertActions}>
                  <span
                    className={`badge ${alert.active ? "success" : "info"}`}
                  >
                    {alert.active ? "Active" : "Disabled"}
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={() => remove(alert._id!)}
                    title="Delete alert"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Bell size={48} style={{ opacity: 0.3 }} />
          <h3>No Alert Rules</h3>
          <p>
            Create alert rules to get notified when sensor readings breach
            thresholds.
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Triggers</h2>
          <div className={styles.historyList}>
            {history.slice(0, 20).map((event) => (
              <div key={event._id} className={styles.historyRow}>
                <span className={`badge ${event.severity}`}>
                  {event.severity}
                </span>
                <span className={styles.historyName}>{event.alertName}</span>
                <span className={styles.historyValue}>
                  Value: {event.value} {event.condition} {event.threshold}
                </span>
                <span className={styles.historyTime}>
                  {new Date(event.triggeredAt || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
