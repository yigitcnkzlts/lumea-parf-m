import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/commerce/checkout";
import { requireUser } from "@/lib/auth/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        size: z.number().int().positive(),
        quantity: z.number().int().positive().max(20),
      }),
    )
    .min(1)
    .max(50),
  address: z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(10).max(20),
    email: z.string().trim().email().max(160),
    city: z.string().trim().min(2).max(80),
    district: z.string().trim().min(2).max(80),
    addressLine: z.string().trim().min(5).max(500),
    note: z.string().trim().max(500).optional(),
  }),
  idempotencyKey: z.string().trim().max(80).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }

    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Ödeme için giriş yapmalısınız." }, { status: 401 });
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz istek.", details: parsed.error.flatten() }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0]?.trim() || "127.0.0.1";

    const result = await createCheckoutSession({
      userId: user.id,
      items: parsed.data.items,
      address: parsed.data.address,
      clientIp,
      idempotencyKey: parsed.data.idempotencyKey,
    });

    return NextResponse.json({
      orderId: result.order.id,
      orderNumber: result.order.order_number,
      status: result.order.status,
      total: result.order.total,
      priced: {
        subtotal: result.priced.subtotal,
        shippingFee: result.priced.shippingFee,
        total: result.priced.total,
        lines: result.priced.lines,
      },
      payment: result.payment
        ? {
            // Token used only to render iyzico form — never card data
            checkoutFormContent: result.payment.checkoutFormContent,
            conversationId: result.payment.conversationId,
            paymentPageUrl: result.payment.paymentPageUrl,
          }
        : null,
      requiresPaymentConfig: result.requiresPaymentConfig,
      message: result.message,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
