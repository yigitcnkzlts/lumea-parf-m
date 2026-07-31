import type { CheckoutCartLine, PricedCart, PricedLine } from "@/lib/commerce/types";
import { createAdminClient } from "@/lib/supabase/admin";

function freeShippingThreshold() {
  const n = Number(process.env.FREE_SHIPPING_THRESHOLD ?? 1500);
  return Number.isFinite(n) ? n : 1500;
}

function shippingFee() {
  const n = Number(process.env.SHIPPING_FEE ?? 99);
  return Number.isFinite(n) ? n : 99;
}

/** Server-side pricing from DB. Never trust client totals. */
export async function priceCartFromDatabase(items: CheckoutCartLine[]): Promise<PricedCart> {
  if (!items.length) {
    throw new Error("Sepet boş.");
  }

  const admin = createAdminClient();
  const productIds = [...new Set(items.map((i) => i.productId))];

  const { data: products, error } = await admin
    .from("products")
    .select("id, slug, brand, name, sale_price, stock, sizes, is_active")
    .in("id", productIds);

  if (error) throw new Error(`Ürün fiyatları alınamadı: ${error.message}`);
  if (!products?.length) throw new Error("Sepetteki ürünler bulunamadı.");

  const byId = new Map(products.map((p) => [p.id as number, p]));
  const lines: PricedLine[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Geçersiz adet.");
    }
    const product = byId.get(item.productId);
    if (!product || !product.is_active) {
      throw new Error(`Ürün satışta değil (id: ${item.productId}).`);
    }
    const sizes = (product.sizes as number[]) ?? [];
    if (!sizes.includes(item.size)) {
      throw new Error(`${product.name} için geçersiz ml seçimi.`);
    }

    const { data: available, error: availError } = await admin.rpc("product_available_stock", {
      p_product_id: item.productId,
    });
    if (availError) throw new Error(`Stok kontrolü başarısız: ${availError.message}`);

    const availableStock = Number(available ?? product.stock ?? 0);
    if (availableStock < item.quantity) {
      throw new Error(`${product.brand} ${product.name} için yetersiz stok (kalan: ${availableStock}).`);
    }

    const unitPrice = Number(product.sale_price);
    lines.push({
      productId: product.id,
      productSlug: product.slug,
      brand: product.brand,
      name: product.name,
      sizeMl: item.size,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
      availableStock,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const fee = subtotal >= freeShippingThreshold() ? 0 : shippingFee();

  return {
    lines,
    subtotal,
    shippingFee: fee,
    total: subtotal + fee,
    currency: "TRY",
  };
}

/** Fallback when DB products table is empty — prices still come from server catalog, not client. */
export async function priceCartFromStaticCatalog(items: CheckoutCartLine[]): Promise<PricedCart> {
  const { products } = await import("@/data/products");
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: PricedLine[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) throw new Error(`Ürün bulunamadı (id: ${item.productId}).`);
    if (!product.sizes.includes(item.size)) throw new Error("Geçersiz ml seçimi.");
    if (product.stock < item.quantity) {
      throw new Error(`${product.brand} ${product.name} için yetersiz stok.`);
    }
    const unitPrice = product.salePrice;
    lines.push({
      productId: product.id,
      productSlug: product.slug,
      brand: product.brand,
      name: product.name,
      sizeMl: item.size,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
      availableStock: product.stock,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const fee = subtotal >= freeShippingThreshold() ? 0 : shippingFee();
  return { lines, subtotal, shippingFee: fee, total: subtotal + fee, currency: "TRY" };
}
