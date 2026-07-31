import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

export async function GET() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage(), orders: [] }, { status: 503 });
    }
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select("id, order_number, status, payment_status, total, created_at, cargo_company, tracking_number, shipped_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return NextResponse.json({ orders: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Siparişler alınamadı.";
    return NextResponse.json({ error: message, orders: [] }, { status: 400 });
  }
}
