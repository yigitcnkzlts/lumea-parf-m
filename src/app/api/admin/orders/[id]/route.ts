import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { cancelOrder, markRefunded, setShippingInfo } from "@/lib/commerce/orders";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    const { id } = await context.params;

    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .select("*, order_items(*), stock_reservations(*), payment_events(*), notification_jobs(*)")
      .eq("id", id)
      .single();

    if (error || !order) return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("shipping"),
    cargoCompany: z.string().trim().min(2).max(80),
    trackingNumber: z.string().trim().min(2).max(80),
  }),
  z.object({
    action: z.literal("cancel"),
    reason: z.string().trim().min(2).max(300),
  }),
  z.object({
    action: z.literal("refunded"),
  }),
]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    const { id } = await context.params;
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

    if (parsed.data.action === "shipping") {
      await setShippingInfo(id, parsed.data.cargoCompany, parsed.data.trackingNumber);
    } else if (parsed.data.action === "cancel") {
      await cancelOrder(id, parsed.data.reason, true);
    } else {
      await markRefunded(id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
