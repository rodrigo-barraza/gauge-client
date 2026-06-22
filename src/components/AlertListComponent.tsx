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
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectComponent,
  BadgeComponent,
  EmptyStateComponent,
} from "@rodrigo-barraza/components-library";
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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

  const sensorOptions = [
    { value: "", label: "Select sensor..." },
    ...sensors.map((sensor) => ({
      value: sensor._id,
      label: `${sensor.name} (${SENSOR_TYPE_LABELS[sensor.type || ""] || sensor.type})`,
    })),
  ];

  const conditionOptions = Object.values(ALERT_CONDITIONS).map((condition) => ({
    value: condition,
    label: condition,
  }));

  const severityOptions = Object.values(ALERT_SEVERITY).map((severity) => ({
    value: severity,
    label: severity,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles['page-title']}>
          <Bell size={24} />
          Alerts
        </h1>
        <ButtonComponent
          variant="primary"
          icon={Plus}
          onClick={() => setShowForm(!showForm)}
        >
          Add Alert
        </ButtonComponent>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputComponent
            placeholder="Alert name"
            value={formData.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: event.target.value })}
            required
          />
          <SelectComponent
            value={formData.sensorId}
            options={sensorOptions}
            onChange={(value: string) => setFormData({ ...formData, sensorId: value })}
            placeholder="Select sensor..."
          />
          <SelectComponent
            value={formData.condition}
            options={conditionOptions}
            onChange={(value: string) => setFormData({ ...formData, condition: value })}
          />
          <InputComponent
            type="number"
            step="any"
            placeholder="Threshold"
            value={formData.threshold}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, threshold: event.target.value })}
            required
          />
          <SelectComponent
            value={formData.severity}
            options={severityOptions}
            onChange={(value: string) => setFormData({ ...formData, severity: value })}
          />
          <div className={styles['form-actions']}>
            <ButtonComponent variant="primary" type="submit">
              Create Alert
            </ButtonComponent>
            <ButtonComponent
              variant="text"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </ButtonComponent>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles['loading-list']}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <div className={styles['alert-list']}>
          {alerts.map((alert) => {
            const sensor = sensors.find(
              (s) => s._id === alert.sensorId?.toString(),
            );
            return (
              <div key={alert._id} className={styles['alert-row']}>
                <div className={styles['alert-info']}>
                  <div className={styles['alert-name']}>
                    <BadgeComponent variant={alert.severity}>
                      {alert.severity}
                    </BadgeComponent>
                    {alert.name}
                  </div>
                  <div className={styles['alert-meta']}>
                    {sensor?.name || "Unknown sensor"} · {alert.condition}{" "}
                    {alert.threshold}
                    {(alert.triggerCount || 0) > 0 && (
                      <span className={styles['trigger-count']}>
                        <AlertTriangle size={12} />
                        {alert.triggerCount}× triggered
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles['alert-actions']}>
                  <BadgeComponent variant={alert.active ? "success" : "info"}>
                    {alert.active ? "Active" : "Disabled"}
                  </BadgeComponent>
                  <IconButtonComponent
                    icon={Trash2}
                    size="small"
                    variant="text"
                    onClick={() => remove(alert._id!)}
                    title="Delete alert"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyStateComponent
          icon={Bell}
          title="No Alert Rules"
          description="Create alert rules to get notified when sensor readings breach thresholds."
        />
      )}

      {history.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Recent Triggers</h2>
          <div className={styles['history-list']}>
            {history.slice(0, 20).map((event) => (
              <div key={event._id} className={styles['history-row']}>
                <BadgeComponent variant={event.severity}>
                  {event.severity}
                </BadgeComponent>
                <span className={styles['history-name']}>{event.alertName}</span>
                <span className={styles['history-value']}>
                  Value: {event.value} {event.condition} {event.threshold}
                </span>
                <span className={styles['history-time']}>
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
