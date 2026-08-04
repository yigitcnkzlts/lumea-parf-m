import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

const rowSchema = z.object({
  id: z.number().int().positive(),
  stock: z.number().int().min(0).max(100000),
});

/** CSV body: lines of `id,stock` */
export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const contentType = request.headers.get("content-type") ?? "";
    let rows: { id: number; stock: number }[] = [];

    if (contentType.includes("application/json")) {
      const json = await request.json();
      const parsed = z.object({ rows: z.array(rowSchema).min(1).max(500) }).safeParse(json);
      if (!parsed.success) return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
      rows = parsed.data.rows;
    } else {
      const text = await request.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((l) => !l.toLowerCase().startsWith("id"));
      for (const line of lines) {
        const [idRaw, stockRaw] = line.split(/[,;\t]/);
        const id = Number(idRaw);
        const stock = Number(stockRaw);
        const parsed = rowSchema.safeParse({ id, stock });
        if (!parsed.success) {
          return NextResponse.json({ error: `Satır hatalı: ${line}` }, { status: 400 });
        }
        rows.push(parsed.data);
      }
    }

    if (!rows.length) return NextResponse.json({ error: "Boş dosya." }, { status: 400 });

    const admin = createAdminClient();
    let updated = 0;
    const restocked: number[] = [];
    for (const row of rows) {
      const { data: before } = await admin.from("products").select("stock").eq("id", row.id).maybeSingle();
      const prev = before ? Number(before.stock) : null;
      const { error } = await admin.from("products").update({ stock: row.stock }).eq("id", row.id);
      if (!error) {
        updated += 1;
        if (prev === 0 && row.stock > 0) restocked.push(row.id);
      }
    }

    if (restocked.length) {
      const { notifyStockAlertsForProduct } = await import("@/lib/commerce/stock-alerts");
      for (const id of restocked) {
        await notifyStockAlertsForProduct(id);
      }
    }

    return NextResponse.json({ ok: true, updated, total: rows.length, restockNotified: restocked.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İçe aktarma başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
