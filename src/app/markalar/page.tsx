import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Markalar",
  description: "Bee Parfüm'de dünyanın seçkin parfüm markalarını keşfedin.",
};

const brands = ["CHANEL", "DIOR", "YVES SAINT LAURENT", "GIORGIO ARMANI", "TOM FORD", "GUCCI", "BURBERRY", "GIVENCHY", "LANCÔME", "PRADA", "CALVIN KLEIN"];

export default function BrandsPage() {
  return (
    <main>
      <section className="relative min-h-[430px] overflow-hidden bg-[#171715] text-white">
        <Image src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=2000&q=85" alt="" fill priority className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[430px] max-w-[1500px] items-center px-5 lg:px-8">
          <div><p className="text-[10px] tracking-[.3em] text-[#d0ad7b]">PARFÜM EVLERİ</p><h1 className="mt-4 font-serif text-6xl md:text-8xl">Seçkin Markalar</h1><p className="mt-5 max-w-xl leading-7 text-white/65">Efsanevi moda evlerinden çağdaş koku ustalarına, dünyanın en özel parfüm markaları.</p></div>
        </div>
      </section>
      <section className="section-shell">
        <div className="mb-12 text-center"><p className="text-[10px] tracking-[.28em] text-[#956f42]">A’DAN Z’YE</p><h2 className="mt-3 font-serif text-4xl md:text-6xl">Markalarımız</h2></div>
        <div className="grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            const count = products.filter((product) => product.brand === brand).length;
            return (
              <Link key={brand} href={`/urunler?brand=${encodeURIComponent(brand)}`} className="group flex min-h-40 items-center justify-between border-b border-r border-black/10 bg-white/30 p-7 hover:bg-white">
                <div><h2 className="font-serif text-2xl md:text-3xl">{brand}</h2><p className="mt-2 text-[10px] tracking-widest text-neutral-500">{count || "YENİ"} ÜRÜN</p></div>
                <ArrowUpRight className="text-[#9c7749] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
