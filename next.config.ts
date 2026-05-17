// ============================================================
// Gauge Client — Next.js Configuration
// ============================================================
// Bootstraps secrets from Vault (or .env fallback) at startup
// and injects them into process.env for the app.
// ============================================================

import { createVaultClient } from "@rodrigo-barraza/utilities-library/node";
import type { NextConfig } from "next";

// ── Bootstrap secrets at build/dev time ────────────────────────
const vault = createVaultClient({
  localEnvFile: "./.env",
  fallbackEnvFile: "../vault-service/.env",
});

const secrets = await vault.fetch();

// Inject into process.env so config.js can read them
Object.assign(process.env, secrets);

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [],
  turbopack: {},
  transpilePackages: ["@rodrigo-barraza/components-library", "@rodrigo-barraza/utilities-library"],

  env: {
    GAUGE_CLIENT_PORT: secrets.GAUGE_CLIENT_PORT,
    GAUGE_CLIENT_DOMAIN: secrets.GAUGE_CLIENT_DOMAIN,
    GAUGE_SERVICE_URL: secrets.GAUGE_SERVICE_URL,
    GAUGE_SERVICE_PUBLIC_URL: secrets.GAUGE_SERVICE_PUBLIC_URL,
    TOOLS_SERVICE_URL: secrets.TOOLS_SERVICE_URL,

    // Explicit NEXT_PUBLIC_ variables for Turbopack client-side injection
    NEXT_PUBLIC_GAUGE_CLIENT_PORT: secrets.GAUGE_CLIENT_PORT,
    NEXT_PUBLIC_GAUGE_CLIENT_DOMAIN: secrets.GAUGE_CLIENT_DOMAIN,
    NEXT_PUBLIC_GAUGE_SERVICE_URL: secrets.GAUGE_SERVICE_URL,
    NEXT_PUBLIC_GAUGE_SERVICE_PUBLIC_URL: secrets.GAUGE_SERVICE_PUBLIC_URL,
    NEXT_PUBLIC_TOOLS_SERVICE_URL: secrets.TOOLS_SERVICE_URL,
  },
};

export default nextConfig;
