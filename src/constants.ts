// ============================================================
// Gauge — Constants
// ============================================================

export const SENSOR_TYPES = {
  TEMPERATURE: "temperature",
  HUMIDITY: "humidity",
  PRESSURE: "pressure",
  AIR_QUALITY: "air_quality",
  LIGHT: "light",
  MOTION: "motion",
  WIND_SPEED: "wind_speed",
  RAINFALL: "rainfall",
  UV_INDEX: "uv_index",
  NOISE: "noise",
  CO2: "co2",
  PM25: "pm25",
  CUSTOM: "custom",
};

export const SENSOR_TYPE_LIST = Object.values(SENSOR_TYPES);

export const UNIT_MAP: Record<string, string> = {
  [SENSOR_TYPES.TEMPERATURE]: "°C",
  [SENSOR_TYPES.HUMIDITY]: "%",
  [SENSOR_TYPES.PRESSURE]: "hPa",
  [SENSOR_TYPES.AIR_QUALITY]: "AQI",
  [SENSOR_TYPES.LIGHT]: "lux",
  [SENSOR_TYPES.MOTION]: "events",
  [SENSOR_TYPES.WIND_SPEED]: "km/h",
  [SENSOR_TYPES.RAINFALL]: "mm",
  [SENSOR_TYPES.UV_INDEX]: "UV",
  [SENSOR_TYPES.NOISE]: "dB",
  [SENSOR_TYPES.CO2]: "ppm",
  [SENSOR_TYPES.PM25]: "µg/m³",
  [SENSOR_TYPES.CUSTOM]: "",
};

export const SENSOR_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  WARNING: "warning",
  ERROR: "error",
};

export const ALERT_CONDITIONS = {
  ABOVE: "above",
  BELOW: "below",
  EQUALS: "equals",
  OUTSIDE_RANGE: "outside_range",
};

export const ALERT_SEVERITY = {
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "critical",
};

export const SENSOR_TYPE_LABELS: Record<string, string> = {
  temperature: "Temperature",
  humidity: "Humidity",
  pressure: "Pressure",
  air_quality: "Air Quality",
  light: "Light",
  motion: "Motion",
  wind_speed: "Wind Speed",
  rainfall: "Rainfall",
  uv_index: "UV Index",
  noise: "Noise",
  co2: "CO₂",
  pm25: "PM2.5",
  custom: "Custom",
};

export const SENSOR_TYPE_ICONS: Record<string, string> = {
  temperature: "Thermometer",
  humidity: "Droplets",
  pressure: "Gauge",
  air_quality: "Wind",
  light: "Sun",
  motion: "Activity",
  wind_speed: "Wind",
  rainfall: "CloudRain",
  uv_index: "SunDim",
  noise: "Volume2",
  co2: "Cloud",
  pm25: "Haze",
  custom: "Settings",
};

export const STATUS_COLORS = {
  online: "var(--color-success)",
  offline: "var(--color-muted)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
};

export const SEVERITY_COLORS = {
  info: "var(--color-accent)",
  warning: "var(--color-warning)",
  critical: "var(--color-error)",
};

// ── Navigation ────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/app/dashboard", icon: "LayoutDashboard" },
  { label: "Sensors", path: "/app/sensors", icon: "Cpu" },
  { label: "Weather", path: "/app/weather", icon: "CloudSun" },
  { label: "Alerts", path: "/app/alerts", icon: "Bell" },
];

// ── Polling Intervals ─────────────────────────────────────────

export const POLL_INTERVAL_READINGS = 30_000;
export const POLL_INTERVAL_WEATHER = 60_000;
export const POLL_INTERVAL_DASHBOARD = 15_000;
