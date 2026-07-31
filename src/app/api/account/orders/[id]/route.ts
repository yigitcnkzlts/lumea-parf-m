import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { cancelOrder, requestRefund } from "@/lib/commerce/orders";
import { z } from "zod";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
    const { id } = await context.params;

    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !order) return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const actionSchema = z.object({
  action: z.enum(["cancel", "refund"]),
  reason: z.string().trim().min(2).max(300),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
    const { id } = await context.params;
    const parsed = actionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

    const admin = createAdminClient();
    const { data: order } = await admin.from("orders").select("id, user_id").eq("id", id).single();
    if (!order || order.user_id !== user.id) return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });

    if (parsed.data.action === "cancel") {
      await cancelOrder(id, parsed.data.reason, false);
    } else {
      await requestRefund(id, parsed.data.reason);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İşlem başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
