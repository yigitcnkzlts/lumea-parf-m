import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/contact";
import { createOrderId, formatOrderEmail, type OrderPayload, type PlacedOrder } from "@/lib/orders";

export const runtime = "nodejs";

function isValid(payload: OrderPayload) {
  return Boolean(
    payload.name?.trim() &&
      payload.phone?.trim() &&
      payload.city?.trim() &&
      payload.district?.trim() &&
      payload.address?.trim() &&
      Array.isArray(payload.items) &&
      payload.items.length > 0 &&
      typeof payload.total === "number" &&
      payload.total > 0,
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderPayload;
    if (!isValid(body)) {
      return NextResponse.json({ ok: false, error: "Eksik sipariş bilgisi." }, { status: 400 });
    }

    const order: PlacedOrder = {
      ...body,
      orderId: createOrderId(),
      createdAt: new Date().toISOString(),
      status: "odeme_bekleniyor",
    };

    const emailBody = formatOrderEmail(order);

    // Site sahibine e-posta bildirimi (FormSubmit — ilk seferde e-postadan onay gerekir)
    let emailed = false;
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Bee yeni sipariş — ${order.orderId}`,
          _template: "box",
          message: emailBody,
          name: order.name,
          phone: order.phone,
          email: order.email || CONTACT_EMAIL,
          orderId: order.orderId,
          total: `${order.total.toLocaleString("tr-TR")} TL`,
        }),
      });
      emailed = response.ok;
    } catch {
      emailed = false;
    }

    return NextResponse.json({
      ok: true,
      orderId: order.orderId,
      createdAt: order.createdAt,
      emailed,
      order,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Sipariş alınamadı." }, { status: 500 });
  }
}
