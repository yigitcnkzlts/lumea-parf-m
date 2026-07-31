/**
 * Email provider stub. Jobs are queued in notification_jobs.
 * Wire Resend/SMTP when credentials are provided — never mark as sent without a real provider.
 */

export function isEmailProviderConfigured() {
  const provider = (process.env.EMAIL_PROVIDER ?? "stub").toLowerCase();
  if (provider === "stub") return false;
  if (provider === "resend") return Boolean(process.env.RESEND_API_KEY?.trim());
  if (provider === "smtp") {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }
  return false;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ sent: boolean; reason: string }> {
  void input;
  if (!isEmailProviderConfigured()) {
    return {
      sent: false,
      reason: "EMAIL_PROVIDER yapılandırılmadı. Bildirim kuyruğa alındı; gönderim yapılmadı.",
    };
  }
  // Real provider integration goes here when keys are available.
  return { sent: false, reason: "Email provider entegrasyonu henüz bağlanmadı." };
}
