"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brands } from "@/data/brands";
import { products } from "@/data/products";

function brandLetter(brand: string) {
  return brand.charAt(0).normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();
}

const letters = Array.from(new Set(brands.map(brandLetter))).sort();

export function BrandsDirectory() {
  return (
    <>
      <nav aria-label="Marka harfleri" className="sticky top-[108px] z-20 border-y border-black/10 bg-[#faf8f3]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-5 py-3 lg:justify-center lg:px-8">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="grid h-9 w-9 shrink-0 place-content-center text-xs tracking-widest text-neutral-500 transition hover:bg-black hover:text-white"
            >
              {letter}
            </a>
          ))}
        </div>
      </nav>

      <section className="section-shell pt-10 md:pt-14">
        <div className="mb-12 flex flex-col gap-4 border-b border-black/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">A’DAN Z’YE</p>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl">Markalarımız</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-neutral-500">
            {brands.length} seçkin parfüm evi. Bir markaya tıklayarak koleksiyonunu keşfedin.
          </p>
        </div>

        <div className="space-y-16">
          {letters.map((letter) => {
            const group = brands.filter((brand) => brandLetter(brand) === letter);
            return (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-40">
                <div className="mb-6 flex items-baseline gap-4 border-b border-black/10 pb-3">
                  <span className="font-serif text-5xl text-[#9c7749] md:text-6xl">{letter}</span>
                  <span className="text-[10px] tracking-[.2em] text-neutral-400">{group.length} MARKA</span>
                </div>
                <ul>
                  {group.map((brand) => {
                    const count = products.filter((product) => product.brand === brand).length;
                    return (
                      <li key={brand}>
                        <Link
                          href={`/urunler?brand=${encodeURIComponent(brand)}`}
                          className="group flex items-center justify-between gap-6 border-b border-black/8 py-7 transition hover:pl-2"
                        >
                          <div>
                            <h3 className="font-serif text-3xl tracking-wide transition group-hover:text-[#8a6438] md:text-4xl lg:text-5xl">
                              {brand}
                            </h3>
                            <p className="mt-2 text-[10px] tracking-[.18em] text-neutral-500">
                              {count ? `${count} ÜRÜN` : "YAKINDA"}
                            </p>
                          </div>
                          <span className="flex h-11 w-11 items-center justify-center border border-black/15 text-[#9c7749] transition group-hover:border-[#9c7749] group-hover:bg-[#9c7749] group-hover:text-white">
                            <ArrowUpRight size={18} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
