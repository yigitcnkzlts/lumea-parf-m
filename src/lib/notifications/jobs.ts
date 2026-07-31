import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/env";

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
