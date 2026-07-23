import type { Metadata } from "next";
import { CategoryLanding } from "@/components/product/category-landing";

export const metadata: Metadata = {
  title: "Erkek Parfümleri",
  description: "BEE seçkisi erkek parfümlerini keşfedin.",
};

export default function MenPerfumesPage() {
  return <CategoryLanding category="Erkek" />;
}
