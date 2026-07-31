import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select("id, order_number, status, payment_status, total, customer_name, customer_email, created_at, cargo_company, tracking_number")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return NextResponse.json({ orders: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
