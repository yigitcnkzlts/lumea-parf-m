import type { Metadata } from "next";
import Link from "next/link";
import { OrdersAdmin } from "@/components/admin/orders-admin";

export const metadata: Metadata = {
  title: "Admin · Siparişler",
};

export default function AdminSiparislerPage() {
  return (
    <main className="section-shell !py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">ADMIN</p>
          <h1 className="mt-3 font-serif text-5xl">Siparişler</h1>
          <p className="mt-3 text-sm text-neutral-600">Kart verisi burada asla görünmez; yalnızca sipariş ve kargo bilgileri.</p>
        </div>
        <Link href="/admin" className="border border-black/15 px-4 py-3 text-[10px] tracking-[.16em] transition hover:border-black">
          ADMIN PANEL
        </Link>
        <Link href="/admin/stok" className="border border-black/15 px-4 py-3 text-[10px] tracking-[.16em] transition hover:border-black">
          STOK YÖNETİMİ
        </Link>
        <Link href="/admin/bildirimler" className="border border-black/15 px-4 py-3 text-[10px] tracking-[.16em] transition hover:border-black">
          BİLDİRİMLER
        </Link>
      </div>
      <div className="mt-10">
        <OrdersAdmin />
      </div>
    </main>
  );
}
