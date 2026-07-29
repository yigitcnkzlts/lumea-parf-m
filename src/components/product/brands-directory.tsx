"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { brands } from "@/data/brands";
import { products } from "@/data/products";

function brandLetter(brand: string) {
  return brand.charAt(0).normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();
}

const allLetters = Array.from(new Set(brands.map(brandLetter))).sort();

const featured = ["CHANEL", "DIOR", "TOM FORD", "GUCCI", "YVES SAINT LAURENT", "PRADA"].filter((name) =>
  (brands as readonly string[]).includes(name),
);

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

  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const brand of filtered) {
      const letter = brandLetter(brand);
      const list = map.get(letter) ?? [];
      list.push(brand);
      map.set(letter, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <>
      {!query && activeLetter === "ALL" && (
        <section className="border-b border-black/10 bg-[#f3efe6]">
          <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8 lg:py-20">
            <p className="text-[10px] tracking-[.3em] text-[#956f42]">ÖNE ÇIKANLAR</p>
            <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((brand, index) => {
                const count = products.filter((product) => product.brand === brand).length;
                return (
                  <Link
                    key={brand}
                    href={`/urunler?brand=${encodeURIComponent(brand)}`}
                    className="group relative overflow-hidden bg-[#faf8f3] px-7 py-12 transition duration-500 hover:bg-[#141312] hover:text-white"
                  >
                    <span className="text-[10px] tracking-[.28em] text-[#956f42] transition group-hover:text-[#d0ad7b]">
                      0{index + 1}
                    </span>
                    <h2 className="mt-6 font-serif text-3xl leading-none tracking-[.04em] md:text-4xl lg:text-[2.75rem]">
                      {brand}
                    </h2>
                    <p className="mt-4 text-[10px] tracking-[.2em] text-neutral-500 transition group-hover:text-white/45">
                      {count ? `${count} ÜRÜN` : "KOLEKSİYON"}
                    </p>
                    <ArrowUpRight
                      className="absolute right-6 top-6 text-[#9c7749] transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#d0ad7b]"
                      size={20}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-shell pt-12 md:pt-16">
        <div className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">DİZİN</p>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl">Tüm markalar</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
              {filtered.length} marka listeleniyor. Markaya tıklayınca ürünleri açılır.
            </p>
          </div>

          <label className="relative w-full max-w-md">
            <span className="sr-only">Marka ara</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Marka ara…"
              className="w-full border border-black/15 bg-transparent py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-black"
            />
          </label>
        </div>

        <nav aria-label="Marka harfleri" className="mt-8 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveLetter("ALL")}
            className={`px-3 py-2 text-[10px] tracking-[.18em] transition ${
              activeLetter === "ALL" ? "bg-black text-white" : "text-neutral-500 hover:bg-black/5"
            }`}
          >
            TÜMÜ
          </button>
          {allLetters.map((letter) => (
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

        {groups.length === 0 ? (
          <p className="py-24 text-center text-sm text-neutral-500">Aramanızla eşleşen marka yok.</p>
        ) : (
          <div className="mt-14 space-y-16">
            {groups.map(([letter, group]) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-36">
                <div className="mb-8 flex items-end gap-5">
                  <span className="font-serif text-6xl leading-none text-[#9c7749] md:text-7xl">{letter}</span>
                  <span className="mb-2 h-px flex-1 bg-black/10" />
                  <span className="mb-2 text-[10px] tracking-[.22em] text-neutral-400">{group.length}</span>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.map((brand) => {
                    const count = products.filter((product) => product.brand === brand).length;
                    return (
                      <li key={brand}>
                        <Link
                          href={`/urunler?brand=${encodeURIComponent(brand)}`}
                          className="group flex h-full min-h-[7.5rem] items-end justify-between gap-4 border border-black/10 bg-white/40 px-6 py-6 transition duration-500 hover:-translate-y-0.5 hover:border-[#c9a775] hover:bg-[#141312] hover:text-white"
                        >
                          <div>
                            <h3 className="font-serif text-2xl leading-tight tracking-[.03em] md:text-[1.65rem]">
                              {brand}
                            </h3>
                            <p className="mt-3 text-[10px] tracking-[.2em] text-neutral-500 transition group-hover:text-white/40">
                              {count ? `${count} ÜRÜN` : "YAKINDA"}
                            </p>
                          </div>
                          <ArrowUpRight
                            className="mb-1 shrink-0 text-[#9c7749] transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d0ad7b]"
                            size={18}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
