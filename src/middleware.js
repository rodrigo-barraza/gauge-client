// ============================================================
// Gauge — Next.js Middleware (Auth Gate)
// ============================================================

import { NextResponse } from "next/server";
import { auth, AUTH_ENABLED } from "@/auth";

export const middleware = AUTH_ENABLED ? auth : () => NextResponse.next();

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
