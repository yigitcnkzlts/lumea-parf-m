import type { Metadata } from "next";
import { BrandsDirectory } from "@/components/product/brands-directory";
import { brands } from "@/data/brands";

export const metadata: Metadata = {
  title: "Markalar",
  description: "Bee Parfüm'de dünyanın seçkin parfüm markalarını keşfedin.",
};

export default function BrandsPage() {
  return (
    <main>
      <section className="bg-[#141312] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-24 lg:px-8 lg:py-32">
          <p className="text-[10px] tracking-[.3em] text-[#d0ad7b]">PARFÜM DÜNYASI</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[.92] md:text-8xl">Seçkin Markalar</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            Efsanevi moda evlerinden niş koku ustalarına — Bee koleksiyonundaki {brands.length} markayı A’dan Z’ye keşfedin.
          </p>
          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8 text-[10px] tracking-[.2em] text-white/45">
            <p><span className="text-[#d0ad7b]">{brands.length}</span> MARKA</p>
            <p><span className="text-[#d0ad7b]">%100</span> ORİJİNAL</p>
            <p><span className="text-[#d0ad7b]">A–Z</span> DİZİN</p>
          </div>
        </div>
      </section>
      <BrandsDirectory />
    </main>
  );
}
