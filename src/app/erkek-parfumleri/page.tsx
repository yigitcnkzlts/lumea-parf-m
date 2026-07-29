import type { Metadata } from "next";
import { CategoryLanding } from "@/components/product/category-landing";

export const metadata: Metadata = {
  title: "Erkek Parfümleri",
  description: "Bee erkek parfüm koleksiyonu — Dior, Armani, Gucci, Givenchy ve daha fazlası.",
};

export default function MenPerfumesPage() {
  return <CategoryLanding category="Erkek" />;
}
