"use client";

import { useState } from "react";
import { Cpu, Plus } from "lucide-react";
import { useSensors } from "@/hooks/useSensors";
import { SENSOR_TYPE_LIST, SENSOR_TYPE_LABELS, UNIT_MAP } from "@/constants";
import SensorCardComponent from "./SensorCardComponent";
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  SearchInputComponent,
  EmptyStateComponent,
} from "@rodrigo-barraza/components-library";
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
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.type || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.location || "").toLowerCase().includes(search.toLowerCase()),
  );

  const sensorTypeOptions = SENSOR_TYPE_LIST.map((type) => ({
    value: type,
    label: SENSOR_TYPE_LABELS[type] || type,
  }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
        <h1 className={styles['page-title']}>
          <Cpu size={24} />
          Sensors
        </h1>
        <ButtonComponent
          variant="primary"
          icon={Plus}
          onClick={() => setShowForm(!showForm)}
        >
          Add Sensor
        </ButtonComponent>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputComponent
            placeholder="Sensor name"
            value={formData.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: event.target.value })}
            required
          />
          <SelectComponent
            value={formData.type}
            options={sensorTypeOptions}
            onChange={(value: string) => setFormData({ ...formData, type: value })}
          />
          <InputComponent
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: event.target.value })}
          />
          <InputComponent
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: event.target.value })}
          />
          <div className={styles['form-actions']}>
            <ButtonComponent variant="primary" type="submit">
              Create Sensor
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

      <SearchInputComponent
        value={search}
        onChange={setSearch}
        placeholder="Search sensors..."
      />

      {loading ? (
        <div className={styles['loading-grid']}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : filteredSensors.length > 0 ? (
        <div className={styles['sensor-grid']}>
          {filteredSensors.map((sensor) => (
            <SensorCardComponent
              key={sensor._id}
              sensor={sensor}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <EmptyStateComponent
          icon={Cpu}
          title={search ? "No sensors match your search" : "No sensors registered"}
          description={
            search
              ? "Try a different search term."
              : 'Click "Add Sensor" to register your first device.'
          }
        />
      )}
    </div>
  );
}
