import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { getNextProductId } from "@/lib/catalog/server";
import { slugify, splitList } from "@/lib/catalog/map";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

const SELECT =
  "id, slug, brand, name, category, scent_family, description, price, sale_price, images, rating, review_count, stock, sizes, top_notes, heart_notes, base_notes, is_new, is_best_seller, is_active";

const productBodySchema = z.object({
  brand: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(2).max(120).optional(),
  category: z.enum(["Kadın", "Erkek", "Unisex"]),
  scentFamily: z.enum(["Odunsu", "Çiçeksi", "Oryantal", "Meyveli"]),
  description: z.string().trim().min(10).max(4000),
  price: z.number().min(0).max(1_000_000),
  salePrice: z.number().min(0).max(1_000_000),
  stock: z.number().int().min(0).max(100000),
  images: z.array(z.string().trim().min(1).max(500)).min(1).max(8),
  sizes: z.array(z.number().int().positive()).min(1).max(6).default([30, 50, 100]),
  topNotes: z.array(z.string().trim().min(1)).max(12).default([]),
  heartNotes: z.array(z.string().trim().min(1)).max(12).default([]),
  baseNotes: z.array(z.string().trim().min(1)).max(12).default([]),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const admin = createAdminClient();
    const { data, error } = await admin.from("products").select(SELECT).order("id", { ascending: true });

    if (error) throw new Error(error.message);
    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const parsed = productBodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz ürün bilgisi.", details: parsed.error.flatten() }, { status: 400 });
    }

    const body = parsed.data;
    if (body.salePrice > body.price) {
      return NextResponse.json({ error: "Satış fiyatı liste fiyatından yüksek olamaz." }, { status: 400 });
    }

    const id = await getNextProductId();
    const slug = body.slug?.trim() || slugify(`${body.brand}-${body.name}`);
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("products")
      .insert({
        id,
        slug,
        brand: body.brand.toLocaleUpperCase("tr-TR"),
        name: body.name,
        category: body.category,
        scent_family: body.scentFamily,
        description: body.description,
        price: body.price,
        sale_price: body.salePrice,
        images: body.images,
        stock: body.stock,
        sizes: body.sizes,
        top_notes: body.topNotes,
        heart_notes: body.heartNotes,
        base_notes: body.baseNotes,
        is_new: body.isNew ?? true,
        is_best_seller: body.isBestSeller ?? false,
        is_active: body.isActive ?? true,
        rating: 0,
        review_count: 0,
      })
      .select(SELECT)
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ product: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ürün eklenemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const patchSchema = z.object({
  productId: z.number().int().positive(),
  stock: z.number().int().min(0).max(100000).optional(),
  brand: z.string().trim().min(1).max(80).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().min(2).max(120).optional(),
  category: z.enum(["Kadın", "Erkek", "Unisex"]).optional(),
  scentFamily: z.enum(["Odunsu", "Çiçeksi", "Oryantal", "Meyveli"]).optional(),
  description: z.string().trim().min(10).max(4000).optional(),
  price: z.number().min(0).max(1_000_000).optional(),
  salePrice: z.number().min(0).max(1_000_000).optional(),
  images: z.array(z.string().trim().min(1).max(500)).min(1).max(8).optional(),
  sizes: z.array(z.number().int().positive()).min(1).max(6).optional(),
  topNotes: z.array(z.string().trim().min(1)).max(12).optional(),
  heartNotes: z.array(z.string().trim().min(1)).max(12).optional(),
  baseNotes: z.array(z.string().trim().min(1)).max(12).optional(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

    const { productId, ...rest } = parsed.data;
    const update: Record<string, unknown> = {};
    if (rest.stock !== undefined) update.stock = rest.stock;
    if (rest.brand !== undefined) update.brand = rest.brand.toLocaleUpperCase("tr-TR");
    if (rest.name !== undefined) update.name = rest.name;
    if (rest.slug !== undefined) update.slug = rest.slug;
    if (rest.category !== undefined) update.category = rest.category;
    if (rest.scentFamily !== undefined) update.scent_family = rest.scentFamily;
    if (rest.description !== undefined) update.description = rest.description;
    if (rest.price !== undefined) update.price = rest.price;
    if (rest.salePrice !== undefined) update.sale_price = rest.salePrice;
    if (rest.images !== undefined) update.images = rest.images;
    if (rest.sizes !== undefined) update.sizes = rest.sizes;
    if (rest.topNotes !== undefined) update.top_notes = rest.topNotes;
    if (rest.heartNotes !== undefined) update.heart_notes = rest.heartNotes;
    if (rest.baseNotes !== undefined) update.base_notes = rest.baseNotes;
    if (rest.isNew !== undefined) update.is_new = rest.isNew;
    if (rest.isBestSeller !== undefined) update.is_best_seller = rest.isBestSeller;
    if (rest.isActive !== undefined) update.is_active = rest.isActive;

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
    }

    const admin = createAdminClient();

    let previousStock: number | null = null;
    if (rest.stock !== undefined) {
      const { data: before } = await admin.from("products").select("stock").eq("id", productId).maybeSingle();
      previousStock = before ? Number(before.stock) : null;
    }

    const { data, error } = await admin.from("products").update(update).eq("id", productId).select(SELECT).single();
    if (error) throw new Error(error.message);

    if (previousStock === 0 && rest.stock !== undefined && rest.stock > 0) {
      const { notifyStockAlertsForProduct } = await import("@/lib/commerce/stock-alerts");
      await notifyStockAlertsForProduct(productId);
    }

    return NextResponse.json({ ok: true, product: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const deleteSchema = z.object({
  productId: z.number().int().positive(),
});

/** Hard-delete if never ordered; otherwise soft-delete (is_active=false) to keep order history. */
export async function DELETE(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

    const body = await request.json().catch(() => ({}));
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz ürün." }, { status: 400 });

    const { productId } = parsed.data;
    const admin = createAdminClient();

    const { data: product } = await admin.from("products").select("id, brand, name").eq("id", productId).maybeSingle();
    if (!product) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });

    const { count: orderCount } = await admin
      .from("order_items")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    if ((orderCount ?? 0) > 0) {
      const { error } = await admin.from("products").update({ is_active: false }).eq("id", productId);
      if (error) throw new Error(error.message);
      return NextResponse.json({
        ok: true,
        soft: true,
        message: "Bu ürün siparişlerde geçtiği için tamamen silinmedi; satıştan kaldırıldı (pasif).",
      });
    }

    await admin.from("stock_reservations").delete().eq("product_id", productId);
    const { error } = await admin.from("products").delete().eq("id", productId);
    if (error) throw new Error(error.message);

    return NextResponse.json({
      ok: true,
      soft: false,
      message: `${product.brand} ${product.name} silindi.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

