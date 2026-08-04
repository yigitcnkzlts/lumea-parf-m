import { products as staticProducts } from "@/data/products";
import { mapDbProduct, type DbProductRow } from "@/lib/catalog/map";
import type { Product } from "@/types/product";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/env";

const SELECT =
  "id, slug, brand, name, category, scent_family, description, price, sale_price, images, rating, review_count, stock, sizes, top_notes, heart_notes, base_notes, is_new, is_best_seller, is_active";

/** Active catalog: DB when available, otherwise static seed. */
export async function getCatalogProducts(): Promise<Product[]> {
  if (!isSupabaseServiceConfigured()) return staticProducts;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .select(SELECT)
      .eq("is_active", true)
      .order("id", { ascending: true });

    if (error || !data?.length) return staticProducts;
    return (data as DbProductRow[]).map(mapDbProduct);
  } catch {
    return staticProducts;
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | null> {
  const list = await getCatalogProducts();
  return list.find((p) => p.slug === slug) ?? null;
}

export async function getNextProductId(): Promise<number> {
  if (!isSupabaseServiceConfigured()) {
    return Math.max(...staticProducts.map((p) => p.id), 0) + 1;
  }
  const admin = createAdminClient();
  const { data } = await admin.from("products").select("id").order("id", { ascending: false }).limit(1);
  const maxId = data?.[0]?.id ?? Math.max(...staticProducts.map((p) => p.id), 0);
  return Number(maxId) + 1;
}
