"use client";

import { useMemo, useState } from "react";
import { Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/products";

type InitialFilters = { category?: string; brand?: string; family?: string };

export function ProductsView({ initial }: { initial: InitialFilters }) {
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState<string[]>(initial.brand ? [initial.brand] : []);
  const [categories, setCategories] = useState<string[]>(initial.category ? [initial.category] : []);
  const [families, setFamilies] = useState<string[]>(initial.family ? [initial.family] : []);
  const [maxPrice, setMaxPrice] = useState(9000);
  const [discounted, setDiscounted] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [grid, setGrid] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (value: string, values: string[], setter: (next: string[]) => void) =>
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const clear = () => { setQuery(""); setBrands([]); setCategories([]); setFamilies([]); setMaxPrice(9000); setDiscounted(false); setInStock(false); };

  const filtered = useMemo(() => {
    const result = products.filter((product) =>
      `${product.brand} ${product.name}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")) &&
      (!brands.length || brands.includes(product.brand)) &&
      (!categories.length || categories.includes(product.category)) &&
      (!families.length || families.includes(product.scentFamily)) &&
      product.salePrice <= maxPrice && (!discounted || product.salePrice < product.price) && (!inStock || product.stock > 0),
    );
    return [...result].sort((a, b) => sort === "low" ? a.salePrice - b.salePrice : sort === "high" ? b.salePrice - a.salePrice : sort === "rating" ? b.rating - a.rating : Number(b.isBestSeller) - Number(a.isBestSeller));
  }, [query, brands, categories, families, maxPrice, discounted, inStock, sort]);

  const filters = <FilterPanel {...{ brands, categories, families, maxPrice, discounted, inStock, toggle, setBrands, setCategories, setFamilies, setMaxPrice, setDiscounted, setInStock, clear }} />;

  return (
    <main className="mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-12 text-center"><p className="text-[10px] tracking-[.3em] text-[#936d40]">BEE KOLEKSİYONU</p><h1 className="mt-3 font-serif text-5xl md:text-7xl">Tüm Parfümler</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500">Sizi anlatan kokuyu seçkin parfüm koleksiyonumuzda keşfedin.</p></div>
      <div className="flex gap-10">
        <aside className="hidden w-60 shrink-0 lg:block">{filters}</aside>
        <div className="min-w-0 flex-1">
          <div className="mb-7 flex flex-wrap items-center gap-3 border-y border-black/10 py-4">
            <button className="flex items-center gap-2 border border-black/15 px-4 py-2 text-xs lg:hidden" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={15} /> FİLTRELE</button>
            <div className="relative min-w-52 flex-1 md:max-w-xs"><Search className="absolute left-3 top-2.5" size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürünlerde ara" className="w-full border border-black/15 bg-transparent py-2 pl-9 pr-3 text-xs outline-none focus:border-black" /></div>
            <p className="ml-auto text-xs text-neutral-500">{filtered.length} ürün</p>
            <select aria-label="Sıralama" value={sort} onChange={(e) => setSort(e.target.value)} className="border border-black/15 bg-transparent px-3 py-2 text-xs"><option value="featured">Önerilen sıralama</option><option value="low">Fiyat: Artan</option><option value="high">Fiyat: Azalan</option><option value="rating">En yüksek puan</option></select>
            <div className="hidden gap-1 sm:flex"><button aria-label="Grid görünümü" onClick={() => setGrid(true)} className={grid ? "text-black" : "text-neutral-400"}><Grid2X2 size={18} /></button><button aria-label="Liste görünümü" onClick={() => setGrid(false)} className={!grid ? "text-black" : "text-neutral-400"}><List size={20} /></button></div>
          </div>
          {filtered.length ? <div className={grid ? "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3" : "grid gap-8 sm:grid-cols-2"}>{filtered.map((product) => <ProductCard key={product.id} product={product} compact={!grid} />)}</div> : <div className="grid min-h-80 place-content-center text-center"><p className="font-serif text-2xl">Sonuç bulunamadı</p><button onClick={clear} className="mt-3 text-xs underline">Filtreleri temizle</button></div>}
        </div>
      </div>
      {filtersOpen && <div className="fixed inset-0 z-[70] bg-black/40" onMouseDown={() => setFiltersOpen(false)}><aside className="ml-auto h-full w-[88%] max-w-sm overflow-y-auto bg-[#faf8f3] p-6" onMouseDown={(e) => e.stopPropagation()}><div className="mb-8 flex justify-between"><b>Filtreler</b><button aria-label="Filtreleri kapat" onClick={() => setFiltersOpen(false)}><X /></button></div>{filters}<button onClick={() => setFiltersOpen(false)} className="mt-8 w-full bg-black py-4 text-xs text-white">{filtered.length} ÜRÜNÜ GÖSTER</button></aside></div>}
    </main>
  );
}

interface FilterProps extends InitialFilters {
  brands: string[]; categories: string[]; families: string[]; maxPrice: number; discounted: boolean; inStock: boolean;
  toggle: (value: string, values: string[], setter: (next: string[]) => void) => void;
  setBrands: (v: string[]) => void; setCategories: (v: string[]) => void; setFamilies: (v: string[]) => void;
  setMaxPrice: (v: number) => void; setDiscounted: (v: boolean) => void; setInStock: (v: boolean) => void; clear: () => void;
}
function FilterPanel(props: FilterProps) {
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));
  const checks = (title: string, options: string[], values: string[], setter: (v: string[]) => void) => <fieldset className="border-b border-black/10 py-5"><legend className="mb-4 text-[10px] tracking-[.18em]">{title}</legend><div className="space-y-3">{options.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 text-xs text-neutral-600"><input type="checkbox" checked={values.includes(option)} onChange={() => props.toggle(option, values, setter)} className="accent-black" />{option}</label>)}</div></fieldset>;
  return <div><div className="flex items-center justify-between border-b border-black/10 pb-4"><b className="text-sm">Filtreler</b><button onClick={props.clear} className="text-[10px] underline">TEMİZLE</button></div>{checks("KATEGORİ", ["Kadın", "Erkek", "Unisex"], props.categories, props.setCategories)}{checks("MARKA", uniqueBrands, props.brands, props.setBrands)}{checks("KOKU AİLESİ", ["Odunsu", "Çiçeksi", "Oryantal", "Meyveli"], props.families, props.setFamilies)}<fieldset className="border-b border-black/10 py-5"><legend className="mb-4 text-[10px] tracking-[.18em]">FİYAT ARALIĞI</legend><input type="range" min="3500" max="9000" step="100" value={props.maxPrice} onChange={(e) => props.setMaxPrice(Number(e.target.value))} className="w-full accent-black" /><p className="mt-2 text-xs text-neutral-500">En fazla {props.maxPrice.toLocaleString("tr-TR")} TL</p></fieldset><div className="space-y-3 py-5"><label className="flex gap-3 text-xs"><input type="checkbox" checked={props.discounted} onChange={(e) => props.setDiscounted(e.target.checked)} /> İndirimli ürünler</label><label className="flex gap-3 text-xs"><input type="checkbox" checked={props.inStock} onChange={(e) => props.setInStock(e.target.checked)} /> Yalnızca stoktakiler</label></div></div>;
}
