"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Clock3,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { CONTACT_EMAIL, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contact";
import { formatPrice } from "@/data/products";

const navItems = [
  { id: "genel", label: "Genel Bakış" },
  { id: "kargo", label: "Kargo" },
  { id: "takip", label: "Sipariş Takibi" },
  { id: "iade", label: "İade" },
  { id: "odeme", label: "Ödeme" },
  { id: "sss", label: "SSS" },
  { id: "iletisim", label: "İletişim" },
] as const;

const services = [
  {
    id: "kargo",
    icon: Truck,
    title: "Yurt içi kargo",
    text: "Tekirdağ’dan Türkiye’nin tüm illerine. Yurt dışı gönderim yok.",
  },
  {
    id: "takip",
    icon: Package,
    title: "Sipariş & kargo takibi",
    text: "Takip numaranızı WhatsApp veya SMS ile iletiriz.",
  },
  {
    id: "iade",
    icon: RefreshCcw,
    title: "İade ve değişim",
    text: "14 gün içinde, açılmamış ve mühürlü ürünlerde geçerlidir.",
  },
  {
    id: "odeme",
    icon: ShieldCheck,
    title: "Güvenli ödeme",
    text: "Havale/EFT veya WhatsApp yönlendirme. Kart altyapısı yok.",
  },
  {
    id: "iletisim",
    icon: UserRound,
    title: "Site sahibi destek",
    text: "Call center yok — siparişlerinizi bizzat site sahibi yanıtlar.",
  },
  {
    id: "iletisim",
    icon: Headset,
    title: "WhatsApp hattı",
    text: `${WHATSAPP_DISPLAY} üzerinden hızlı ve doğrudan iletişim.`,
  },
] as const;

const faqs = [
  {
    q: "Ürünleriniz orijinal mi?",
    a: "Evet. Bee’de satışa sunduğumuz tüm parfümler orijinaldir ve güvenilir tedarik kanallarından temin edilir.",
  },
  {
    q: "Hangi bölgelere kargo yapıyorsunuz?",
    a: "Yalnızca yurt içi gönderim yapıyoruz. Türkiye’nin tüm illerine kargo ile teslimat sağlanır. Yurt dışı kargo yoktur.",
  },
  {
    q: "Siparişim ne zaman kargoya verilir?",
    a: "Siparişleriniz genellikle 1–2 iş günü içinde hazırlanıp yurt içi kargoya teslim edilir. Yoğun dönemlerde süre biraz uzayabilir.",
  },
  {
    q: "Ücretsiz kargo var mı?",
    a: `${FREE_SHIPPING_THRESHOLD.toLocaleString("tr-TR")} TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki tutarlarda kargo ücreti ${formatPrice(SHIPPING_FEE)} olarak sipariş özetinde gösterilir.`,
  },
  {
    q: "Parfüm iade edebilir miyim?",
    a: "Açılmamış ve mühürlü ürünlerde teslimattan itibaren 14 gün içinde iade kabul edilir. Hijyen nedeniyle açılmış parfümlerde iade yapılmaz.",
  },
  {
    q: "Ödeme nasıl yapılır?",
    a: "Sepete ürün ekleyip Ödemeye Geç ile siparişi tamamlayın. Havale/EFT veya WhatsApp yönlendirmesi seçebilirsiniz. IBAN bilgisi yalnızca sipariş onayından sonra paylaşılır.",
  },
  {
    q: "Siparişimi kim takip ediyor?",
    a: "Otomatik panel yok. Sipariş ve kargo sürecini site sahibi bizzat yönetir; takip bilgisini size WhatsApp veya SMS ile iletir.",
  },
  {
    q: "Nasıl iletişime geçebilirim?",
    a: `${WHATSAPP_DISPLAY} numaralı telefondan veya ${CONTACT_EMAIL} adresinden bize ulaşabilirsiniz. Tekirdağ, Süleymanpaşa.`,
  },
];

export function ServicesHub() {
  const [openFaq, setOpenFaq] = useState(0);
  const [active, setActive] = useState("genel");
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setActive(hash);

    const onScroll = () => {
      for (const item of [...navItems].reverse()) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 160) {
          setActive(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = useMemo(() => {
    const text = [
      "Merhaba Bee, sipariş / kargo takibi istiyorum.",
      name ? `Ad Soyad: ${name}` : "",
      `Sipariş No: ${orderNo || "-"}`,
      `Telefon: ${phone || "-"}`,
    ]
      .filter(Boolean)
      .join("\n");
    return whatsappLink(text);
  }, [orderNo, phone, name]);

  const mailHref = useMemo(() => {
    const subject = `Sipariş Takibi - ${orderNo || "Yeni talep"}`;
    const body = `Merhaba Bee,\n\nSipariş takibi istiyorum.\nAd Soyad: ${name || "-"}\nSipariş No: ${orderNo || "-"}\nTelefon: ${phone || "-"}\n\nTeşekkürler.`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [orderNo, phone, name]);

  const onTrack = (event: FormEvent) => {
    event.preventDefault();
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <nav className="sticky top-[108px] z-20 border-y border-black/10 bg-[#faf8f3]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-5 py-3 lg:px-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActive(item.id)}
              className={`shrink-0 px-4 py-2 text-[10px] tracking-[.16em] transition ${
                active === item.id ? "bg-black text-white" : "text-neutral-600 hover:bg-black/5"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] space-y-24 px-5 py-16 lg:px-8 lg:py-24">
        <section id="genel" className="scroll-mt-44">
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">HİZMETLERİMİZ</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-6xl">Siparişten teslimata, tek noktadan destek</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
            Bee’de çağrı merkezi yok. Sipariş, kargo, iade ve sorularınızı Tekirdağ’dan bizzat site sahibi karşılar.
            Aşağıdaki hizmetlerden ihtiyacınız olanı seçin.
          </p>

          <div className="mt-12 grid gap-0 border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={`${item.title}-${index}`}
                  href={`#${item.id}`}
                  className="group border-b border-black/10 px-0 py-8 transition hover:bg-[#f3efe6] sm:border-r sm:px-6 odd:sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0"
                >
                  <Icon className="text-[#9c7749] transition group-hover:scale-105" strokeWidth={1.2} size={28} />
                  <h3 className="mt-5 font-serif text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">{item.text}</p>
                  <span className="mt-5 inline-block text-[10px] tracking-[.2em] text-[#956f42]">DETAY →</span>
                </a>
              );
            })}
          </div>
        </section>

        <section id="kargo" className="scroll-mt-44">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[10px] tracking-[.28em] text-[#956f42]">KARGO VE TESLİMAT</p>
              <h2 className="mt-3 font-serif text-4xl md:text-6xl">Yurt içi kargo</h2>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                Tüm siparişler Tekirdağ, Süleymanpaşa’dan hazırlanır ve yalnızca Türkiye içi kargo ile gönderilir.
              </p>
              <div className="mt-8 flex items-center gap-3 border border-black/10 bg-white px-5 py-4 text-sm">
                <MapPin className="shrink-0 text-[#9c7749]" size={18} />
                Çıkış noktası: Tekirdağ · Gönderim: Tüm Türkiye
              </div>
            </div>
            <ul className="border-t border-black/10">
              {[
                ["Hazırlık", "Siparişler genellikle 1–2 iş günü içinde kargoya verilir."],
                ["Teslimat süresi", "Şehre göre ortalama 1–3 iş günü içinde kapınıza ulaşır."],
                ["Ücretsiz kargo", `${FREE_SHIPPING_THRESHOLD.toLocaleString("tr-TR")} TL ve üzeri siparişlerde kargo ücretsizdir.`],
                ["Standart kargo", `${FREE_SHIPPING_THRESHOLD.toLocaleString("tr-TR")} TL altı siparişlerde kargo ücreti ${formatPrice(SHIPPING_FEE)}.`],
                ["Paketleme", "Parfümler darbeye ve sızıntıya karşı özenle paketlenir."],
                ["Yurt dışı", "Yurt dışı kargo yapılmaz."],
              ].map(([title, text]) => (
                <li key={title} className="grid gap-2 border-b border-black/10 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="text-sm leading-7 text-neutral-600 sm:pt-2">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="takip" className="scroll-mt-44 border border-black/10 bg-white">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-black/10 p-8 md:p-12 lg:border-b-0 lg:border-r">
              <p className="text-[10px] tracking-[.28em] text-[#956f42]">SİPARİŞ TAKİBİ</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">Kargonuzu sorun</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Sipariş numaranızı yazın; doğrudan site sahibine WhatsApp ile ulaşın.
                Kargo firması ve takip numaranızı size iletiriz.
              </p>
              <ul className="mt-8 space-y-4 text-sm text-neutral-600">
                <li className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-[#9c7749]" size={16} /> Ortalama yanıt: aynı gün / 1 iş günü</li>
                <li className="flex gap-3"><UserRound className="mt-0.5 shrink-0 text-[#9c7749]" size={16} /> Destek: site sahibi — otomatik bot yok</li>
                <li className="flex gap-3"><Package className="mt-0.5 shrink-0 text-[#9c7749]" size={16} /> Takip no: WhatsApp veya SMS</li>
              </ul>
            </div>
            <form onSubmit={onTrack} className="p-8 md:p-12">
              <label className="block text-[10px] tracking-widest text-neutral-500">
                AD SOYAD
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="mt-4 block text-[10px] tracking-widest text-neutral-500">
                SİPARİŞ NO *
                <input required value={orderNo} onChange={(e) => setOrderNo(e.target.value)} placeholder="Örn. BEE-1024" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="mt-4 block text-[10px] tracking-widest text-neutral-500">
                TELEFON *
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx xxx xx xx" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="submit" className="btn-dark">
                  <MessageCircle size={16} /> WHATSAPP İLE SOR
                </button>
                <a href={mailHref} className="inline-flex items-center gap-2 border border-black/20 px-6 py-4 text-xs tracking-[.14em] transition hover:border-black">
                  <Mail size={16} /> E-POSTA
                </a>
              </div>
            </form>
          </div>
        </section>

        <section id="iade" className="scroll-mt-44">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[10px] tracking-[.28em] text-[#956f42]">İADE VE DEĞİŞİM</p>
              <h2 className="mt-3 font-serif text-4xl md:text-6xl">Net kurallar</h2>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                Parfüm hijyen ürünüdür. İade ve değişimde ambalaj / mühür durumu zorunludur.
              </p>
              <Link href={whatsappLink("Merhaba Bee, iade / değişim talebim var.")} target="_blank" className="btn-dark mt-8 w-fit">
                İADE TALEBİ OLUŞTUR
              </Link>
            </div>
            <ol className="border-t border-black/10">
              {[
                ["01", "14 gün", "Teslimattan itibaren 14 gün içinde talep oluşturabilirsiniz."],
                ["02", "Açılmamış ürün", "Ürün orijinal kutusunda, açılmamış ve mühürlü olmalıdır."],
                ["03", "Açılmış ürün", "Açılmış / denenmiş parfümlerde hijyen nedeniyle iade kabul edilmez."],
                ["04", "Değişim", "Stok uygunsa aynı ürün veya alternatif ile değişim yapılabilir."],
                ["05", "Süreç", "WhatsApp veya e-posta ile sipariş no iletin; iade adresi ve adımlar size özel iletilir."],
              ].map(([num, title, text]) => (
                <li key={num} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-black/10 py-7">
                  <span className="font-serif text-2xl text-[#9c7749]">{num}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="odeme" className="scroll-mt-44 grid gap-10 border-y border-black/10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖDEME</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Nasıl ödersiniz?</h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              Online kart ödeme yoktur. Siparişi siteden oluşturur, ödemeyi havale/EFT veya WhatsApp yönlendirmesi ile tamamlarsınız.
              IBAN bilgisi sipariş onayından sonra paylaşılır.
            </p>
            <Link href="/siparis" className="mt-8 inline-flex border border-black px-6 py-4 text-xs tracking-[.16em] transition hover:bg-black hover:text-white">
              SİPARİŞ SAYFASINA GİT
            </Link>
          </div>
          <ul className="space-y-0">
            {[
              ["Havale / EFT", "Onay sonrası banka bilgisi gösterilir veya WhatsApp’tan iletilir."],
              ["Taksit planı", "2 ve 3 taksit seçenekleri WhatsApp üzerinden planlanır."],
              ["Dekont", "Ödeme sonrası dekontu aynı WhatsApp sohbetine göndermeniz yeterlidir."],
            ].map(([title, text]) => (
              <li key={title} className="border-t border-black/10 py-6 first:border-t-0 first:pt-0">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p>
              </li>
            ))}
          </ul>
        </section>

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
                  {open && <p className="pb-6 pr-4 text-sm leading-7 text-neutral-600 md:pr-10">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section id="iletisim" className="scroll-mt-44 bg-[#141312] px-7 py-12 text-white md:px-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="text-[10px] tracking-[.28em] text-[#d0ad7b]">DOĞRUDAN DESTEK</p>
              <h2 className="mt-4 font-serif text-4xl md:text-6xl">Site sahibi ile konuşun</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
                Bee’de sorularınız bot’a değil, siparişlerinizi hazırlayan kişiye gider.
                Kargo, iade, ürün danışmanlığı — hepsi aynı hattadan.
              </p>
            </div>
            <div className="space-y-4 text-sm">
              <a href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, "")}`} className="flex items-center gap-3 transition hover:text-[#d0ad7b]">
                <Phone size={16} /> {WHATSAPP_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 transition hover:text-[#d0ad7b]">
                <Mail size={16} /> {CONTACT_EMAIL}
              </a>
              <p className="flex items-center gap-3 text-white/55"><MapPin size={16} /> Tekirdağ, Süleymanpaşa</p>
              <a href={whatsappLink("Merhaba Bee, yardıma ihtiyacım var.")} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 bg-[#c9a775] px-6 py-4 text-xs tracking-[.16em] text-black transition hover:bg-white">
                <MessageCircle size={16} /> WHATSAPP’TAN YAZ
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
