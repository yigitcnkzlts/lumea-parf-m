import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteAllInstallments } from "@/lib/payments/installments";

const schema = z.object({
  amount: z.number().positive().max(1_000_000),
});

/** Preview only — final card installment table comes from iyzico/bank. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz tutar." }, { status: 400 });
  }
  return NextResponse.json({
    quotes: quoteAllInstallments(Math.round(parsed.data.amount)),
    note: "Önizleme tutarıdır. Kart formunda bankanın kesin taksit tablosu geçerlidir.",
  });
}
