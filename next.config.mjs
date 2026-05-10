import { createVaultClient } from "@rodrigo-barraza/utilities-library/node";

const vault = createVaultClient({
  localEnvFile: "./.env",
  fallbackEnvFile: "../vault-service/.env",
});

const secrets = await vault.fetch();

Object.assign(process.env, secrets);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
  },
};

export default nextConfig;
