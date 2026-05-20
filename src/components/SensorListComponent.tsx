"use client";

import { useState } from "react";
import { Cpu, Plus, Search } from "lucide-react";
import { useSensors } from "@/hooks/useSensors";
import { SENSOR_TYPE_LIST, SENSOR_TYPE_LABELS, UNIT_MAP } from "@/constants";
import SensorCardComponent from "./SensorCardComponent";
import styles from "./SensorListComponent.module.css";

export default function SensorListComponent() {
  const { sensors, loading, add, remove: _remove } = useSensors();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "temperature",
    location: "",
    description: "",
  });

  const filteredSensors = sensors.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      (s.location || "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await add({
        ...formData,
        unit: UNIT_MAP[formData.type] || "",
      });
      setFormData({
        name: "",
        type: "temperature",
        location: "",
        description: "",
      });
      setShowForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Create sensor failed:", err.message);
      } else {
        console.error("Create sensor failed:", err);
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          <Cpu size={24} />
          Sensors
        </h1>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          Add Sensor
        </button>
      </div>

      {/* ── Add Sensor Form ────────────────────────────── */}
      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Sensor name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            className={styles.select}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {SENSOR_TYPE_LIST.map((type) => (
              <option key={type} value={type}>
                {SENSOR_TYPE_LABELS[type] || type}
              </option>
            ))}
          </select>
          <input
            className={styles.input}
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
          <input
            className={styles.input}
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Create Sensor
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

      {/* ── Search ─────────────────────────────────────── */}
      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search sensors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Sensor Grid ────────────────────────────────── */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : filteredSensors.length > 0 ? (
        <div className={styles.sensorGrid}>
          {filteredSensors.map((sensor) => (
            <SensorCardComponent
              key={sensor._id}
              sensor={sensor}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Cpu size={48} style={{ opacity: 0.3 }} />
          <h3>
            {search ? "No sensors match your search" : "No sensors registered"}
          </h3>
          <p>
            {search
              ? "Try a different search term."
              : 'Click "Add Sensor" to register your first device.'}
          </p>
        </div>
      )}
    </div>
  );
}
