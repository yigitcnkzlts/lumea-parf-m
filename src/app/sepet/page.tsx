import type { Metadata } from "next";
import { CartPageClient } from "@/components/checkout/cart-page";

export const metadata: Metadata = {
  title: "Sepet",
  description: "Bee Kozmetik sepetiniz.",
};

export default function SepetPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(201,167,117,.18),transparent_45%),linear-gradient(180deg,#faf8f3,#f3efe6)]" />
      <section className="section-shell relative !py-16 md:!py-20">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">SEPET</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Sepetiniz</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-600">
          Ürünlerinizi gözden geçirin. Ödeme adımında tutar sunucu tarafında doğrulanır.
        </p>
        <div className="mt-10">
          <CartPageClient />
        </div>
      </section>
    </main>
  );
}
