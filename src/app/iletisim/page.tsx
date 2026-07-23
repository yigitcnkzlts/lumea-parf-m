import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Luméa Parfüm müşteri hizmetleriyle iletişime geçin.",
};

export default function ContactPage() {
  return (
    <main className="section-shell">
      <header className="mb-14 max-w-3xl">
        <p className="text-[10px] tracking-[.3em] text-[#956f42]">BİZE ULAŞIN</p>
        <h1 className="mt-4 font-serif text-6xl md:text-8xl">İletişim</h1>
        <p className="mt-5 max-w-xl leading-7 text-neutral-600">Koku danışmanlığı, siparişleriniz veya merak ettiğiniz her konu için yanınızdayız.</p>
      </header>
      <div className="grid overflow-hidden border border-black/10 bg-white lg:grid-cols-[.8fr_1.2fr]">
        <aside className="bg-[#191918] p-8 text-white md:p-12">
          <h2 className="font-serif text-4xl">Luméa’ya Ulaşın</h2>
          <p className="mt-4 text-sm leading-7 text-white/55">Uzman ekibimiz hafta içi ve cumartesi günü tüm sorularınızı yanıtlamaktan memnuniyet duyar.</p>
          <div className="mt-10 space-y-7">
            <div className="flex gap-4"><MapPin className="shrink-0 text-[#c7a675]" strokeWidth={1.3} /><div><b className="text-xs tracking-widest">MAĞAZA</b><p className="mt-2 text-sm text-white/60">Teşvikiye Cd. No: 42<br />Nişantaşı, İstanbul</p></div></div>
            <div className="flex gap-4"><Phone className="shrink-0 text-[#c7a675]" strokeWidth={1.3} /><div><b className="text-xs tracking-widest">TELEFON</b><p className="mt-2 text-sm text-white/60">0850 450 58 63</p></div></div>
            <div className="flex gap-4"><Mail className="shrink-0 text-[#c7a675]" strokeWidth={1.3} /><div><b className="text-xs tracking-widest">E-POSTA</b><p className="mt-2 text-sm text-white/60">merhaba@lumeaparfum.com</p></div></div>
            <div className="flex gap-4"><Clock className="shrink-0 text-[#c7a675]" strokeWidth={1.3} /><div><b className="text-xs tracking-widest">ÇALIŞMA SAATLERİ</b><p className="mt-2 text-sm text-white/60">Pzt–Cmt · 09.00–19.00</p></div></div>
          </div>
        </aside>
        <section className="p-8 md:p-12 lg:p-16">
          <p className="text-[10px] tracking-[.25em] text-[#956f42]">MESAJ GÖNDERİN</p>
          <h2 className="mt-3 font-serif text-4xl">Size nasıl yardımcı olabiliriz?</h2>
          <div className="mt-9"><ContactForm /></div>
        </section>
      </div>
    </main>
  );
}
