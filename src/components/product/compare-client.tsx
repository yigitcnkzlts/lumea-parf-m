"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCatalogProducts } from "@/context/catalog-context";
import { formatPrice } from "@/data/products";
import { getCompareIds, toggleCompare } from "@/lib/client-prefs";

export function CompareClient() {
  const products = useCatalogProducts();
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(getCompareIds());
  }, []);

  const selected = products.filter((p) => ids.includes(p.id));

  if (!selected.length) {
    return (
      <div className="border border-black/10 bg-white/50 px-8 py-16 text-center">
        <p className="font-serif text-3xl">Karşılaştırma listesi boş</p>
        <p className="mt-3 text-sm text-neutral-600">Ürün sayfasından en fazla 3 ürün ekleyin.</p>
        <Link href="/urunler" className="btn-dark mt-8 inline-flex">
          ÜRÜNLERE GİT
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-black/10 bg-white/50 text-sm">
        <thead>
          <tr className="border-b border-black/10">
            <th className="px-4 py-4 text-left text-[10px] tracking-[.18em] text-neutral-500">ÖZELLİK</th>
            {selected.map((p) => (
              <th key={p.id} className="min-w-[180px] px-4 py-4 text-left">
                <div className="relative mb-3 h-40 w-full overflow-hidden bg-[#eee8dc]">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="180px" />
                </div>
                <p className="text-[10px] tracking-[.16em] text-neutral-500">{p.brand}</p>
                <Link href={`/urunler/${p.slug}`} className="font-serif text-xl">
                  {p.name}
                </Link>
                <button
                  type="button"
                  className="mt-2 block text-[10px] underline"
                  onClick={() => setIds(toggleCompare(p.id))}
                >
                  Kaldır
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Fiyat", (p: (typeof selected)[0]) => formatPrice(p.salePrice)],
            ["Kategori", (p: (typeof selected)[0]) => p.category],
            ["Koku ailesi", (p: (typeof selected)[0]) => p.scentFamily],
            ["Üst notalar", (p: (typeof selected)[0]) => p.topNotes.join(", ")],
            ["Orta notalar", (p: (typeof selected)[0]) => p.heartNotes.join(", ")],
            ["Alt notalar", (p: (typeof selected)[0]) => p.baseNotes.join(", ")],
            ["Stok", (p: (typeof selected)[0]) => (p.stock > 0 ? `${p.stock} adet` : "Tükendi")],
          ].map(([label, getter]) => (
            <tr key={label as string} className="border-b border-black/5">
              <td className="px-4 py-3 text-[10px] tracking-[.16em] text-neutral-500">{label as string}</td>
              {selected.map((p) => (
                <td key={p.id} className="px-4 py-3">
                  {(getter as (p: (typeof selected)[0]) => string)(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
