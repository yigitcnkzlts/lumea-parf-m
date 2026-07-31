import type { Metadata } from "next";
import { OrdersAdmin } from "@/components/admin/orders-admin";

export const metadata: Metadata = {
  title: "Admin · Siparişler",
};

export default function AdminSiparislerPage() {
  return (
    <main className="section-shell !py-16">
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">ADMIN</p>
      <h1 className="mt-3 font-serif text-5xl">Siparişler</h1>
      <p className="mt-3 text-sm text-neutral-600">Kart verisi burada asla görünmez; yalnızca sipariş ve kargo bilgileri.</p>
      <div className="mt-10">
        <OrdersAdmin />
      </div>
    </main>
  );
}
