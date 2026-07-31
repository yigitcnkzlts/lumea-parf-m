import { createAdminClient } from "@/lib/supabase/admin";
import type { PricedLine } from "@/lib/commerce/types";

function reservationMinutes() {
  const n = Number(process.env.STOCK_RESERVATION_MINUTES ?? 30);
  return Number.isFinite(n) && n > 0 ? n : 30;
}

export async function createReservations(orderId: string, lines: PricedLine[]) {
  const admin = createAdminClient();
  const expiresAt = new Date(Date.now() + reservationMinutes() * 60_000).toISOString();

  const rows = lines.map((line) => ({
    order_id: orderId,
    product_id: line.productId,
    quantity: line.quantity,
    status: "active" as const,
    expires_at: expiresAt,
  }));

  const { error } = await admin.from("stock_reservations").insert(rows);
  if (error) throw new Error(`Stok rezervasyonu oluşturulamadı: ${error.message}`);
  return { expiresAt };
}

export async function releaseReservations(orderId: string, reason: "released" | "expired" = "released") {
  const admin = createAdminClient();
  const { error } = await admin
    .from("stock_reservations")
    .update({
      status: reason,
      released_at: new Date().toISOString(),
    })
    .eq("order_id", orderId)
    .eq("status", "active");

  if (error) throw new Error(`Stok rezervasyonu serbest bırakılamadı: ${error.message}`);
}

/**
 * Idempotent: consume active reservations and decrement product stock once.
 * Safe to call again — already-consumed reservations are skipped.
 */
export async function consumeReservationsAndDecrementStock(orderId: string) {
  const admin = createAdminClient();

  const { data: reservations, error } = await admin
    .from("stock_reservations")
    .select("id, product_id, quantity, status")
    .eq("order_id", orderId);

  if (error) throw new Error(`Rezervasyonlar okunamadı: ${error.message}`);
  if (!reservations?.length) return { consumed: false, reason: "no_reservations" as const };

  const active = reservations.filter((r) => r.status === "active");
  if (!active.length) {
    const allConsumed = reservations.every((r) => r.status === "consumed");
    return { consumed: allConsumed, reason: "already_processed" as const };
  }

  for (const reservation of active) {
    const { data: product, error: productError } = await admin
      .from("products")
      .select("id, stock")
      .eq("id", reservation.product_id)
      .single();

    if (productError || !product) {
      throw new Error(`Stok düşümü için ürün bulunamadı: ${reservation.product_id}`);
    }

    const nextStock = Math.max(0, Number(product.stock) - Number(reservation.quantity));
    const { error: stockError } = await admin
      .from("products")
      .update({ stock: nextStock })
      .eq("id", reservation.product_id);

    if (stockError) throw new Error(`Stok güncellenemedi: ${stockError.message}`);

    const { error: resError } = await admin
      .from("stock_reservations")
      .update({
        status: "consumed",
        consumed_at: new Date().toISOString(),
      })
      .eq("id", reservation.id)
      .eq("status", "active");

    if (resError) throw new Error(`Rezervasyon tüketilemedi: ${resError.message}`);
  }

  return { consumed: true, reason: "ok" as const };
}
