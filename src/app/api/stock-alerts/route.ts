import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

const schema = z.object({
  productId: z.number().int().positive(),
  email: z.string().trim().email().max(160),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz e-posta." }, { status: 400 });

    const user = await requireUser();
    const admin = createAdminClient();
    const { error } = await admin.from("stock_alerts").upsert(
      {
        product_id: parsed.data.productId,
        email: parsed.data.email.toLowerCase(),
        user_id: user?.id ?? null,
        notified: false,
      },
      { onConflict: "product_id,email" },
    );

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, message: "Stok gelince haber vereceğiz." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
