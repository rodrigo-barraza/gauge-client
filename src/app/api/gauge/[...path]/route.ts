/**
 * Catch-all API proxy for gauge-service.
 * Forwards requests from /api/gauge/[...path] → gauge-service:5607/[path].
 */

import { createNextjsProxy } from "@rodrigo-barraza/utilities-library/nextjs";

export const { GET, POST, PUT, DELETE, PATCH } = createNextjsProxy({
  port: 5607,
  serviceName: "gauge",
  publicUrlEnvironmentVariable: "GAUGE_SERVICE_PUBLIC_URL",
  internalUrlEnvironmentVariable: "GAUGE_SERVICE_URL",
});
