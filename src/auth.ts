// ============================================================
// Gauge — Auth.js (next-auth v5) Configuration
// ============================================================
// Google SSO with email whitelist. Only emails listed in
// AUTH_ALLOWED_EMAILS can access the dashboard.
//
// Auth is CONDITIONALLY ENABLED — if AUTH_GOOGLE_ID and
// AUTH_GOOGLE_SECRET are both set, OAuth is active. Otherwise,
// the dashboard runs fully open (no login required).
// ============================================================

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const AUTH_ENABLED = !!(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);

const ALLOWED_EMAILS = (process.env.AUTH_ALLOWED_EMAILS || "")
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: AUTH_ENABLED ? [Google] : [],
  trustHost: true,

  callbacks: {
    signIn({ user }) {
      if (!AUTH_ENABLED) return true;
      if (ALLOWED_EMAILS.length === 0) return true;
      return ALLOWED_EMAILS.includes(user.email?.toLowerCase() || "");
    },

    authorized({ auth: session }) {
      if (!AUTH_ENABLED) return true;
      return !!session?.user;
    },
  },
});
