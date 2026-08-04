import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";
import { processQueuedNotificationJobs } from "@/lib/notifications/jobs";

export async function GET() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("notification_jobs")
      .select("id, channel, template_key, recipient, status, last_error, created_at, sent_at")
      .order("created_at", { ascending: false })
      .limit(80);

    if (error) throw new Error(error.message);

    const { count: newsletterCount } = await admin
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: alertCount } = await admin
      .from("stock_alerts")
      .select("*", { count: "exact", head: true })
      .eq("notified", false);

    return NextResponse.json({
      jobs: data ?? [],
      newsletterCount: newsletterCount ?? 0,
      pendingStockAlerts: alertCount ?? 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST() {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    const result = await processQueuedNotificationJobs(50);
    return NextResponse.json({
      ok: true,
      processed: result.processed,
      note: "Provider yoksa işler failed olur; sahte gönderim yok.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İşlem başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
