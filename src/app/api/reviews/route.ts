import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = Number(searchParams.get("productId"));
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "productId gerekli" }, { status: 400 });
    }

    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ reviews: [] });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("product_reviews")
      .select("id, product_id, name, rating, title, body, photo_urls, created_at")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) throw new Error(error.message);
    return NextResponse.json({ reviews: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const bodySchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(10).max(2000),
  photoUrls: z.array(z.string().url()).max(3).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Yorum için giriş yapın." }, { status: 401 });

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz yorum." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("product_reviews")
      .insert({
        product_id: parsed.data.productId,
        user_id: user.id,
        name: parsed.data.name,
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
        photo_urls: parsed.data.photoUrls ?? [],
        is_approved: true,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yorum kaydedilemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
