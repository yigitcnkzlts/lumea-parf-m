"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/products";
import type { Category } from "@/types/product";

const content: Record<Category, { title: string; eyebrow: string; description: string; image: string }> = {
  Kadın: {
    title: "Kadın Parfümleri",
    eyebrow: "ZARAFETİN KOKUSU",
    description: "Işıltılı çiçeklerden sıcak oryantal notalara, karakterinizi tamamlayan seçkin kadın parfümlerini keşfedin.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2000&q=90",
  },
  Erkek: {
    title: "Erkek Parfümleri",
    eyebrow: "GÜÇLÜ BİR İMZA",
    description: "Ferah, odunsu ve baharatlı notalarla stilinize karakter katan seçkin erkek parfümleri.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=2000&q=90",
  },
  Unisex: {
    title: "Unisex Parfümler",
    eyebrow: "SINIRLARIN ÖTESİNDE",
    description: "Kurallardan bağımsız, özgün ve modern koku kompozisyonlarıyla kendinizi ifade edin.",
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=2000&q=90",
  },
};

export function CategoryLanding({ category }: { category: Category }) {
  const page = content[category];
  const categoryProducts = products.filter((product) => product.category === category);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("Tümü");
  const [maxPrice, setMaxPrice] = useState(9000);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const families = Array.from(new Set(categoryProducts.map((product) => product.scentFamily)));
  const filteredProducts = useMemo(() => {
    const result = categoryProducts.filter((product) =>
      `${product.brand} ${product.name}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")) &&
      (family === "Tümü" || product.scentFamily === family) &&
      product.salePrice <= maxPrice,
    );
    return [...result].sort((a, b) =>
      sort === "low" ? a.salePrice - b.salePrice :
      sort === "high" ? b.salePrice - a.salePrice :
      sort === "rating" ? b.rating - a.rating :
      Number(b.isBestSeller) - Number(a.isBestSeller),
    );
  }, [categoryProducts, query, family, maxPrice, sort]);

  const resetFilters = () => {
    setQuery("");
    setFamily("Tümü");
    setMaxPrice(9000);
    setSort("featured");
  };

  const filterControls = (
    <>
      <label className="block text-[10px] tracking-[.16em]">
        KOKU AİLESİ
        <select value={family} onChange={(event) => setFamily(event.target.value)} className="mt-3 w-full border border-black/15 bg-transparent px-3 py-3 text-xs">
          <option>Tümü</option>
          {families.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="mt-6 block text-[10px] tracking-[.16em]">
        EN YÜKSEK FİYAT
        <input type="range" min="3500" max="9000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-4 w-full accent-black" />
        <span className="mt-2 block text-xs text-neutral-500">{maxPrice.toLocaleString("tr-TR")} TL</span>
      </label>
      <button onClick={resetFilters} className="mt-6 text-[10px] underline underline-offset-4">FİLTRELERİ TEMİZLE</button>
    </>
  );

  return (
    <main>
      <section className="relative min-h-[520px] overflow-hidden">
        <Image src={page.image} alt={page.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[520px] max-w-[1500px] items-center px-5 text-white lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[.3em] text-[#e1bd88]">{page.eyebrow}</p>
            <h1 className="mt-4 font-serif text-6xl leading-none md:text-8xl">{page.title}</h1>
            <p className="mt-6 max-w-xl leading-7 text-white/70">{page.description}</p>
          </div>
        </div>
      </section>
      <section className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-black/10 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] tracking-[.25em] text-[#956f42]">LUMÉA SEÇKİSİ</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">{category} Koleksiyonu</h2>
          </div>
          <p className="text-xs text-neutral-500">{filteredProducts.length} ürün gösteriliyor</p>
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-3" size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün veya marka ara" className="w-full border border-black/15 bg-transparent py-3 pl-10 pr-3 text-xs outline-none focus:border-black" />
          </div>
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 border border-black/15 px-4 py-3 text-xs lg:hidden"><SlidersHorizontal size={16} /> FİLTRELE</button>
          <select aria-label="Ürünleri sırala" value={sort} onChange={(event) => setSort(event.target.value)} className="border border-black/15 bg-transparent px-3 py-3 text-xs">
            <option value="featured">Önerilen sıralama</option>
            <option value="low">Fiyat: Artan</option>
            <option value="high">Fiyat: Azalan</option>
            <option value="rating">En yüksek puan</option>
          </select>
        </div>
        <div className="flex gap-10">
          <aside className="hidden w-56 shrink-0 border-t border-black/10 pt-6 lg:block">{filterControls}</aside>
          {filteredProducts.length ? (
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="grid min-h-80 flex-1 place-content-center text-center">
              <p className="font-serif text-2xl">Eşleşen ürün bulunamadı</p>
              <button onClick={resetFilters} className="mt-3 text-xs underline">Filtreleri temizle</button>
            </div>
          )}
        </div>
        {filtersOpen && (
          <div className="fixed inset-0 z-[70] bg-black/40" onMouseDown={() => setFiltersOpen(false)}>
            <aside className="ml-auto h-full w-[88%] max-w-sm bg-[#faf8f3] p-7" onMouseDown={(event) => event.stopPropagation()}>
              <div className="mb-10 flex items-center justify-between"><h2 className="font-serif text-3xl">Filtreler</h2><button aria-label="Filtreleri kapat" onClick={() => setFiltersOpen(false)}><X /></button></div>
              {filterControls}
              <button onClick={() => setFiltersOpen(false)} className="btn-dark mt-10 w-full">{filteredProducts.length} ÜRÜNÜ GÖSTER</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
