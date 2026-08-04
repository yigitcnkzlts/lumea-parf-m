"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type AdminProduct, fetchAdminProducts } from "@/components/admin/product-types";

export function StockAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    fetchAdminProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    void load();
  }, []);

  const quickStock = async (productId: number, stock: number) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Stok kaydı başarısız");
      setProducts((current) => current.map((p) => (p.id === productId ? { ...p, stock } : p)));
      toast.success("Stok güncellendi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    }
  };

  if (error) {
    return (
      <div className="border border-black/10 bg-white/60 p-8">
        <p className="font-serif text-3xl">Admin erişimi</p>
        <p className="mt-3 text-sm text-neutral-600">{error}</p>
      </div>
    );
  }

  const lowStock = products.filter((p) => p.is_active && p.stock < 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">
          Hızlı stok güncelleme ve CSV içe aktarma. Ürün ekleme/düzenleme için{" "}
          <Link href="/admin/urunler" className="underline">
            Ürünler
          </Link>
          .
        </p>
        <label className="cursor-pointer border border-black/15 px-4 py-3 text-[10px] tracking-[.14em] hover:border-black">
          CSV STOK İÇE AKTAR
          <input
            type="file"
            accept=".csv,text/csv,text/plain"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const res = await fetch("/api/admin/products/import", {
                  method: "POST",
                  headers: { "Content-Type": "text/csv" },
                  body: text,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                toast.success(`${data.updated}/${data.total} stok güncellendi`);
                await load();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Import hatası");
              }
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <p className="text-[11px] text-neutral-500">
        CSV formatı: her satır <code>id,stock</code> (örn. <code>12,40</code>). İlk satır başlık olabilir.
        {lowStock.length > 0 ? ` · Düşük stok: ${lowStock.length} ürün` : null}
      </p>

      <div className="overflow-x-auto border border-black/10 bg-white/50">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 text-[10px] tracking-[.18em] text-neutral-500">
            <tr>
              <th className="px-4 py-3">ÜRÜN</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">STOK</th>
              <th className="px-4 py-3">DURUM</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5">
                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <div className="relative h-12 w-9 shrink-0 overflow-hidden bg-[#eee8dc]">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="36px"
                          unoptimized={product.images[0].startsWith("http")}
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[.16em] text-neutral-500">{product.brand}</p>
                      <p className="font-medium">{product.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-neutral-500">{product.id}</td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min={0}
                    defaultValue={product.stock}
                    key={`${product.id}-${product.stock}`}
                    onBlur={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isFinite(next) && next !== product.stock) void quickStock(product.id, next);
                    }}
                    className={`w-24 border px-3 py-2 text-sm ${
                      product.is_active && product.stock < 5 ? "border-amber-600/50 bg-amber-50" : "border-black/15"
                    }`}
                  />
                </td>
                <td className="px-4 py-4 text-xs">
                  {product.is_active ? (
                    product.stock < 5 ? (
                      <span className="text-amber-700">Düşük stok</span>
                    ) : (
                      <span className="text-emerald-700">Satışta</span>
                    )
                  ) : (
                    <span className="text-neutral-400">Pasif</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
