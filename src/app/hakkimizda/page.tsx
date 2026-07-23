import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, Gem, HeartHandshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { brands } from "@/data/brands";

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
      <section className="relative overflow-hidden bg-[#141312] px-5 py-24 text-white md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(201,167,117,.18),transparent_42%)]" />
        <div className="relative mx-auto max-w-[1500px]">
          <p className="font-serif text-[clamp(3rem,8vw,7rem)] leading-none tracking-[.14em]">BEE</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-12 bg-[#c9a775]" />
            <p className="text-[10px] tracking-[.3em] text-[#c9a775]">BEE KOZMETİK · TEKİRDAĞ</p>
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[.95] md:text-7xl lg:text-8xl">
            Koku, hatıranın görünmez hâlidir.
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            Bee, parfümü yalnızca bir aksesuar değil; kişiliğin en zarif ifadesi olarak görür.
            Seçkin markaları özenle buluşturur, Tekirdağ’dan tüm Türkiye’ye güvenle ulaştırırız.
          </p>
          <div className="mt-14 grid max-w-3xl grid-cols-3 border-y border-white/10 py-8">
            <div>
              <b className="font-serif text-3xl text-[#d2b17e] md:text-5xl">{brands.length}</b>
              <p className="mt-2 text-[9px] tracking-widest text-white/45">SEÇKİN MARKA</p>
            </div>
            <div className="border-x border-white/10 text-center">
              <b className="font-serif text-3xl text-[#d2b17e] md:text-5xl">%100</b>
              <p className="mt-2 text-[9px] tracking-widest text-white/45">ORİJİNAL ÜRÜN</p>
            </div>
            <div className="text-right">
              <b className="font-serif text-3xl text-[#d2b17e] md:text-5xl">Yİ</b>
              <p className="mt-2 text-[9px] tracking-widest text-white/45">YURT İÇİ KARGO</p>
            </div>
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
            ].map(([Icon, label]) => {
              const Item = Icon as typeof ShieldCheck;
              return (
                <div key={label as string} className="border border-black/10 bg-white/50 px-5 py-8 text-center">
                  <Item className="mx-auto text-[#9c7749]" strokeWidth={1.2} />
                  <p className="mt-4 font-serif text-xl">{label as string}</p>
                </div>
              );
            })}
            <div className="border border-black/10 bg-white/50 px-5 py-8 text-center sm:col-span-3 sm:flex sm:items-center sm:justify-center sm:gap-3 sm:py-6">
              <Sparkles className="mx-auto text-[#9c7749] sm:mx-0" strokeWidth={1.2} size={20} />
              <p className="mt-3 text-xs tracking-[.16em] text-neutral-600 sm:mt-0">ÖZENLİ PAKETLEME · HIZLI YURT İÇİ GÖNDERİM</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
