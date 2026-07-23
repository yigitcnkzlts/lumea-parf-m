"use client";

import { FormEvent, useMemo, useState } from "react";
import { ChevronDown, Mail, MessageCircle } from "lucide-react";

const tabs = [
  ["sss", "SSS"],
  ["kargo", "Kargo ve Teslimat"],
  ["iade", "İade ve Değişim"],
  ["takip", "Sipariş Takibi"],
] as const;

const faqs = [
  {
    q: "Ürünleriniz orijinal mi?",
    a: "Evet. Bee’de satışa sunduğumuz tüm parfümler orijinaldir ve güvenilir tedarik kanallarından temin edilir.",
  },
  {
    q: "Hangi bölgelere kargo yapıyorsunuz?",
    a: "Yalnızca yurt içi gönderim yapıyoruz. Türkiye’nin tüm illerine kargo ile teslimat sağlanır.",
  },
  {
    q: "Siparişim ne zaman kargoya verilir?",
    a: "Siparişleriniz genellikle 1–2 iş günü içinde hazırlanıp yurt içi kargoya teslim edilir. Yoğun dönemlerde süre biraz uzayabilir.",
  },
  {
    q: "Ücretsiz kargo var mı?",
    a: "1.500 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki tutarlarda kargo ücreti sipariş özetinde gösterilir.",
  },
  {
    q: "Parfüm iade edebilir miyim?",
    a: "Açılmamış ve mühürlü ürünlerde teslimattan itibaren 14 gün içinde iade kabul edilir. Hijyen nedeniyle açılmış parfümlerde iade yapılmaz.",
  },
  {
    q: "Ödeme nasıl yapılır?",
    a: "Güvenli ödeme altyapısı üzerinden kredi/banka kartı ile ödeme yapabilirsiniz. Detaylar ödeme adımında yer alır.",
  },
  {
    q: "Siparişimi nasıl takip ederim?",
    a: "Sipariş numaranız ve telefonunuzla bu sayfadaki takip formundan bize yazın. Kargo takip bilgisini size WhatsApp veya SMS ile iletiriz.",
  },
  {
    q: "Nasıl iletişime geçebilirim?",
    a: "0545 226 75 31 numaralı telefondan veya beekozmatik59@outlook.com adresinden bize ulaşabilirsiniz. Tekirdağ, Süleymanpaşa.",
  },
];

export function SupportHub() {
  const [openFaq, setOpenFaq] = useState(0);
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");

  const whatsappHref = useMemo(() => {
    const text = `Merhaba Bee, sipariş takibi istiyorum.\nSipariş No: ${orderNo || "-"}\nTelefon: ${phone || "-"}`;
    return `https://wa.me/905452267531?text=${encodeURIComponent(text)}`;
  }, [orderNo, phone]);

  const mailHref = useMemo(() => {
    const subject = `Sipariş Takibi - ${orderNo || "Yeni talep"}`;
    const body = `Merhaba Bee,\n\nSipariş takibi istiyorum.\nSipariş No: ${orderNo || "-"}\nTelefon: ${phone || "-"}\n\nTeşekkürler.`;
    return `mailto:beekozmatik59@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [orderNo, phone]);

  const onTrack = (event: FormEvent) => {
    event.preventDefault();
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <nav className="sticky top-[108px] z-20 border-y border-black/10 bg-[#faf8f3]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-5 py-3 lg:px-8">
          {tabs.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 px-4 py-2 text-[10px] tracking-[.16em] text-neutral-600 transition hover:bg-black hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] space-y-24 px-5 py-16 lg:px-8 lg:py-24">
        <section id="sss" className="scroll-mt-44">
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">SIKÇA SORULANLAR</p>
          <h2 className="mt-3 font-serif text-4xl md:text-6xl">Merak edilenler</h2>
          <div className="mt-10 border-t border-black/10">
            {faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.q} className="border-b border-black/10">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    aria-expanded={open}
                  >
                    <span className="font-serif text-2xl md:text-3xl">{item.q}</span>
                    <ChevronDown className={`shrink-0 transition ${open ? "rotate-180" : ""}`} size={18} />
                  </button>
                  {open && <p className="pb-6 pr-10 text-sm leading-7 text-neutral-600">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section id="kargo" className="scroll-mt-44 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">KARGO VE TESLİMAT</p>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl">Yurt içi teslimat</h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              Siparişleriniz Tekirdağ’dan hazırlanır ve yalnızca Türkiye içi kargo ile gönderilir.
            </p>
          </div>
          <ul className="space-y-0 border-t border-black/10">
            {[
              ["Hazırlık süresi", "Siparişler genellikle 1–2 iş günü içinde kargoya verilir."],
              ["Gönderim bölgesi", "Yalnızca yurt içi gönderim yapılır; yurt dışı kargo yoktur."],
              ["Ücretsiz kargo", "1.500 TL ve üzeri siparişlerde kargo ücretsizdir."],
              ["Paketleme", "Parfümler darbeye karşı özenle paketlenerek gönderilir."],
              ["Bilgilendirme", "Kargo takip numarası WhatsApp veya SMS ile iletilir."],
            ].map(([title, text]) => (
              <li key={title} className="border-b border-black/10 py-6">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="iade" className="scroll-mt-44 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">İADE VE DEĞİŞİM</p>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl">Net ve adil kurallar</h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              Hijyen ürünü olduğu için parfüm iadelerinde ambalaj ve mühür durumu önemlidir.
            </p>
          </div>
          <ul className="space-y-0 border-t border-black/10">
            {[
              ["14 gün", "Teslimattan itibaren 14 gün içinde iade talebi oluşturabilirsiniz."],
              ["Açılmamış ürün", "Ürün orijinal kutusunda, açılmamış ve mühürlü olmalıdır."],
              ["Açılmış parfüm", "Hijyen nedeniyle açılmış / denenmiş parfümlerde iade kabul edilmez."],
              ["Değişim", "Stok uygunsa aynı ürün veya alternatif ürün ile değişim yapılabilir."],
              ["Süreç", "İade için WhatsApp veya e-posta ile sipariş numaranızı iletin; yönlendirme yapılır."],
            ].map(([title, text]) => (
              <li key={title} className="border-b border-black/10 py-6">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="takip" className="scroll-mt-44 border border-black/10 bg-white p-8 md:p-12">
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">SİPARİŞ TAKİBİ</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Siparişinizi sorun</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
            Sipariş numaranızı ve telefonunuzu yazın; WhatsApp üzerinden bize ulaşın.
            Kargo takip bilgisini size iletiriz. Karmaşık panel yok — doğrudan site sahibi yanıtlar.
          </p>
          <form onSubmit={onTrack} className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="block text-xs tracking-widest text-neutral-500">
              SİPARİŞ NO
              <input
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="Örn. BEE-1024"
                className="mt-2 w-full border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-black"
                required
              />
            </label>
            <label className="block text-xs tracking-widest text-neutral-500">
              TELEFON
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xx xxx xx xx"
                className="mt-2 w-full border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-black"
                required
              />
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" className="btn-dark">
                <MessageCircle size={16} /> WHATSAPP İLE SOR
              </button>
              <a href={mailHref} className="inline-flex items-center gap-2 border border-black/20 px-6 py-4 text-xs tracking-[.14em] transition hover:border-black">
                <Mail size={16} /> E-POSTA GÖNDER
              </a>
            </div>
          </form>
          <p className="mt-6 text-xs leading-6 text-neutral-500">
            Telefon: <a href="tel:05452267531" className="underline">0545 226 75 31</a>
            {" · "}
            E-posta: <a href="mailto:beekozmatik59@outlook.com" className="underline">beekozmatik59@outlook.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
