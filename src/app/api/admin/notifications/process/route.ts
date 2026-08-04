import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { processQueuedNotificationJobs } from "@/lib/notifications/jobs";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

/** Admin-only: attempt to send queued notification jobs (requires real provider). */
export async function POST() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const result = await processQueuedNotificationJobs(50);
    return NextResponse.json({
      ok: true,
      processed: result.processed,
      note: "Provider yoksa işler failed olarak işaretlenir; sahte gönderim yapılmaz.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İşlem başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
