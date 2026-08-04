import type { Metadata } from "next";
import { ProductsTable } from "@/components/admin/products-table";

export const metadata: Metadata = {
  title: "Ürünler",
};

export default function AdminProductsPage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÜRÜNLER</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Parfüm kataloğu</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Liste, düzenleme ve silme. Yeni ürün için ayrı sayfa kullanın.
      </p>
      <div className="mt-8">
        <ProductsTable />
      </div>
    </div>
  );
}
