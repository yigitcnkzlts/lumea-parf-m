import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Gem, HeartHandshake, MapPin, Package, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { brands } from "@/data/brands";

/** Gerçek marka / mağaza fotoğrafları gelince bu URL’leri değiştirin. */
const aboutGallery = [
  {
    src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
    alt: "Parfüm şişeleri — Bee seçkisi",
    caption: "Seçkin koleksiyon",
  },
  {
    src: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85",
    alt: "Özenli paketleme atmosferi",
    caption: "Özenli paketleme",
  },
  {
    src: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=85",
    alt: "Koku ve zarafet detayı",
    caption: "Tekirdağ’dan yola çıkar",
  },
] as const;

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Bee Kozmetik'in hikâyesini, Tekirdağ'dan yurt içine uzanan yaklaşımını keşfedin.",
};

const values = [
  ["Güven", "Her ürün güvenilir tedarik kanallarından gelir; orijinalliği önceliğimizdir."],
  ["Seçkinlik", "Koleksiyonu kalite, karakter ve kalıcılık odağında özenle kurarız."],
  ["Kişisel Destek", "Doğru kokuyu bulmanız için doğrudan sizinle ilgileniriz."],
] as const;

const steps = [
  ["01", "Kürasyon", "Nota dengesi, karakter ve performansı güçlü parfümleri seçeriz."],
  ["02", "Doğrulama", "Orijinal ürün ve güvenilir tedarik standardını koruruz."],
  ["03", "Teslimat", "Tekirdağ’dan yurt içi kargo ile özenli paketleme ve hızlı gönderim."],
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#0e0d0c] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgba(201,167,117,.22),transparent_42%),radial-gradient(ellipse_at_88%_78%,rgba(201,167,117,.08),transparent_45%)]" />
        <div className="pointer-events-none absolute -right-20 top-16 h-[26rem] w-[26rem] rounded-full border border-[#c9a775]/12" />
        <div className="pointer-events-none absolute -right-4 top-36 h-[16rem] w-[16rem] rounded-full border border-[#c9a775]/08" />

        <div className="relative mx-auto max-w-[1500px] px-5 pt-28 md:px-8 md:pt-36 lg:pb-28">
          <div className="grid items-end gap-14 lg:grid-cols-[1.2fr_.8fr] lg:gap-24">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#c9a775]" />
                <p className="text-[10px] tracking-[.34em] text-[#d4b48a]">BEE KOZMETİK · TEKİRDAĞ</p>
              </div>
              <p className="mt-6 font-serif text-[clamp(3.4rem,9vw,7.5rem)] leading-none tracking-[.2em]">BEE</p>
              <h1 className="mt-8 max-w-2xl font-serif text-[clamp(2.1rem,4.2vw,3.75rem)] font-light leading-[1.05] tracking-[-.02em] text-white/95">
                Koku, hatıranın görünmez hâlidir.
              </h1>
              <p className="mt-7 max-w-lg text-sm leading-8 text-white/55 md:text-[15px]">
                Bee, parfümü yalnızca bir aksesuar değil; kişiliğin en zarif ifadesi olarak görür.
                Seçkin markaları özenle buluşturur, Tekirdağ’dan tüm Türkiye’ye güvenle ulaştırırız.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/urunler" className="inline-flex items-center gap-2 bg-[#c9a775] px-7 py-4 text-xs tracking-[.16em] text-black transition hover:bg-white">
                  KOLEKSİYONU KEŞFET <ArrowDownRight size={16} />
                </Link>
                <Link href="/siparis" className="inline-flex items-center gap-2 border border-white/25 px-7 py-4 text-xs tracking-[.16em] transition hover:border-white hover:bg-white hover:text-black">
                  SİPARİŞ / ÖDEME
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="text-[10px] tracking-[.3em] text-white/35">VAATLERİMİZ</p>
              <ul className="mt-8 border-t border-white/15">
                <li className="border-b border-white/15">
                  <Link href="/markalar" className="group flex items-end justify-between gap-6 py-7">
                    <span className="pb-1 text-[11px] tracking-[.2em] text-white/45 transition group-hover:text-white/75">Seçkin marka</span>
                    <span className="font-serif text-5xl leading-none text-[#e0c08a] transition group-hover:text-white">{brands.length}</span>
                  </Link>
                </li>
                <li className="flex items-end justify-between gap-6 border-b border-white/15 py-7">
                  <span className="pb-1 text-[11px] tracking-[.2em] text-white/45">Orijinal ürün</span>
                  <span className="font-serif text-5xl leading-none text-[#e0c08a]">%100</span>
                </li>
                <li className="border-b border-white/15">
                  <Link href="/hizmetler#kargo" className="group flex items-end justify-between gap-6 py-7">
                    <span className="pb-1 text-[11px] tracking-[.2em] text-white/45 transition group-hover:text-white/75">Yurt içi kargo</span>
                    <span className="font-serif text-3xl leading-none tracking-[.04em] text-[#e0c08a] transition group-hover:text-white">Türkiye</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex border-t border-white/10 lg:hidden">
            <Link href="/markalar" className="flex-1 py-7 text-center">
              <p className="font-serif text-3xl text-[#e0c08a]">{brands.length}</p>
              <p className="mt-2 text-[9px] tracking-[.16em] text-white/45">MARKA</p>
            </Link>
            <div className="flex-1 border-x border-white/10 py-7 text-center">
              <p className="font-serif text-3xl text-[#e0c08a]">%100</p>
              <p className="mt-2 text-[9px] tracking-[.16em] text-white/45">ORİJİNAL</p>
            </div>
            <Link href="/hizmetler#kargo" className="flex-1 py-7 text-center">
              <p className="font-serif text-2xl tracking-wide text-[#e0c08a] sm:text-3xl">TR</p>
              <p className="mt-2 text-[9px] tracking-[.16em] text-white/45">YURT İÇİ</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] tracking-[.3em] text-[#956f42]">YAKLAŞIMIMIZ</p>
          <h2 className="mt-4 font-serif text-5xl md:text-7xl">Her koku kişisel bir hikâye anlatır.</h2>
          <p className="mt-7 text-base leading-8 text-neutral-600">
            Amacımız yalnızca ürün sunmak değil; size ait kokuyu bulacağınız güvenilir ve sakin bir alışveriş deneyimi yaratmak.
          </p>
        </div>

        <div className="mt-20 grid border-y border-black/10 md:grid-cols-3">
          {values.map(([title, text], index) => (
            <article
              key={title}
              className={`px-0 py-10 md:px-8 md:py-12 ${index > 0 ? "border-t border-black/10 md:border-t-0 md:border-l" : ""}`}
            >
              <h3 className="font-serif text-3xl">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-500">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-24">
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">ATMOSFER</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Bee dünyasından kareler</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
            Marka ve mağaza görselleriniz hazır olduğunda buraya yerleştirilir. Şimdilik koleksiyon atmosferini yansıtan yer tutucular.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {aboutGallery.map((item) => (
              <li key={item.src} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe5da]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-3 text-[10px] tracking-[.2em] text-neutral-500">{item.caption}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-24 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">NASIL ÇALIŞIRIZ?</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Koleksiyondan kapınıza</h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              Küçük ve özenli bir yapıyla çalışıyoruz. Siparişlerinizi site sahibi bizzat hazırlar; yurt içi kargo ile gönderir.
            </p>
          </div>
          <ol className="space-y-0 border-t border-black/10">
            {steps.map(([num, title, text]) => (
              <li key={num} className="grid grid-cols-[4rem_1fr] gap-5 border-b border-black/10 py-8">
                <span className="font-serif text-3xl text-[#9c7749]">{num}</span>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#eee8dc]">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#8d693e]">BİZE ULAŞIN</p>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl">Tekirdağ’dan, size özel.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-600">
              Sorularınız, siparişleriniz ve koku danışmanlığı için doğrudan bizimle iletişime geçebilirsiniz.
            </p>
            <div className="mt-8 space-y-3 text-sm text-neutral-700">
              <p className="flex items-center gap-3"><MapPin size={16} className="text-[#9c7749]" /> Tekirdağ, Süleymanpaşa</p>
              <a href="tel:05452267531" className="block transition hover:text-[#8a6438]">0545 226 75 31</a>
              <a href="mailto:beekozmatik59@outlook.com" className="block transition hover:text-[#8a6438]">beekozmatik59@outlook.com</a>
            </div>
            <Link href="/iletisim" className="btn-dark mt-9 w-fit">
              İLETİŞİM <ArrowDownRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "Orijinal ürün"],
              [Gem, "Seçkin markalar"],
              [HeartHandshake, "Kişisel destek"],
              [Truck, "Yurt içi kargo"],
              [Package, "Özenli paket"],
              [Sparkles, "WhatsApp destek"],
            ].map(([Icon, label]) => {
              const Item = Icon as typeof ShieldCheck;
              return (
                <div key={label as string} className="border border-black/10 bg-white/50 px-5 py-8 text-center">
                  <Item className="mx-auto text-[#9c7749]" strokeWidth={1.2} />
                  <p className="mt-4 font-serif text-xl">{label as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
