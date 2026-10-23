import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "iic_admin";
export const SESSION_SECONDS = 60 * 60 * 8;
const salt = randomBytes(16);

export function passwordMatches(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return false;
  return timingSafeEqual(scryptSync(password, salt, 32), scryptSync(expected, salt, 32));
}

function signature(value: string): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(`iic-admin:${value}`).digest("hex");
}

export function createSession(now = Date.now()): string {
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${signature(expires)}`;
}

export function validSession(token: string | undefined, now = Date.now()): boolean {
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12 || !token) return false;
  const [expires, mac, extra] = token.split(".");
  if (extra || !/^\d+$/.test(expires ?? "") || !/^[a-f0-9]{64}$/.test(mac ?? "")) return false;
  const remaining = Number(expires) - Math.floor(now / 1000);
  return remaining > 0 && remaining <= SESSION_SECONDS && timingSafeEqual(Buffer.from(mac), Buffer.from(signature(expires)));
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}
