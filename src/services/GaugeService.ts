// ============================================================
// Gauge Service — HTTP Client
// ============================================================

const API_BASE = "/api/gauge";

async function request(path: any, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data;
}

// ─── Sensors ───────────────────────────────────────────────────

export async function listSensors(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/sensors${qs ? `?${qs}` : ""}`);
}

export async function getSensor(id: any) {
  return request(`/sensors/${id}`);
}

export async function createSensor(data: any) {
  return request("/sensors", { method: "POST", body: JSON.stringify(data) });
}

export async function updateSensor(id: any, data: any) {
  return request(`/sensors/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteSensor(id: any) {
  return request(`/sensors/${id}`, { method: "DELETE" });
}

// ─── Readings ──────────────────────────────────────────────────

export async function ingestReading(data: any) {
  return request("/readings", { method: "POST", body: JSON.stringify(data) });
}

export async function ingestBulkReadings(readings: any) {
  return request("/readings/bulk", { method: "POST", body: JSON.stringify({ readings }) });
}

export async function getReadings(sensorId: any, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/readings/${sensorId}${qs ? `?${qs}` : ""}`);
}

export async function getSparkline(sensorId: any, hours = 24, points = 50) {
  return request(`/readings/${sensorId}/sparkline?hours=${hours}&points=${points}`);
}

export async function getReadingStats(sensorId: any, hours = 24) {
  return request(`/readings/${sensorId}/stats?hours=${hours}`);
}

// ─── Alerts ────────────────────────────────────────────────────

export async function listAlerts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/alerts${qs ? `?${qs}` : ""}`);
}

export async function getAlert(id: any) {
  return request(`/alerts/${id}`);
}

export async function createAlert(data: any) {
  return request("/alerts", { method: "POST", body: JSON.stringify(data) });
}

export async function updateAlert(id: any, data: any) {
  return request(`/alerts/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteAlert(id: any) {
  return request(`/alerts/${id}`, { method: "DELETE" });
}

export async function getAlertHistory(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/alerts/history${qs ? `?${qs}` : ""}`);
}

// ─── Dashboard ─────────────────────────────────────────────────

export async function getDashboardSummary() {
  return request("/dashboard/summary");
}

export async function getSensorOverview() {
  return request("/dashboard/sensors");
}

// ─── Weather (via gauge-service proxy to tools-service) ───────

export async function getCurrentWeather() {
  return request("/weather/current");
}

export async function getWeatherForecast() {
  return request("/weather/forecast");
}

export async function getAirQuality() {
  return request("/weather/air");
}

export async function getDaylight() {
  return request("/weather/daylight");
}

export async function getEnvironmentDashboard() {
  return request("/weather/environment/dashboard");
}

export async function getLiveWeather(location: any, units = "metric") {
  return request(`/weather/live?location=${encodeURIComponent(location)}&units=${units}`);
}

export async function getSpaceWeather() {
  return request("/weather/space");
}

export async function getEarthquakes() {
  return request("/weather/earthquakes");
}

// ─── Health ────────────────────────────────────────────────────

export async function getHealth() {
  return request("/health");
}
