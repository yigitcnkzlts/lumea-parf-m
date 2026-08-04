import type { Metadata } from "next";
import { ScentAdvisor } from "@/components/product/scent-advisor";

export const metadata: Metadata = {
  title: "Koku Danışmanı",
  description: "Bee Kozmetik koku danışmanı ile size uygun parfümü keşfedin.",
};

export default function KokuDanismaniPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(201,167,117,.16),transparent_40%),linear-gradient(180deg,#faf8f3,#f1ebe2)]" />
      <section className="section-shell relative !py-16 md:!py-20">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">BEE ÖNERİ</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Koku danışmanı</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
          Tercihlerinize göre Bee seçkisinden kişisel öneriler alın.
        </p>
        <div className="mt-10">
          <ScentAdvisor />
        </div>
      </section>
    </main>
  );
}
