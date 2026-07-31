import { NextResponse } from "next/server";
import { getPaymentProvider, isIyzicoConfigured, missingIyzicoMessage } from "@/lib/payments";
import { markOrderPaidFromProvider, markOrderPaymentFailed } from "@/lib/commerce/orders";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/supabase/env";

/**
 * iyzico redirects the browser here after Checkout Form / 3DS.
 * Redirect alone is NOT proof of payment — we always verify via server API.
 */
async function handleCallback(request: Request) {
  const site = getSiteUrl();

  if (!isIyzicoConfigured()) {
    return NextResponse.redirect(`${site}/odeme/basarisiz?reason=config`);
  }

  const contentType = request.headers.get("content-type") || "";
  let token = "";

  if (request.method === "POST" && contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    token = String(form.get("token") ?? "");
  } else if (request.method === "POST" && contentType.includes("application/json")) {
    const json = (await request.json()) as { token?: string };
    token = String(json.token ?? "");
  } else {
    const url = new URL(request.url);
    token = url.searchParams.get("token") ?? "";
  }

  if (!token) {
    return NextResponse.redirect(`${site}/odeme/basarisiz?reason=token`);
  }

  const provider = getPaymentProvider();
  const verified = await provider.verifyPayment({ token });

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, order_number, total, payment_status")
    .eq("iyzico_token", token)
    .maybeSingle();

  if (!order) {
    return NextResponse.redirect(`${site}/odeme/basarisiz?reason=order`);
  }

  if (!verified.success || !verified.paymentId) {
    await markOrderPaymentFailed(order.id, verified.raw);
    return NextResponse.redirect(
      `${site}/odeme/basarisiz?order=${encodeURIComponent(order.order_number)}`,
    );
  }

  // Amount check — never trust redirect alone
  if (verified.paidPrice != null && Math.abs(verified.paidPrice - Number(order.total)) > 0.01) {
    await markOrderPaymentFailed(order.id, {
      ...verified.raw,
      mismatch: true,
      expected: order.total,
      paid: verified.paidPrice,
    });
    return NextResponse.redirect(
      `${site}/odeme/basarisiz?order=${encodeURIComponent(order.order_number)}&reason=amount`,
    );
  }

  await markOrderPaidFromProvider({
    orderId: order.id,
    providerPaymentId: verified.paymentId,
    providerConversationId: verified.conversationId,
    eventType: "checkoutform.callback",
    rawPayload: verified.raw,
  });

  return NextResponse.redirect(
    `${site}/odeme/basarili?order=${encodeURIComponent(order.order_number)}`,
  );
}

export async function GET(request: Request) {
  try {
    return await handleCallback(request);
  } catch {
    return NextResponse.redirect(`${getSiteUrl()}/odeme/basarisiz?reason=error`);
  }
}

export async function POST(request: Request) {
  try {
    return await handleCallback(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes(missingIyzicoMessage().slice(0, 20))) {
      return NextResponse.redirect(`${getSiteUrl()}/odeme/basarisiz?reason=config`);
    }
    return NextResponse.redirect(`${getSiteUrl()}/odeme/basarisiz?reason=error`);
  }
}
