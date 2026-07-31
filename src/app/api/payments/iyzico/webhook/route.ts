import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { markOrderPaidFromProvider, markOrderPaymentFailed } from "@/lib/commerce/orders";
import { getPaymentProvider, isIyzicoConfigured } from "@/lib/payments";

/**
 * Server-to-server webhook. Idempotent.
 * Does not accept client-reported totals. Card data must never appear here.
 */
export async function POST(request: Request) {
  try {
    if (!isIyzicoConfigured()) {
      return NextResponse.json({ error: "iyzico not configured" }, { status: 503 });
    }

    const payload = (await request.json()) as Record<string, unknown>;
    const token = typeof payload.token === "string" ? payload.token : "";
    const paymentId = payload.paymentId != null ? String(payload.paymentId) : null;
    const status = String(payload.status ?? payload.paymentStatus ?? "").toUpperCase();

    // Optional shared-secret check when configured
    const secret = process.env.IYZICO_WEBHOOK_SECRET?.trim();
    if (secret) {
      const header = request.headers.get("x-iyzico-signature") || request.headers.get("x-webhook-secret");
      if (header !== secret) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
    }

    const admin = createAdminClient();
    let orderId: string | null = null;

    if (token) {
      const { data } = await admin.from("orders").select("id").eq("iyzico_token", token).maybeSingle();
      orderId = data?.id ?? null;
    }
    if (!orderId && paymentId) {
      const { data } = await admin.from("orders").select("id").eq("iyzico_payment_id", paymentId).maybeSingle();
      orderId = data?.id ?? null;
    }
    if (!orderId && typeof payload.basketId === "string") {
      orderId = payload.basketId;
    }

    if (!orderId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Prefer verifying via token when available
    if (token) {
      const verified = await getPaymentProvider().verifyPayment({ token });
      if (verified.success && verified.paymentId) {
        await markOrderPaidFromProvider({
          orderId,
          providerPaymentId: verified.paymentId,
          providerConversationId: verified.conversationId,
          eventType: "webhook.verified",
          rawPayload: verified.raw,
        });
        return NextResponse.json({ ok: true });
      }
      await markOrderPaymentFailed(orderId, verified.raw);
      return NextResponse.json({ ok: true, failed: true });
    }

    if (status === "SUCCESS" && paymentId) {
      await markOrderPaidFromProvider({
        orderId,
        providerPaymentId: paymentId,
        providerConversationId: typeof payload.conversationId === "string" ? payload.conversationId : null,
        eventType: "webhook.status",
        rawPayload: payload,
      });
      return NextResponse.json({ ok: true });
    }

    if (status === "FAILURE" || status === "FAILED") {
      await markOrderPaymentFailed(orderId, payload);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "webhook error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
