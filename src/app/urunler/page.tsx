import type { Metadata } from "next";
import { ProductsView } from "@/components/product/products-view";

export const metadata: Metadata = {
  title: "Parfümler | Luméa Parfüm",
  description: "Kadın, erkek ve unisex seçkin parfüm koleksiyonunu keşfedin.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; family?: string }>;
}) {
  const initial = await searchParams;
  return <ProductsView initial={initial} />;
}
