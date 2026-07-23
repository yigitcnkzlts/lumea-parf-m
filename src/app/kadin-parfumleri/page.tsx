import type { Metadata } from "next";
import { CategoryLanding } from "@/components/product/category-landing";

export const metadata: Metadata = {
  title: "Kadın Parfümleri",
  description: "Luméa seçkisi kadın parfümlerini keşfedin.",
};

export default function WomenPerfumesPage() {
  return <CategoryLanding category="Kadın" />;
}
