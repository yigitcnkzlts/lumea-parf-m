import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_GATE_COOKIE,
  adminGateCookieOptions,
  createAdminGateToken,
  hasValidAdminGateCookie,
  isAdminPanelPasswordConfigured,
  verifyAdminPanelPassword,
} from "@/lib/auth/admin-gate";

export async function GET() {
  const configured = isAdminPanelPasswordConfigured();
  const unlocked = configured ? await hasValidAdminGateCookie() : false;
  return NextResponse.json({
    configured,
    unlocked,
    message: configured
      ? null
      : "ADMIN_PANEL_PASSWORD .env.local / Vercel env içine eklenmeli (en az 6 karakter).",
  });
}

const bodySchema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    if (!isAdminPanelPasswordConfigured()) {
      return NextResponse.json(
        { error: "Panel şifresi yapılandırılmamış. ADMIN_PANEL_PASSWORD ekleyin." },
        { status: 503 },
      );
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });
    }

    if (!verifyAdminPanelPassword(parsed.data.password)) {
      return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
    }

    const token = createAdminGateToken(parsed.data.password);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_GATE_COOKIE, token, adminGateCookieOptions());
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Giriş başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_GATE_COOKIE, "", { ...adminGateCookieOptions(0), maxAge: 0 });
  return res;
}
