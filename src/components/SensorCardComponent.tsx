"use client";

import styles from "./SensorCardComponent.module.css";

export default function SensorCardComponent({
  sensor,
  onClick,
}: {
  sensor: {
    _id?: string;
    name?: string;
    status?: string;
    lastReading?: number | string | null;
    unit?: string;
    type?: string;
    location?: string;
    lastReadingAt?: string | number | null;
  };
  onClick?: (sensor: unknown) => void;
}) {
  const statusClass = sensor.status || "offline";

  return (
    <button
      className={styles.card}
      onClick={() => onClick?.(sensor)}
      type="button"
    >
      <div className={styles.header}>
        <span className={`status-dot ${statusClass}`} />
        <span className={styles.name}>{sensor.name}</span>
        <span
          className={`badge ${statusClass === "online" ? "success" : statusClass === "warning" ? "warning" : "info"}`}
        >
          {sensor.status}
        </span>
      </div>

      <div className={styles.value}>
        {sensor.lastReading !== null && sensor.lastReading !== undefined
          ? typeof sensor.lastReading === "number"
            ? sensor.lastReading.toFixed(1)
            : sensor.lastReading
          : "—"}
        <span className={styles.unit}>{sensor.unit}</span>
      </div>

      <div className={styles.meta}>
        <span className={styles.type}>{sensor.type}</span>
        {sensor.location && (
          <span className={styles.location}>📍 {sensor.location}</span>
        )}
      </div>

      {sensor.lastReadingAt && (
        <div className={styles.timestamp}>
          {new Date(sensor.lastReadingAt).toLocaleString()}
        </div>
      )}
    </button>
  );
}
