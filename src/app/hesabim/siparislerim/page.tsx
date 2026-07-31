import type { Metadata } from "next";
import { OrdersList } from "@/components/account/orders-list";

export const metadata: Metadata = {
  title: "Siparişlerim",
};

export default function SiparislerimPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#faf8f3,#f1ebe2)]" />
      <section className="section-shell relative !py-16 md:!py-20">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">HESABIM</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Siparişlerim</h1>
        <p className="mt-4 max-w-xl text-sm text-neutral-600">Ödeme, kargo ve iade durumlarını buradan takip edin.</p>
        <div className="mt-10">
          <OrdersList />
        </div>
      </section>
    </main>
  );
}
