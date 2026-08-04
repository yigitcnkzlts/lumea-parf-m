import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_GATE_COOKIE = "bee_admin_gate";

function panelPassword() {
  return process.env.ADMIN_PANEL_PASSWORD?.trim() ?? "";
}

function signingSecret() {
  return (
    process.env.ADMIN_PANEL_SECRET?.trim() ||
    panelPassword() ||
    "bee-admin-dev-secret"
  );
}

export function isAdminPanelPasswordConfigured() {
  return panelPassword().length >= 6;
}

export function createAdminGateToken(password: string) {
  return createHmac("sha256", signingSecret()).update(`bee-admin-v1:${password}`).digest("hex");
}

export function verifyAdminGateToken(token: string | undefined, password = panelPassword()) {
  if (!token || !password) return false;
  const expected = createAdminGateToken(password);
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminPanelPassword(input: string) {
  const expected = panelPassword();
  if (!expected || input.length < 1) return false;
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function hasValidAdminGateCookie() {
  if (!isAdminPanelPasswordConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_GATE_COOKIE)?.value;
  return verifyAdminGateToken(token);
}

export function adminGateCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
