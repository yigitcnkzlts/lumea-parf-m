import type { Metadata } from "next";
import { StockAdmin } from "@/components/admin/stock-admin";

export const metadata: Metadata = {
  title: "Stok",
};

export default function AdminStokPage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">STOK</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Hızlı stok</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Adet güncelleme ve CSV içe aktarma. Yeni parfüm eklemek için Ürünler menüsüne gidin.
      </p>
      <div className="mt-8">
        <StockAdmin />
      </div>
    </div>
  );
}
