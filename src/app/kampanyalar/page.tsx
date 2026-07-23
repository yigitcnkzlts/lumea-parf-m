import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgePercent, CheckCircle2, PackageCheck, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "Luméa Parfüm kampanyalarını ve özel fırsatlarını keşfedin.",
};

const campaigns = [
  {
    title: "İkinci Ürüne Özel İndirim",
    description: "Seçili parfümlerde ikinci üründe %20 indirim ayrıcalığından yararlanın.",
    badge: "SEÇİLİ ÜRÜNLERDE",
    detail: "Sepette daha düşük fiyatlı ürüne otomatik uygulanır.",
    code: "Kod gerektirmez",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Yaz Kokularında Fırsatlar",
    description: "Ferah ve enerjik yaz parfümlerinde sezonun öne çıkan fiyatları.",
    badge: "YAZ SEÇKİSİ",
    detail: "Yaz seçkisindeki ürünlerde %15 ek indirim sağlar.",
    code: "YAZ15",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Niş Parfüm Günleri",
    description: "Karakterli ve sıra dışı niş kokularda Luméa'ya özel avantajlar.",
    badge: "SINIRLI SÜRE",
    detail: "5.000 TL ve üzeri seçili niş parfüm alışverişinde geçerlidir.",
    code: "NICHE500",
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function CampaignsPage() {
  return (
    <main className="section-shell">
      <header className="mb-14 max-w-3xl">
        <p className="text-[10px] tracking-[.3em] text-[#956f42]">LUMÉA AYRICALIKLARI</p>
        <h1 className="mt-4 font-serif text-6xl md:text-8xl">Kampanyalar</h1>
        <p className="mt-5 leading-7 text-neutral-600">Seçkin kokulara özel fırsatları ve dönemsel Luméa ayrıcalıklarını keşfedin.</p>
      </header>
      <div className="mb-14 grid border border-black/10 bg-white sm:grid-cols-3">
        {[
          [BadgePercent, "Net kampanya koşulları", "İndirim detayını alışverişten önce görün."],
          [PackageCheck, "Ücretsiz kargo", "1.500 TL ve üzeri tüm siparişlerde."],
          [RotateCcw, "Kolay iade", "Kampanyalı ürünlerde de 14 gün iade."],
        ].map(([Icon, title, text]) => {
          const ItemIcon = Icon as typeof BadgePercent;
          return <div key={title as string} className="flex gap-4 border-b border-black/10 p-6 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><ItemIcon className="shrink-0 text-[#9c7749]" strokeWidth={1.3} /><div><h2 className="font-serif text-xl">{title as string}</h2><p className="mt-1 text-xs leading-5 text-neutral-500">{text as string}</p></div></div>;
        })}
      </div>
      <div className="space-y-5">
        {campaigns.map((campaign, index) => (
          <article key={campaign.title} className="grid min-h-[430px] overflow-hidden bg-[#e9e3d8] md:grid-cols-2">
            <div className={`relative min-h-80 ${index % 2 ? "md:order-2" : ""}`}>
              <Image src={campaign.image} alt={campaign.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-14">
              <p className="text-[10px] tracking-[.25em] text-[#8f6a3e]">{campaign.badge}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{campaign.title}</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-600">{campaign.description}</p>
              <div className="mt-6 border-l-2 border-[#aa8654] pl-4">
                <p className="text-xs leading-5 text-neutral-600">{campaign.detail}</p>
                <p className="mt-2 text-[10px] tracking-[.16em]"><b>KAMPANYA KODU:</b> {campaign.code}</p>
              </div>
              <Link href="/urunler" className="btn-dark mt-8 w-fit">ÜRÜNLERİ KEŞFET</Link>
            </div>
          </article>
        ))}
      </div>
      <section className="mt-20 bg-[#191918] p-8 text-white md:p-14">
        <p className="text-[10px] tracking-[.3em] text-[#c9a775]">ÜÇ KOLAY ADIM</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Kampanyadan nasıl yararlanırım?</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            ["01", "Kampanyayı seçin", "Size uygun fırsatın koşullarını inceleyin."],
            ["02", "Ürünleri sepete ekleyin", "Kampanya kapsamındaki ürünleri kolayca bulun."],
            ["03", "İndirimi uygulayın", "Kodu girin veya otomatik indirimi sepetinizde görün."],
          ].map(([number, title, text]) => <div key={number} className="border-t border-white/15 pt-5"><span className="font-serif text-3xl text-[#c9a775]">{number}</span><h3 className="mt-4 flex items-center gap-2 font-serif text-2xl"><CheckCircle2 size={17} /> {title}</h3><p className="mt-2 text-xs leading-6 text-white/55">{text}</p></div>)}
        </div>
      </section>
    </main>
  );
}
