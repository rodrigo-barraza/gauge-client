// ============================================================
// Gauge Service — HTTP Client
// ============================================================

import { createApiClient } from "@rodrigo-barraza/utilities-library";

const API_BASE = "/api/gauge";

const api = createApiClient(API_BASE);

// ─── Sensors ───────────────────────────────────────────────────

export async function listSensors(params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/sensors${queryString ? `?${queryString}` : ""}`);
}

export async function getSensor(id: string) {
  return api.get(`/sensors/${id}`);
}

export async function createSensor(data: Record<string, unknown>) {
  return api.post("/sensors", data);
}

export async function updateSensor(id: string, data: Record<string, unknown>) {
  return api.put(`/sensors/${id}`, data);
}

export async function deleteSensor(id: string) {
  return api.delete(`/sensors/${id}`);
}

// ─── Readings ──────────────────────────────────────────────────

export async function ingestReading(data: Record<string, unknown>) {
  return api.post("/readings", data);
}

export async function ingestBulkReadings(readings: Record<string, unknown>[]) {
  return api.post("/readings/bulk", { readings });
}

export async function getReadings(sensorId: string, params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/readings/${sensorId}${queryString ? `?${queryString}` : ""}`);
}

export async function getSparkline(sensorId: string, hours = 24, points = 50) {
  return api.get(`/readings/${sensorId}/sparkline?hours=${hours}&points=${points}`);
}

export async function getReadingStats(sensorId: string, hours = 24) {
  return api.get(`/readings/${sensorId}/stats?hours=${hours}`);
}

// ─── Alerts ────────────────────────────────────────────────────

export async function listAlerts(params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/alerts${queryString ? `?${queryString}` : ""}`);
}

export async function getAlert(id: string) {
  return api.get(`/alerts/${id}`);
}

export async function createAlert(data: Record<string, unknown>) {
  return api.post("/alerts", data);
}

export async function updateAlert(id: string, data: Record<string, unknown>) {
  return api.put(`/alerts/${id}`, data);
}

export async function deleteAlert(id: string) {
  return api.delete(`/alerts/${id}`);
}

export async function getAlertHistory(params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/alerts/history${queryString ? `?${queryString}` : ""}`);
}

// ─── Dashboard ─────────────────────────────────────────────────

export async function getDashboardSummary() {
  return api.get("/dashboard/summary");
}

export async function getSensorOverview() {
  return api.get("/dashboard/sensors");
}

// ─── Weather (via gauge-service proxy to tools-service) ───────

export async function getCurrentWeather() {
  return api.get("/weather/current");
}

export async function getWeatherForecast() {
  return api.get("/weather/forecast");
}

export async function getAirQuality() {
  return api.get("/weather/air");
}

export async function getDaylight() {
  return api.get("/weather/daylight");
}

export async function getEnvironmentDashboard() {
  return api.get("/weather/environment/dashboard");
}

export async function getLiveWeather(location: string, units = "metric") {
  return api.get(
    `/weather/live?location=${encodeURIComponent(location)}&units=${units}`,
  );
}

export async function getSpaceWeather() {
  return api.get("/weather/space");
}

export async function getEarthquakes() {
  return api.get("/weather/earthquakes");
}

// ─── Health ────────────────────────────────────────────────────

export async function getHealth() {
  return api.get("/health");
}
