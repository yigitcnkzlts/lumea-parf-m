import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, Gem, HeartHandshake, MapPin, Package, ShieldCheck, Sparkles, Truck } from "lucide-react";
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,167,117,.22),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.35))]" />
        <div className="relative mx-auto max-w-[1500px]">
          <p className="font-serif text-[clamp(3.4rem,9vw,8rem)] leading-none tracking-[.16em]">BEE</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-14 bg-[#c9a775]" />
            <p className="text-[10px] tracking-[.32em] text-[#c9a775]">BEE KOZMETİK · TEKİRDAĞ</p>
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[.95] md:text-7xl lg:text-8xl">
            Koku, hatıranın görünmez hâlidir.
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            Bee, parfümü yalnızca bir aksesuar değil; kişiliğin en zarif ifadesi olarak görür.
            Seçkin markaları özenle buluşturur, Tekirdağ’dan tüm Türkiye’ye güvenle ulaştırırız.
          </p>

          <div className="mt-14 grid max-w-5xl gap-4 sm:grid-cols-3">
            <Link href="/markalar" className="group border border-white/10 bg-white/[.03] p-6 transition hover:border-[#c9a775]/50 hover:bg-white/[.06]">
              <p className="font-serif text-5xl text-[#d2b17e] transition group-hover:tracking-wide">{brands.length}</p>
              <p className="mt-3 text-[10px] tracking-[.22em] text-white/50">SEÇKİN MARKA</p>
              <p className="mt-2 text-xs text-white/35">Markalarımıza göz atın →</p>
            </Link>
            <div className="border border-white/10 bg-white/[.03] p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#d2b17e]" strokeWidth={1.2} />
                <p className="font-serif text-5xl text-[#d2b17e]">%100</p>
              </div>
              <p className="mt-3 text-[10px] tracking-[.22em] text-white/50">ORİJİNAL ÜRÜN</p>
              <p className="mt-2 text-xs text-white/35">Güvenilir tedarik</p>
            </div>
            <Link href="/musteri-hizmetleri#kargo" className="group border border-white/10 bg-white/[.03] p-6 transition hover:border-[#c9a775]/50 hover:bg-white/[.06]">
              <div className="flex items-center gap-3">
                <Truck className="text-[#d2b17e]" strokeWidth={1.2} />
                <p className="font-serif text-3xl leading-none text-[#d2b17e] md:text-4xl">YURT İÇİ</p>
              </div>
              <p className="mt-3 text-[10px] tracking-[.22em] text-white/50">TEKİRDAĞ’DAN KARGO</p>
              <p className="mt-2 text-xs text-white/35">Kargo bilgisini inceleyin →</p>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/urunler" className="btn-dark border border-[#c9a775] bg-[#c9a775] text-black hover:bg-white">KOLEKSİYONU KEŞFET</Link>
            <Link href="/siparis" className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.15em] transition hover:bg-white hover:text-black">SİPARİŞ / ÖDEME</Link>
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
