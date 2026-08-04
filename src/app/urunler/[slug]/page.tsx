import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/catalog/server";
import { siteConfig } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };

  const title = `${product.brand} ${product.name}`;
  const description =
    product.description?.slice(0, 155) ||
    `${product.brand} ${product.name} — Bee Kozmetik’te orijinal, ücretsiz kargo eşiği ${siteConfig.freeShipping.toLocaleString("tr-TR")} TL.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Bee Kozmetik`,
      description,
      type: "website",
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}/urunler/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
