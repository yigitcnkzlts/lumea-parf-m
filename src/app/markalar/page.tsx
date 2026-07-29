import type { Metadata } from "next";
import { BrandsDirectory } from "@/components/product/brands-directory";
import { brands } from "@/data/brands";

export const metadata: Metadata = {
  title: "Markalar",
  description: "Bee sitesindeki parfüm markaları.",
};

export default function BrandsPage() {
  return (
    <main>
      <section className="border-b border-black/10 bg-[#141312] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-[10px] tracking-[.3em] text-[#d0ad7b]">BEE</p>
          <h1 className="mt-4 font-serif text-5xl tracking-[.08em] md:text-6xl">MARKALAR</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
            Sitede satışta olan {brands.length} marka.
          </p>
        </div>
      </section>
      <BrandsDirectory />
    </main>
  );
}
