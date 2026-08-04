import type { Metadata } from "next";
import { ProductsAdmin } from "@/components/admin/products-admin";

export const metadata: Metadata = {
  title: "Ürün & stok",
};

export default function AdminStokPage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÜRÜN</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Ürün & stok</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Yeni parfüm, sürükle-bırak görsel, açıklama, notalar ve CSV stok güncelleme.
      </p>
      <div className="mt-8">
        <ProductsAdmin />
      </div>
    </div>
  );
}
