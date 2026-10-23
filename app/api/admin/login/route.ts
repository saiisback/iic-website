import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, createSession, passwordMatches, sameOrigin } from "@/lib/admin/auth";

// Bound login attempts per server instance without trusting forwarded IP headers.
let attemptWindow = 0;
let attempts = 0;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
    return NextResponse.json({ error: "Set ADMIN_PASSWORD to at least 12 characters on the server to enable admin access." }, { status: 503 });
  }
  const now = Date.now();
  if (now - attemptWindow >= 60_000) { attemptWindow = now; attempts = 0; }
  if (++attempts > 20) {
    return NextResponse.json({ error: "Too many sign-in attempts. Try again in a minute." }, { status: 429, headers: { "Retry-After": "60" } });
  }
  try {
    const raw = await request.text();
    if (raw.length > 1024) return NextResponse.json({ error: "Invalid password." }, { status: 400 });
    const { password } = JSON.parse(raw);
    if (typeof password !== "string" || !passwordMatches(password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in. Try again." }, { status: 400 });
  }
}
