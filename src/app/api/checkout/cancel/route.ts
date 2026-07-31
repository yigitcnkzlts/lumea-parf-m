import { NextResponse } from "next/server";
import { z } from "zod";
import { cancelOrder } from "@/lib/commerce/orders";
import { requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().trim().min(2).max(300).default("Müşteri iptali"),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

    const admin = createAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("id, user_id, status")
      .eq("id", parsed.data.orderId)
      .single();

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }

    await cancelOrder(order.id, parsed.data.reason, false);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İptal başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
