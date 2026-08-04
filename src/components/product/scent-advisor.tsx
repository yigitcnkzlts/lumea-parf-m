"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useCatalogProducts } from "@/context/catalog-context";
import type { Category, ScentFamily } from "@/types/product";

const occasions = [
  { id: "gunluk", label: "Günlük / ofis" },
  { id: "aksam", label: "Akşam / özel gün" },
  { id: "yaz", label: "Yaz / ferah" },
  { id: "kis", label: "Kış / sıcak" },
] as const;

const moods = [
  { id: "zarif", label: "Zarif", family: "Çiçeksi" as ScentFamily },
  { id: "guclu", label: "Güçlü", family: "Oryantal" as ScentFamily },
  { id: "ferah", label: "Ferah", family: "Meyveli" as ScentFamily },
  { id: "derin", label: "Derin", family: "Odunsu" as ScentFamily },
];

export function ScentAdvisor() {
  const products = useCatalogProducts();
  const [category, setCategory] = useState<Category | "Tümü">("Tümü");
  const [occasion, setOccasion] = useState<(typeof occasions)[number]["id"]>("gunluk");
  const [mood, setMood] = useState<(typeof moods)[number]["id"]>("zarif");

  const recommendations = useMemo(() => {
    const family = moods.find((m) => m.id === mood)?.family ?? "Çiçeksi";
    let list = products.filter((p) => p.stock > 0 && p.scentFamily === family);
    if (category !== "Tümü") list = list.filter((p) => p.category === category);

    if (occasion === "yaz" || occasion === "gunluk") {
      list = [...list].sort((a, b) => a.salePrice - b.salePrice);
    } else {
      list = [...list].sort((a, b) => b.salePrice - a.salePrice);
    }

    if (list.length < 4) {
      const extra = products.filter((p) => p.stock > 0 && !list.some((x) => x.id === p.id));
      list = [...list, ...extra].slice(0, 4);
    } else {
      list = list.slice(0, 4);
    }
    return list;
  }, [products, category, occasion, mood]);

  return (
    <div className="space-y-10">
      <div className="border border-black/10 bg-white/50 p-6 md:p-8">
        <div className="flex items-center gap-2 text-[#956f42]">
          <Sparkles size={16} />
          <p className="text-[10px] tracking-[.28em]">KOKU DANIŞMANI</p>
        </div>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">Size özel öneriler</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Birkaç seçimle Bee koleksiyonundan size uygun parfümleri bulalım. Sonuçlar stoktakilerden gelir.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <fieldset>
            <legend className="text-[10px] tracking-[.18em] text-neutral-500">KATEGORİ</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["Tümü", "Kadın", "Erkek", "Unisex"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`border px-3 py-2 text-xs ${category === item ? "border-black bg-black text-white" : "border-black/15"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[10px] tracking-[.18em] text-neutral-500">KULLANIM</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {occasions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccasion(item.id)}
                  className={`border px-3 py-2 text-xs ${occasion === item.id ? "border-black bg-black text-white" : "border-black/15"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[10px] tracking-[.18em] text-neutral-500">KARAKTER</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {moods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMood(item.id)}
                  className={`border px-3 py-2 text-xs ${mood === item.id ? "border-black bg-black text-white" : "border-black/15"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-serif text-3xl">Önerilenler</h3>
          <Link href="/urunler" className="text-xs tracking-wider underline">
            Tüm ürünler
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
