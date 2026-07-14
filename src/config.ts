// ============================================================
// Gauge Client — Runtime Configuration
// ============================================================
// Typed accessor layer over process.env. The Vault service is
// the single source of truth — next.config.ts hydrates
// process.env from the Vault before any module imports run.
//
// This file contains NO defaults, NO secrets, and NO hardcoded
// URLs. All public domain URLs come from the vault registry
// (projects.json → GAUGE_SERVICE_PUBLIC_URL).
//
// Browser requests must NEVER hit localhost or LAN IPs when loaded
// from a public domain — that triggers Chrome's Private Network
// Access (PNA) prompt. URL resolution is delegated to
// resolveClientServiceUrl from utilities-library:
//
//   Production (*.rod.dev):
//     • GAUGE_SERVICE_URL → GAUGE_SERVICE_PUBLIC_URL from vault
//
//   Local dev (localhost):
//     • GAUGE_SERVICE_URL → vault value (LAN IP — same network)
//
//   Server-side (SSR):
//     • All URLs use full values from vault (LAN IPs for Docker)
// ============================================================

import {
  isProductionHostname,
  resolveClientServiceUrl,
} from "@rodrigo-barraza/utilities-library";

export const IS_PRODUCTION = isProductionHostname();
export const IS_LOCALHOST = !IS_PRODUCTION;

export const PROJECT_NAME = IS_PRODUCTION ? "gauge-client" : "gauge-client-dev";

export const GAUGE_CLIENT_PORT =
  process.env.NEXT_PUBLIC_GAUGE_CLIENT_PORT || process.env.GAUGE_CLIENT_PORT;

// ── Raw values from process.env ────────────────────────────────
const RAW_SERVICE_URL =
  process.env.NEXT_PUBLIC_GAUGE_SERVICE_URL || process.env.GAUGE_SERVICE_URL;

// ── Public URL from vault (browser production override) ────────
const PUBLIC_SERVICE_URL =
  process.env.NEXT_PUBLIC_GAUGE_SERVICE_PUBLIC_URL ||
  process.env.GAUGE_SERVICE_PUBLIC_URL;

// ── Gauge Service URL ──────────────────────────────────────────
export const GAUGE_SERVICE_URL = resolveClientServiceUrl({
  internalUrl: RAW_SERVICE_URL,
  publicUrl: PUBLIC_SERVICE_URL,
});

// ── Tools Service URL ──────────────────────────────────────────
// Server-side only — vault value (no browser exposure needed).
export const TOOLS_SERVICE_URL =
  process.env.NEXT_PUBLIC_TOOLS_SERVICE_URL || process.env.TOOLS_SERVICE_URL;
