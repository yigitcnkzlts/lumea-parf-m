import { createAdminClient } from "@/lib/supabase/admin";
import { sendStockAlertEmail } from "@/lib/notifications/email";
import { getSiteUrl } from "@/lib/supabase/env";

/** When stock goes from 0 → >0, email pending stock_alerts and mark notified. */
export async function notifyStockAlertsForProduct(productId: number) {
  const admin = createAdminClient();
  const { data: product } = await admin
    .from("products")
    .select("id, brand, name, slug, stock")
    .eq("id", productId)
    .maybeSingle();

  if (!product || Number(product.stock) <= 0) return { notified: 0 };

  const { data: alerts } = await admin
    .from("stock_alerts")
    .select("id, email")
    .eq("product_id", productId)
    .eq("notified", false);

  if (!alerts?.length) return { notified: 0 };

  const url = `${getSiteUrl()}/urunler/${product.slug}`;
  const title = `${product.brand} ${product.name}`;
  let notified = 0;

  for (const alert of alerts) {
    const result = await sendStockAlertEmail({
      email: alert.email,
      productName: title,
      productUrl: url,
    });
    if (result.sent) {
      await admin.from("stock_alerts").update({ notified: true }).eq("id", alert.id);
      notified += 1;
    }
  }

  return { notified };
}
