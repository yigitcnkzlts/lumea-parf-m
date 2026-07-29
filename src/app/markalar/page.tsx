import type { Metadata } from "next";
import Link from "next/link";
import { BrandsDirectory } from "@/components/product/brands-directory";
import { brands } from "@/data/brands";

export const metadata: Metadata = {
  title: "Markalar",
  description: "Bee koleksiyonundaki seçkin parfüm markalarını keşfedin.",
};

export default function BrandsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#0f0e0d] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(201,167,117,.22),transparent_42%),radial-gradient(ellipse_at_88%_70%,rgba(201,167,117,.08),transparent_40%)]" />
        <div className="pointer-events-none absolute -right-16 top-20 h-[22rem] w-[22rem] rounded-full border border-[#c9a775]/12" />
        <div className="pointer-events-none absolute -right-4 top-40 h-[12rem] w-[12rem] rounded-full border border-[#c9a775]/08" />

        <div className="relative mx-auto max-w-[1500px] px-5 py-24 lg:px-8 lg:py-32">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#c9a775]" />
            <p className="text-[10px] tracking-[.34em] text-[#d4b48a]">BEE · MARKALAR</p>
          </div>
          <h1 className="mt-7 font-serif text-[clamp(3.2rem,8vw,7rem)] leading-none tracking-[.12em]">
            MARKALAR
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-8 text-white/55 md:text-[15px]">
            Moda evlerinden niş koku ustalarına — Bee’de {brands.length} seçkin marka.
            Beğendiğinize tıklayın, koleksiyonunu açın.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/urunler" className="bg-[#c9a775] px-7 py-4 text-xs tracking-[.16em] text-black transition hover:bg-white">
              TÜM ÜRÜNLER
            </Link>
            <a href="#dizin" className="border border-white/25 px-7 py-4 text-xs tracking-[.16em] transition hover:border-white hover:bg-white hover:text-black">
              A–Z DİZİN
            </a>
          </div>
          <div className="mt-14 flex flex-wrap gap-10 border-t border-white/10 pt-8 text-[10px] tracking-[.22em] text-white/40">
            <p><span className="font-serif text-3xl tracking-normal text-[#e0c08a]">{brands.length}</span><span className="ml-3">MARKA</span></p>
            <p><span className="font-serif text-3xl tracking-normal text-[#e0c08a]">%100</span><span className="ml-3">ORİJİNAL</span></p>
          </div>
        </div>
      </section>

      <div id="dizin">
        <BrandsDirectory />
      </div>
    </main>
  );
}
