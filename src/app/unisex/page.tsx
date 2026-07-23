import type { Metadata } from "next";
import { CategoryLanding } from "@/components/product/category-landing";

export const metadata: Metadata = {
  title: "Unisex Parfümler",
  description: "BEE seçkisi unisex parfümleri keşfedin.",
};

export default function UnisexPerfumesPage() {
  return <CategoryLanding category="Unisex" />;
}
