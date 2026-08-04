import type { Metadata } from "next";
import { CompareClient } from "@/components/product/compare-client";

export const metadata: Metadata = {
  title: "Karşılaştır",
};

export default function ComparePage() {
  return (
    <main className="section-shell !py-16">
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">SEÇİM</p>
      <h1 className="mt-3 font-serif text-5xl">Parfüm karşılaştır</h1>
      <p className="mt-3 max-w-xl text-sm text-neutral-600">En fazla 3 ürünü notaları ve fiyatıyla yan yana görün.</p>
      <div className="mt-10">
        <CompareClient />
      </div>
    </main>
  );
}
