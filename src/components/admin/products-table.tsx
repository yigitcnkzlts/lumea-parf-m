"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import {
  type AdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
} from "@/components/admin/product-types";

export function ProductsTable() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetchAdminProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    void load();
  }, []);

  const removeProduct = async (product: AdminProduct) => {
    const ok = window.confirm(
      `"${product.brand} ${product.name}" silinsin mi?\n\nSiparişte geçtiyse tamamen silinmez, sadece satıştan kalkar.`,
    );
    if (!ok) return;
    setBusy(true);
    try {
      const message = await deleteAdminProduct(product);
      toast.success(message);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">
          Tüm parfümler. Yeni eklemek için ayrı sayfa; stok için Stok menüsü.
        </p>
        <Link href="/admin/urunler/yeni" className="btn-dark !min-h-10">
          + YENİ PARFÜM
        </Link>
      </div>

      <div className="overflow-x-auto border border-black/10 bg-white/50">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 text-[10px] tracking-[.18em] text-neutral-500">
            <tr>
              <th className="px-4 py-3">ÜRÜN</th>
              <th className="px-4 py-3">FİYAT</th>
              <th className="px-4 py-3">STOK</th>
              <th className="px-4 py-3">DURUM</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5">
                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-[#eee8dc]">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                          unoptimized={product.images[0].startsWith("http")}
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[.16em] text-neutral-500">{product.brand}</p>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        {product.category} · {product.scent_family}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{formatPrice(Number(product.sale_price))}</td>
                <td className="px-4 py-4">{product.stock}</td>
                <td className="px-4 py-4 text-xs">
                  {product.is_active ? (
                    <span className="text-emerald-700">Satışta</span>
                  ) : (
                    <span className="text-neutral-400">Pasif</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/urunler/${product.id}`}
                      className="border border-black/15 px-3 py-2 text-[10px] tracking-[.14em] hover:border-black"
                    >
                      DÜZENLE
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void removeProduct(product)}
                      className="border border-red-800/30 px-3 py-2 text-[10px] tracking-[.14em] text-red-800 hover:border-red-800"
                    >
                      SİL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-500">
                  Henüz ürün yok.{" "}
                  <Link href="/admin/urunler/yeni" className="underline">
                    İlk parfümü ekle
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
