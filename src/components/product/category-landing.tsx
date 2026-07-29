"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import type { Category } from "@/types/product";

const scentOptions = ["Odunsu", "Çiçeksi", "Oryantal", "Meyveli"] as const;

const content: Record<
  Category,
  {
    title: string;
    brandLabel: string;
    eyebrow: string;
    description: string;
    image: string;
  }
> = {
  Kadın: {
    title: "Kadın Parfümleri",
    brandLabel: "KADIN",
    eyebrow: "BEE · KADIN",
    description: "Çiçeksi, oryantal ve meyveli notalarla karakterinizi tamamlayan seçkin koleksiyon.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2400&q=90",
  },
  Erkek: {
    title: "Erkek Parfümleri",
    brandLabel: "ERKEK",
    eyebrow: "BEE · ERKEK",
    description: "Odunsu, oryantal ve meyveli imzalar. Stilinizi tamamlayan seçkin erkek parfümleri.",
    image: "/images/erkek-hero.jpg",
  },
  Unisex: {
    title: "Unisex Parfümler",
    brandLabel: "UNISEX",
    eyebrow: "BEE · UNISEX",
    description: "Kurallardan bağımsız, modern ve özgün koku kompozisyonları.",
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=2400&q=90",
  },
};

export function CategoryLanding({ category }: { category: Category }) {
  const page = content[category];
  const isMen = category === "Erkek";
  const categoryProducts = products.filter((product) => product.category === category);
  /** Bu kategoride ürünü olan markalar — site marka sırasına göre */
  const categoryBrands = useMemo(() => {
    const withProducts = new Set(categoryProducts.map((product) => product.brand));
    return brands.filter((item) => withProducts.has(item));
  }, [categoryProducts]);

  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("Tümü");
  const [brand, setBrand] = useState("Tümü");
  const [maxPrice, setMaxPrice] = useState(9000);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const result = categoryProducts.filter(
      (product) =>
        `${product.brand} ${product.name}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")) &&
        (family === "Tümü" || product.scentFamily === family) &&
        (brand === "Tümü" || product.brand === brand) &&
        product.salePrice <= maxPrice,
    );
    return [...result].sort((a, b) =>
      sort === "low"
        ? a.salePrice - b.salePrice
        : sort === "high"
          ? b.salePrice - a.salePrice
          : sort === "rating"
            ? b.rating - a.rating
            : Number(b.isBestSeller) - Number(a.isBestSeller),
    );
  }, [categoryProducts, query, family, brand, maxPrice, sort]);

  const resetFilters = () => {
    setQuery("");
    setFamily("Tümü");
    setBrand("Tümü");
    setMaxPrice(9000);
    setSort("featured");
  };

  const filterControls = (
    <>
      <label className="block text-[10px] tracking-[.16em]">
        MARKA
        <select
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="mt-3 w-full border border-black/15 bg-transparent px-3 py-3 text-xs"
        >
          <option>Tümü</option>
          {categoryBrands.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="mt-6 block text-[10px] tracking-[.16em]">
        KOKU AİLESİ
        <select
          value={family}
          onChange={(event) => setFamily(event.target.value)}
          className="mt-3 w-full border border-black/15 bg-transparent px-3 py-3 text-xs"
        >
          <option>Tümü</option>
          {scentOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <div className="mt-6">
        <p className="text-[10px] tracking-[.16em]">SEÇKİN MARKALAR</p>
        <div className="mt-3 flex max-h-64 flex-wrap gap-2 overflow-y-auto">
          <button type="button" onClick={() => setBrand("Tümü")} className={`px-3 py-1.5 text-[10px] tracking-wider ${brand === "Tümü" ? "bg-black text-white" : "border border-black/15"}`}>TÜMÜ</button>
          {categoryBrands.map((item) => (
            <button key={item} type="button" onClick={() => setBrand(item)} className={`px-3 py-1.5 text-[10px] tracking-wider ${brand === item ? "bg-black text-white" : "border border-black/15"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <label className="mt-6 block text-[10px] tracking-[.16em]">
        EN YÜKSEK FİYAT
        <input
          type="range"
          min="3500"
          max="9000"
          step="100"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="mt-4 w-full accent-black"
        />
        <span className="mt-2 block text-xs text-neutral-500">{maxPrice.toLocaleString("tr-TR")} TL</span>
      </label>
      <button type="button" onClick={resetFilters} className="mt-6 text-[10px] underline underline-offset-4">
        FİLTRELERİ TEMİZLE
      </button>
    </>
  );

  return (
    <main>
      {isMen ? (
        <section className="overflow-hidden bg-[#0c0b0a] text-white">
          <div className="mx-auto grid max-w-[1500px] lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col justify-center px-5 py-16 lg:px-8 lg:py-24">
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[#c9a775]" />
                  <p className="text-[10px] tracking-[.34em] text-[#d4b48a]">{page.eyebrow}</p>
                </div>
                <h1 className="mt-6 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-none tracking-[.1em]">
                  ERKEK
                </h1>
                <p className="mt-2 font-serif text-xl font-light tracking-[.06em] text-white/65 md:text-2xl">
                  Parfümleri
                </p>
                <p className="mt-6 max-w-md text-sm leading-8 text-white/55 md:text-[15px]">
                  {page.description}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href="#koleksiyon"
                    className="inline-flex items-center gap-2 bg-[#c9a775] px-7 py-4 text-xs tracking-[.16em] text-black transition hover:bg-white"
                  >
                    KOLEKSİYONU KEŞFET <ArrowDown size={14} />
                  </a>
                  <Link
                    href="/markalar"
                    className="border border-white/25 px-7 py-4 text-xs tracking-[.16em] transition hover:border-white hover:bg-white hover:text-black"
                  >
                    MARKALAR
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] bg-[#0c0b0a] sm:min-h-[420px] lg:min-h-[560px]">
              <Image
                src={page.image}
                alt="Erkek parfümleri"
                fill
                priority
                className="object-contain object-center p-4 sm:p-6 lg:p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="relative min-h-[70vh] overflow-hidden">
          <Image
            src={page.image}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="relative mx-auto flex min-h-[70vh] max-w-[1500px] items-center px-5 py-24 text-white lg:px-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#c9a775]" />
                <p className="text-[10px] tracking-[.34em] text-[#d4b48a]">{page.eyebrow}</p>
              </div>
              <h1 className="mt-6 font-serif text-6xl leading-none tracking-normal md:text-8xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-md text-sm leading-8 text-white/55 md:text-[15px]">
                {page.description}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#koleksiyon"
                  className="inline-flex items-center gap-2 bg-[#c9a775] px-7 py-4 text-xs tracking-[.16em] text-black transition hover:bg-white"
                >
                  KOLEKSİYONU KEŞFET <ArrowDown size={14} />
                </a>
                <Link
                  href="/markalar"
                  className="border border-white/25 px-7 py-4 text-xs tracking-[.16em] transition hover:border-white hover:bg-white hover:text-black"
                >
                  MARKALAR
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {isMen && (
        <section className="border-b border-black/10 bg-[#11100e] text-white">
          <div className="mx-auto grid max-w-[1500px] divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              ["Orijinal ürün", "Güvenilir tedarik, seçkin markalar"],
              ["Yurt içi kargo", "Tekirdağ’dan tüm Türkiye’ye"],
              ["Site siparişi", "Havale / EFT ile güvenli ödeme"],
            ].map(([title, text]) => (
              <div key={title} className="px-6 py-8 lg:px-10">
                <p className="font-serif text-2xl text-[#e0c08a]">{title}</p>
                <p className="mt-2 text-sm text-white/45">{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="koleksiyon" className={`scroll-mt-28 ${isMen ? "bg-[#f7f4ed]" : ""}`}>
        <div className="section-shell">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] tracking-[.28em] text-[#956f42]">SATIŞ</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">
                {isMen ? "Erkek koleksiyonu" : `${page.brandLabel} koleksiyonu`}
              </h2>
              <p className="mt-3 text-sm text-neutral-500">
                {filteredProducts.length} ürün · yalnızca bu kategori
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Tümü", ...scentOptions] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFamily(item)}
                  className={`px-4 py-2 text-[10px] tracking-[.16em] transition ${
                    family === item ? "bg-black text-white" : "border border-black/15 text-neutral-600 hover:border-black"
                  }`}
                >
                  {item.toLocaleUpperCase("tr-TR")}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-3.5 text-neutral-400" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ürün veya marka ara"
                className="w-full border border-black/15 bg-white/60 py-3.5 pl-10 pr-3 text-xs outline-none focus:border-black"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 border border-black/15 bg-white/60 px-4 py-3.5 text-xs lg:hidden"
            >
              <SlidersHorizontal size={16} /> FİLTRELE
            </button>
            <select
              aria-label="Ürünleri sırala"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="border border-black/15 bg-white/60 px-3 py-3.5 text-xs"
            >
              <option value="featured">Önerilen</option>
              <option value="low">Fiyat: Artan</option>
              <option value="high">Fiyat: Azalan</option>
              <option value="rating">En yüksek puan</option>
            </select>
          </div>

          {categoryBrands.length > 0 && (
            <div className="mb-10">
              <p className="mb-4 text-[10px] tracking-[.28em] text-[#956f42]">SEÇKİN MARKALAR</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBrand("Tümü")}
                  className={`px-4 py-2 text-[10px] tracking-[.14em] ${brand === "Tümü" ? "bg-black text-white" : "border border-black/15"}`}
                >
                  TÜMÜ
                </button>
                {categoryBrands.map((item) => {
                  const count = categoryProducts.filter((product) => product.brand === item).length;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBrand(item)}
                      className={`px-4 py-2 text-[10px] tracking-[.14em] ${brand === item ? "bg-black text-white" : "border border-black/15"}`}
                    >
                      {item}
                      <span className={`ml-2 ${brand === item ? "text-white/50" : "text-neutral-400"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-10">
            <aside className="hidden w-64 shrink-0 border-t border-black/10 pt-6 lg:block">{filterControls}</aside>
            {filteredProducts.length ? (
              <div className={`grid min-w-0 flex-1 gap-x-5 gap-y-12 ${isMen ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-3"}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid min-h-80 flex-1 place-content-center text-center">
                <p className="font-serif text-2xl">Eşleşen ürün bulunamadı</p>
                <button type="button" onClick={resetFilters} className="mt-3 text-xs underline">
                  Filtreleri temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40" onMouseDown={() => setFiltersOpen(false)}>
          <aside
            className="ml-auto h-full w-[88%] max-w-sm overflow-y-auto bg-[#faf8f3] p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-serif text-3xl">Filtreler</h2>
              <button type="button" aria-label="Filtreleri kapat" onClick={() => setFiltersOpen(false)}>
                <X />
              </button>
            </div>
            {filterControls}
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn-dark mt-10 w-full">
              {filteredProducts.length} ÜRÜNÜ GÖSTER
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
