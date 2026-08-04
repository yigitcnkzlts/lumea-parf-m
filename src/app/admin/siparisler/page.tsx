import type { Metadata } from "next";
import { OrdersAdmin } from "@/components/admin/orders-admin";

export const metadata: Metadata = {
  title: "Siparişler",
};

export default function AdminSiparislerPage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">SİPARİŞLER</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Siparişler</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Kart verisi burada görünmez. Kargo firması ve takip numarasını sipariş detayından gir.
      </p>
      <div className="mt-8">
        <OrdersAdmin />
      </div>
    </div>
  );
}
