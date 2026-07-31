/**
 * SMS provider stub. Jobs are queued in notification_jobs.
 * Wire Netgsm/Twilio when credentials are provided.
 */

export function isSmsProviderConfigured() {
  const provider = (process.env.SMS_PROVIDER ?? "stub").toLowerCase();
  if (provider === "stub") return false;
  if (provider === "netgsm") {
    return Boolean(process.env.NETGSM_USER && process.env.NETGSM_PASS && process.env.NETGSM_HEADER);
  }
  return false;
}

export async function sendSms(input: {
  to: string;
  body: string;
}): Promise<{ sent: boolean; reason: string }> {
  void input;
  if (!isSmsProviderConfigured()) {
    return {
      sent: false,
      reason: "SMS_PROVIDER yapılandırılmadı. Bildirim kuyruğa alındı; gönderim yapılmadı.",
    };
  }
  return { sent: false, reason: "SMS provider entegrasyonu henüz bağlanmadı." };
}
