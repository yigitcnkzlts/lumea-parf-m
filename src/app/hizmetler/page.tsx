import type { Metadata } from "next";
import Link from "next/link";
import { ServicesHub } from "@/components/support/services-hub";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Bee Kozmetik yurt içi kargo, sipariş takibi, iade, ödeme ve müşteri destek hizmetleri.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#0f0e0d] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(201,167,117,.2),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(201,167,117,.08),transparent_40%)]" />
        <div className="relative mx-auto max-w-[1500px] px-5 py-20 lg:px-8 lg:py-28">
          <p className="text-[10px] tracking-[.34em] text-[#d0ad7b]">BEE HİZMETLER</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] md:text-7xl lg:text-8xl">
            Yardım merkezi
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            Yurt içi kargo, sipariş takibi, iade ve ödeme — Tekirdağ’dan, site sahibi tarafından yönetilen profesyonel destek.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#takip" className="bg-[#c9a775] px-6 py-4 text-xs tracking-[.16em] text-black transition hover:bg-white">
              SİPARİŞ TAKİBİ
            </a>
            <a href="#kargo" className="border border-white/25 px-6 py-4 text-xs tracking-[.16em] transition hover:border-white hover:bg-white hover:text-black">
              KARGO BİLGİSİ
            </a>
            <Link href="/iletisim" className="border border-white/25 px-6 py-4 text-xs tracking-[.16em] transition hover:border-white hover:bg-white hover:text-black">
              İLETİŞİM
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/40">Destek hattı · {WHATSAPP_DISPLAY}</p>
        </div>
      </section>
      <ServicesHub />
    </main>
  );
}
