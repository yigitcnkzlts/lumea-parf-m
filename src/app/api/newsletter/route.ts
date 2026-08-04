import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";
import { sendWelcomeNewsletter } from "@/lib/notifications/email";

const schema = z.object({
  email: z.string().trim().email().max(160),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçerli e-posta girin." }, { status: 400 });

    const email = parsed.data.email.toLowerCase();
    const admin = createAdminClient();
    const { error } = await admin.from("newsletter_subscribers").upsert(
      {
        email,
        source: "site",
        is_active: true,
      },
      { onConflict: "email" },
    );

    if (error) throw new Error(error.message);

    const mail = await sendWelcomeNewsletter(email);

    return NextResponse.json({
      ok: true,
      emailSent: mail.sent,
      emailNote: mail.reason,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
