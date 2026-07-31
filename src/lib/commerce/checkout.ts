import { priceCartFromDatabase } from "@/lib/commerce/pricing";
import { createAwaitingPaymentOrder } from "@/lib/commerce/orders";
import type { CheckoutAddressInput, CheckoutCartLine } from "@/lib/commerce/types";
import { getPaymentProvider, isIyzicoConfigured, missingIyzicoMessage } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl, isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

export async function createCheckoutSession(input: {
  userId: string | null;
  items: CheckoutCartLine[];
  address: CheckoutAddressInput;
  clientIp: string;
  idempotencyKey?: string;
}) {
  if (!isSupabaseServiceConfigured()) {
    throw new Error(missingSupabaseMessage());
  }

  // Prices and stock always from DB — never trust client totals.
  const priced = await priceCartFromDatabase(input.items);

  const { order, reused } = await createAwaitingPaymentOrder({
    userId: input.userId,
    address: input.address,
    priced,
    idempotencyKey: input.idempotencyKey,
  });

  if (!isIyzicoConfigured()) {
    return {
      order,
      priced,
      reused,
      payment: null as null,
      requiresPaymentConfig: true as const,
      message: missingIyzicoMessage(),
    };
  }

  const provider = getPaymentProvider();
  const callbackUrl = process.env.IYZICO_CALLBACK_URL?.trim() || `${getSiteUrl()}/api/payments/iyzico/callback`;

  const nameParts = input.address.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "Musteri";
  const lastName = nameParts.slice(1).join(" ") || "Musteri";

  const init = await provider.initializeCheckout({
    orderId: order.id,
    orderNumber: order.order_number,
    total: Number(order.total),
    currency: "TRY",
    callbackUrl,
    customer: {
      id: input.userId || order.id,
      name: firstName,
      surname: lastName,
      email: input.address.email,
      phone: input.address.phone,
      ip: input.clientIp,
      city: input.address.city,
      address: input.address.addressLine,
    },
    basketItems: priced.lines.map((line) => ({
      id: String(line.productId),
      name: `${line.brand} ${line.name} ${line.sizeMl}ml`,
      category: "Parfum",
      price: line.unitPrice,
      quantity: line.quantity,
    })),
  });

  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({
      iyzico_token: init.token,
      iyzico_conversation_id: init.conversationId,
      payment_status: "pending_3ds",
    })
    .eq("id", order.id);

  return {
    order,
    priced,
    reused,
    payment: {
      token: init.token,
      checkoutFormContent: init.checkoutFormContent,
      conversationId: init.conversationId,
      paymentPageUrl: init.paymentPageUrl,
    },
    requiresPaymentConfig: false as const,
    message: null as string | null,
  };
}
