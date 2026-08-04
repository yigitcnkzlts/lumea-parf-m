import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/catalog/server";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const products = await getCatalogProducts();
  const staticRoutes = [
    "",
    "/urunler",
    "/kadin-parfumleri",
    "/erkek-parfumleri",
    "/unisex",
    "/markalar",
    "/kampanyalar",
    "/hizmetler",
    "/hakkimizda",
    "/iletisim",
    "/koku-danismani",
    "/sepet",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = products.map((product) => ({
    url: `${base}/urunler/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
