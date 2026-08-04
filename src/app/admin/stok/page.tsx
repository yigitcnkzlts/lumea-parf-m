import type { Metadata } from "next";
import Link from "next/link";
import { ProductsAdmin } from "@/components/admin/products-admin";

export const metadata: Metadata = {
  title: "Admin · Stok",
};

export default function AdminStokPage() {
  return (
    <main className="section-shell !py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">ADMIN</p>
          <h1 className="mt-3 font-serif text-5xl">Ürün & stok</h1>
          <p className="mt-3 text-sm text-neutral-600">
            Yeni parfüm ekleyin (görsel URL, açıklama, notalar, fiyat) veya mevcut ürünü düzenleyin.
          </p>
        </div>
        <Link href="/admin/siparisler" className="border border-black/15 px-4 py-3 text-[10px] tracking-[.16em] transition hover:border-black">
          SİPARİŞLER
        </Link>
      </div>
      <div className="mt-10">
        <ProductsAdmin />
      </div>
    </main>
  );
}
