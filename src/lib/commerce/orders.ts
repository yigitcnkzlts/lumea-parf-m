import { createAdminClient } from "@/lib/supabase/admin";
import type { CheckoutAddressInput, OrderStatus, PaymentStatus, PricedCart } from "@/lib/commerce/types";
import { createReservations, releaseReservations, consumeReservationsAndDecrementStock } from "@/lib/commerce/stock";
import { enqueueOrderNotifications } from "@/lib/notifications/jobs";

export function createOrderNumber() {
  const stamp = new Date();
  const date = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(stamp.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `BEE-${date}-${rand}`;
}

export async function createAwaitingPaymentOrder(input: {
  userId: string | null;
  address: CheckoutAddressInput;
  priced: PricedCart;
  idempotencyKey?: string;
}) {
  const admin = createAdminClient();
  const orderNumber = createOrderNumber();

  if (input.idempotencyKey) {
    const { data: existing } = await admin
      .from("orders")
      .select("id, order_number, status, payment_status, total")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing) return { order: existing, reused: true as const };
  }

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: input.userId,
      status: "awaiting_payment" satisfies OrderStatus,
      payment_status: "initialized" satisfies PaymentStatus,
      currency: input.priced.currency,
      subtotal: input.priced.subtotal,
      shipping_fee: input.priced.shippingFee,
      total: input.priced.total,
      customer_name: input.address.fullName,
      customer_email: input.address.email,
      customer_phone: input.address.phone,
      shipping_city: input.address.city,
      shipping_district: input.address.district,
      shipping_address: input.address.addressLine,
      note: input.address.note ?? "",
      idempotency_key: input.idempotencyKey ?? null,
      payment_provider: "iyzico",
    })
    .select("id, order_number, status, payment_status, total, created_at")
    .single();

  if (error || !order) throw new Error(`Sipariş oluşturulamadı: ${error?.message ?? "unknown"}`);

  const items = input.priced.lines.map((line) => ({
    order_id: order.id,
    product_id: line.productId,
    product_slug: line.productSlug,
    brand: line.brand,
    name: line.name,
    size_ml: line.sizeMl,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    line_total: line.lineTotal,
  }));

  const { error: itemsError } = await admin.from("order_items").insert(items);
  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    throw new Error(`Sipariş kalemleri yazılamadı: ${itemsError.message}`);
  }

  await createReservations(order.id, input.priced.lines);
  await enqueueOrderNotifications({
    orderId: order.id,
    userId: input.userId,
    email: input.address.email,
    phone: input.address.phone,
    templateKey: "order_awaiting_payment",
    payload: {
      orderNumber: order.order_number,
      total: order.total,
    },
  });

  return { order, reused: false as const };
}

/**
 * Mark order paid + preparing after verified provider result.
 * Idempotent: if already paid/preparing, no-op.
 */
export async function markOrderPaidFromProvider(input: {
  orderId: string;
  providerPaymentId: string;
  providerConversationId?: string | null;
  eventType: string;
  rawPayload: Record<string, unknown>;
}) {
  const admin = createAdminClient();

  // Idempotency via payment_events unique index
  const { data: existingEvent } = await admin
    .from("payment_events")
    .select("id, processed")
    .eq("provider", "iyzico")
    .eq("provider_payment_id", input.providerPaymentId)
    .eq("event_type", input.eventType)
    .maybeSingle();

  if (existingEvent?.processed) {
    return { alreadyProcessed: true as const };
  }

  const { data: order, error } = await admin
    .from("orders")
    .select("id, status, payment_status, order_number, user_id, customer_email, customer_phone")
    .eq("id", input.orderId)
    .single();

  if (error || !order) throw new Error("Sipariş bulunamadı.");

  if (
    order.payment_status === "success" &&
    (order.status === "paid" ||
      order.status === "preparing" ||
      order.status === "shipped" ||
      order.status === "delivered")
  ) {
    return { alreadyProcessed: true as const };
  }

  const { error: updateError } = await admin
    .from("orders")
    .update({
      status: "preparing" satisfies OrderStatus,
      payment_status: "success" satisfies PaymentStatus,
      paid_at: new Date().toISOString(),
      iyzico_payment_id: input.providerPaymentId,
      iyzico_conversation_id: input.providerConversationId ?? null,
    })
    .eq("id", order.id)
    .in("payment_status", ["initialized", "pending_3ds", "not_started", "failed"]);

  if (updateError) throw new Error(`Sipariş ödeme güncellemesi başarısız: ${updateError.message}`);

  await consumeReservationsAndDecrementStock(order.id);

  await admin.from("payment_events").insert({
    order_id: order.id,
    provider: "iyzico",
    event_type: input.eventType,
    provider_payment_id: input.providerPaymentId,
    provider_conversation_id: input.providerConversationId ?? null,
    status: "success",
    raw_payload: sanitizePaymentPayload(input.rawPayload),
    processed: true,
    processed_at: new Date().toISOString(),
  });

  await enqueueOrderNotifications({
    orderId: order.id,
    userId: order.user_id,
    email: order.customer_email,
    phone: order.customer_phone,
    templateKey: "order_paid",
    payload: { orderNumber: order.order_number },
  });

  return { alreadyProcessed: false as const };
}

export async function markOrderPaymentFailed(orderId: string, rawPayload: Record<string, unknown>) {
  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({
      status: "payment_failed" satisfies OrderStatus,
      payment_status: "failed" satisfies PaymentStatus,
    })
    .eq("id", orderId)
    .in("status", ["pending", "awaiting_payment"]);

  await releaseReservations(orderId, "released");

  await admin.from("payment_events").insert({
    order_id: orderId,
    provider: "iyzico",
    event_type: "payment.failed",
    status: "failed",
    raw_payload: sanitizePaymentPayload(rawPayload),
    processed: true,
    processed_at: new Date().toISOString(),
  });
}

export async function cancelOrder(orderId: string, reason: string, byAdmin = false) {
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("id, status, payment_status").eq("id", orderId).single();
  if (!order) throw new Error("Sipariş bulunamadı.");

  const cancellable =
    order.status === "pending" ||
    order.status === "awaiting_payment" ||
    order.status === "payment_failed" ||
    (byAdmin && (order.status === "paid" || order.status === "preparing"));

  if (!cancellable) throw new Error("Bu sipariş iptal edilemez.");

  await admin
    .from("orders")
    .update({
      status: "cancelled" satisfies OrderStatus,
      payment_status: order.payment_status === "success" ? order.payment_status : ("cancelled" satisfies PaymentStatus),
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
    })
    .eq("id", orderId);

  await releaseReservations(orderId, "released");
}

export async function requestRefund(orderId: string, reason: string) {
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("id, status, payment_status").eq("id", orderId).single();
  if (!order) throw new Error("Sipariş bulunamadı.");
  if (order.payment_status !== "success") throw new Error("Ödenmemiş sipariş iade edilemez.");
  if (!["paid", "preparing", "shipped", "delivered"].includes(order.status)) {
    throw new Error("Bu durumda iade talebi açılamaz.");
  }

  await admin
    .from("orders")
    .update({
      status: "refund_requested" satisfies OrderStatus,
      refund_reason: reason,
    })
    .eq("id", orderId);
}

export async function markRefunded(orderId: string) {
  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({
      status: "refunded" satisfies OrderStatus,
      payment_status: "refunded" satisfies PaymentStatus,
      refunded_at: new Date().toISOString(),
    })
    .eq("id", orderId);
}

export async function setShippingInfo(orderId: string, cargoCompany: string, trackingNumber: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      cargo_company: cargoCompany,
      tracking_number: trackingNumber,
      status: "shipped" satisfies OrderStatus,
      shipped_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .in("status", ["paid", "preparing", "shipped"]);

  if (error) throw new Error(`Kargo bilgisi güncellenemedi: ${error.message}`);

  const { data: order } = await admin
    .from("orders")
    .select("id, order_number, user_id, customer_email, customer_phone")
    .eq("id", orderId)
    .single();

  if (order) {
    await enqueueOrderNotifications({
      orderId: order.id,
      userId: order.user_id,
      email: order.customer_email,
      phone: order.customer_phone,
      templateKey: "order_shipped",
      payload: {
        orderNumber: order.order_number,
        cargoCompany,
        trackingNumber,
      },
    });
  }
}

/** Strip any accidental sensitive fields — never persist card data. */
function sanitizePaymentPayload(payload: Record<string, unknown>) {
  const blocked = ["cardNumber", "card_number", "cvc", "cvv", "expireMonth", "expireYear", "expire_month", "expire_year", "smsCode", "otp"];
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (blocked.some((b) => key.toLowerCase().includes(b.toLowerCase()))) continue;
    if (typeof value === "object" && value && !Array.isArray(value)) {
      out[key] = sanitizePaymentPayload(value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}
