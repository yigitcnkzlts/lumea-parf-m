import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { RequireLogin } from "@/components/checkout/require-login";

export const metadata: Metadata = {
  title: "Ödeme",
  description: "Bee Kozmetik güvenli ödeme.",
};

export default function OdemePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(201,167,117,.16),transparent_40%),linear-gradient(180deg,#faf8f3,#f0ebe1)]" />
      <section className="section-shell relative !py-16 md:!py-20">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖDEME</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Güvenli ödeme</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
          Kart bilgileriniz Bee Kozmetik sunucularından geçmez. Ödeme iyzico Checkout Form ve 3D Secure ile alınır.
          Satın alma için üye girişi zorunludur.
        </p>
        <div className="mt-10">
          <RequireLogin message="Satın alma için giriş yapın veya kayıt olun.">
            <CheckoutForm />
          </RequireLogin>
        </div>
      </section>
    </main>
  );
}
