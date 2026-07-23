import type { Metadata } from "next";
import { SupportHub } from "@/components/support/support-hub";

export const metadata: Metadata = {
  title: "Müşteri Hizmetleri",
  description: "Bee Kozmetik SSS, kargo, iade ve sipariş takibi bilgileri.",
};

export default function CustomerServicePage() {
  return (
    <main>
      <section className="bg-[#141312] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-20 lg:px-8 lg:py-28">
          <p className="text-[10px] tracking-[.3em] text-[#d0ad7b]">YARDIM MERKEZİ</p>
          <h1 className="mt-5 font-serif text-6xl md:text-8xl">Müşteri Hizmetleri</h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            Sipariş, kargo, iade ve sık sorulan sorular. Tekirdağ’dan yurt içi gönderim; sorularınızı doğrudan yanıtlarız.
          </p>
        </div>
      </section>
      <SupportHub />
    </main>
  );
}
