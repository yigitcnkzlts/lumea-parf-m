"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { brands } from "@/data/brands";
import { products } from "@/data/products";

function brandLetter(brand: string) {
  return brand.charAt(0).normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();
}

const letters = Array.from(new Set(brands.map(brandLetter))).sort();

export function BrandsDirectory() {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return brands.filter((brand) => {
      const matchQuery = !q || brand.toLocaleLowerCase("tr-TR").includes(q);
      const matchLetter = activeLetter === "ALL" || brandLetter(brand) === activeLetter;
      return matchQuery && matchLetter;
    });
  }, [query, activeLetter]);

  return (
    <section className="section-shell pt-12 md:pt-16">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">KOLEKSİYON</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{brands.length} marka</h2>
        </div>
        <label className="relative w-full max-w-sm">
          <span className="sr-only">Marka ara</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Marka ara…"
            className="w-full border border-black/15 bg-transparent py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black"
          />
        </label>
      </div>

      <nav aria-label="Marka harfleri" className="mt-6 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveLetter("ALL")}
          className={`px-3 py-2 text-[10px] tracking-[.18em] transition ${
            activeLetter === "ALL" ? "bg-black text-white" : "text-neutral-500 hover:bg-black/5"
          }`}
        >
          TÜMÜ
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => setActiveLetter(letter)}
            className={`grid h-9 w-9 place-content-center text-xs tracking-widest transition ${
              activeLetter === letter ? "bg-black text-white" : "text-neutral-500 hover:bg-black/5"
            }`}
          >
            {letter}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-neutral-500">Eşleşen marka yok.</p>
      ) : (
        <ul className="mt-10 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((brand) => {
            const count = products.filter((product) => product.brand === brand).length;
            return (
              <li key={brand}>
                <Link
                  href={`/urunler?brand=${encodeURIComponent(brand)}`}
                  className="group flex h-full min-h-[8.5rem] flex-col justify-between bg-[#faf8f3] px-6 py-7 transition duration-400 hover:bg-[#141312] hover:text-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-[1.35rem] leading-tight tracking-[.04em] md:text-2xl">
                      {brand}
                    </h3>
                    <ArrowUpRight
                      className="mt-1 shrink-0 text-[#9c7749] transition group-hover:text-[#d0ad7b]"
                      size={16}
                    />
                  </div>
                  <p className="mt-8 text-[10px] tracking-[.2em] text-neutral-500 transition group-hover:text-white/40">
                    {count} ÜRÜN
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
