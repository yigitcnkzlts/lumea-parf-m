import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/env";
import { sendEmail } from "@/lib/notifications/email";
import { sendSms } from "@/lib/notifications/sms";

export async function enqueueOrderNotifications(input: {
  orderId: string;
  userId: string | null;
  email: string;
  phone: string;
  templateKey: string;
  payload: Record<string, unknown>;
}) {
  if (!isSupabaseServiceConfigured()) return;

  const admin = createAdminClient();
  const jobs = [
    {
      order_id: input.orderId,
      user_id: input.userId,
      channel: "email" as const,
      template_key: input.templateKey,
      recipient: input.email,
      payload: input.payload,
      status: "queued" as const,
    },
    {
      order_id: input.orderId,
      user_id: input.userId,
      channel: "sms" as const,
      template_key: input.templateKey,
      recipient: input.phone,
      payload: input.payload,
      status: "queued" as const,
    },
  ];

  await admin.from("notification_jobs").insert(jobs);
}

/**
 * Process queued notification jobs. Without a real email/SMS provider,
 * jobs are marked failed with a clear reason — never fake-sent.
 */
export async function processQueuedNotificationJobs(limit = 20) {
  if (!isSupabaseServiceConfigured()) return { processed: 0 };

  const admin = createAdminClient();
  const { data: jobs, error } = await admin
    .from("notification_jobs")
    .select("id, channel, recipient, template_key, payload")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !jobs?.length) return { processed: 0 };

  let processed = 0;
  for (const job of jobs) {
    const subject = `Bee Kozmetik · ${job.template_key}`;
    const body = JSON.stringify(job.payload ?? {}, null, 2);

    const result =
      job.channel === "email"
        ? await sendEmail({ to: job.recipient, subject, body })
        : await sendSms({ to: job.recipient, body: `${subject}\n${body}` });

    await admin
      .from("notification_jobs")
      .update({
        status: result.sent ? "sent" : "failed",
        last_error: result.sent ? null : result.reason,
        sent_at: result.sent ? new Date().toISOString() : null,
      })
      .eq("id", job.id);

    processed += 1;
  }

  return { processed };
}
