/**
 * Real email sending via Resend (or SMTP stub hooks).
 * Never marks as sent without a real provider response.
 */

export function isEmailProviderConfigured() {
  const provider = (process.env.EMAIL_PROVIDER ?? "stub").toLowerCase();
  if (provider === "resend") return Boolean(process.env.RESEND_API_KEY?.trim());
  if (provider === "smtp") {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }
  // Auto-enable Resend if only API key is present
  if (process.env.RESEND_API_KEY?.trim()) return true;
  return false;
}

function fromAddress() {
  return process.env.EMAIL_FROM?.trim() || "Bee Kozmetik <onboarding@resend.dev>";
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
  html?: string;
}): Promise<{ sent: boolean; reason: string }> {
  if (!isEmailProviderConfigured()) {
    return {
      sent: false,
      reason: "E-posta provider yok. EMAIL_PROVIDER=resend ve RESEND_API_KEY ekleyin.",
    };
  }

  const provider = (process.env.EMAIL_PROVIDER ?? (process.env.RESEND_API_KEY ? "resend" : "stub")).toLowerCase();

  if (provider === "resend") {
    const key = process.env.RESEND_API_KEY!.trim();
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [input.to],
        subject: input.subject,
        text: input.body,
        html: input.html ?? `<pre style="font-family:Georgia,serif;white-space:pre-wrap">${input.body}</pre>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { sent: false, reason: `Resend hata: ${err.slice(0, 200)}` };
    }
    return { sent: true, reason: "Resend ile gönderildi." };
  }

  if (provider === "smtp") {
    return {
      sent: false,
      reason: "SMTP seçili ama transporter henüz bağlanmadı. Resend kullanın (EMAIL_PROVIDER=resend).",
    };
  }

  return { sent: false, reason: "Bilinmeyen EMAIL_PROVIDER." };
}

export async function sendWelcomeNewsletter(email: string) {
  return sendEmail({
    to: email,
    subject: "Bee Kozmetik — bültene hoş geldiniz",
    body: `Merhaba,\n\nBee Kozmetik bültenine kaydoldunuz. Yeni koleksiyon ve kampanyaları ilk siz duyacaksınız.\n\nBee Kozmetik\nTekirdağ`,
  });
}

export async function sendStockAlertEmail(input: { email: string; productName: string; productUrl: string }) {
  return sendEmail({
    to: input.email,
    subject: `Stok geldi: ${input.productName}`,
    body: `Merhaba,\n\nTalep ettiğiniz ürün tekrar stokta:\n${input.productName}\n\nİncele: ${input.productUrl}\n\nBee Kozmetik`,
  });
}
