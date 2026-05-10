/**
 * Catch-all API proxy for gauge-service.
 * Forwards requests from /api/gauge/[...path] → gauge-service:5607/[path].
 */

import { NextResponse } from "next/server";

// ── Passthrough Headers ─────────────────────────────────────
const PASSTHROUGH_HEADERS = ["content-type", "content-disposition", "content-length"];

function resolveUpstream(request, { port, publicUrlEnv, internalUrlEnv }) {
  if (publicUrlEnv) return publicUrlEnv;
  if (
    internalUrlEnv &&
    !internalUrlEnv.includes("localhost") &&
    !internalUrlEnv.includes("127.0.0.1")
  ) {
    return internalUrlEnv;
  }
  const host = request.headers.get("host");
  if (host) {
    const hostname = host.split(":")[0];
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return `${protocol}://${hostname}:${port}`;
  }
  return internalUrlEnv || `http://localhost:${port}`;
}

function createNextjsProxy({ port, serviceName, publicUrlEnv, internalUrlEnv }) {
  async function proxyRequest(request, { params }) {
    const { path } = await params;
    const segments = Array.isArray(path) ? path.join("/") : path;

    const url = new URL(request.url);
    const queryString = url.search || "";
    const upstreamBase = resolveUpstream(request, { port, publicUrlEnv, internalUrlEnv });
    const targetUrl = `${upstreamBase}/${segments}${queryString}`;

    try {
      const fetchOptions = {
        method: request.method,
        headers: { "Content-Type": "application/json" },
      };

      if (request.method !== "GET" && request.method !== "HEAD") {
        try {
          const body = await request.json();
          fetchOptions.body = JSON.stringify(body);
        } catch {
          // No body — fine for some POSTs
        }
      }

      const response = await fetch(targetUrl, fetchOptions);
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!isJson) {
        const headers = new Headers();
        for (const key of PASSTHROUGH_HEADERS) {
          const val = response.headers.get(key);
          if (val) headers.set(key, val);
        }
        return new Response(response.body, { status: response.status, headers });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error(`[API Proxy] ${request.method} /${segments} → ${targetUrl} failed:`, error.message);
      return NextResponse.json(
        { error: `Failed to reach ${serviceName} service: ${error.message}` },
        { status: 502 },
      );
    }
  }

  return {
    GET: proxyRequest,
    POST: proxyRequest,
    PUT: proxyRequest,
    DELETE: proxyRequest,
    PATCH: proxyRequest,
  };
}

export const { GET, POST, PUT, DELETE, PATCH } = createNextjsProxy({
  port: 5607,
  serviceName: "gauge",
  publicUrlEnv: process.env.GAUGE_SERVICE_PUBLIC_URL,
  internalUrlEnv: process.env.GAUGE_SERVICE_URL,
});
