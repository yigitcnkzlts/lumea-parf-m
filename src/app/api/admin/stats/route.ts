import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

const LOW_STOCK_THRESHOLD = 5;

export async function GET() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const admin = createAdminClient();

    const [
      { count: pendingOrders },
      { count: preparingOrders },
      { count: activeProducts },
      { data: stockRows },
      { count: pendingStockAlerts },
      { count: newsletterCount },
    ] = await Promise.all([
      admin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["awaiting_payment", "paid", "preparing"]),
      admin.from("orders").select("id", { count: "exact", head: true }).eq("status", "preparing"),
      admin.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      admin.from("products").select("id, stock").eq("is_active", true).lt("stock", LOW_STOCK_THRESHOLD),
      admin.from("stock_alerts").select("id", { count: "exact", head: true }).eq("notified", false),
      admin.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

    return NextResponse.json({
      pendingOrders: pendingOrders ?? 0,
      preparingOrders: preparingOrders ?? 0,
      activeProducts: activeProducts ?? 0,
      lowStock: stockRows?.length ?? 0,
      pendingStockAlerts: pendingStockAlerts ?? 0,
      newsletterCount: newsletterCount ?? 0,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Özet alınamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
