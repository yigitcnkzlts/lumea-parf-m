import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Yeni parfüm",
};

export default function AdminNewProductPage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">YENİ ÜRÜN</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Yeni parfüm ekle</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        Görsel, açıklama, kadın/erkek/unisex kategori, notalar, fiyat ve başlangıç stoğu.
      </p>
      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
