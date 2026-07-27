import type { Metadata } from "next";
import { OrderForm } from "@/components/order/order-form";

export const metadata: Metadata = {
  title: "Sipariş",
  description: "Bee Kozmetik WhatsApp sipariş formu.",
};

export default function OrderPage() {
  return (
    <main className="section-shell">
      <header className="mb-12 max-w-3xl">
        <p className="text-[10px] tracking-[.3em] text-[#956f42]">SİPARİŞ</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">Siparişini tamamla</h1>
        <p className="mt-5 leading-7 text-neutral-600">
          Sepetinizdeki ürünler WhatsApp mesajına dönüştürülür. Tekirdağ’dan yurt içi kargo ile gönderilir.
        </p>
      </header>
      <OrderForm />
    </main>
  );
}
