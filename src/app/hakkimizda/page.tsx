import type { Metadata } from "next";
import { Gem, HeartHandshake, Leaf, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "BEE Parfüm'ün hikâyesini ve kokuya bakışını keşfedin.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#191918] px-5 py-24 text-white md:py-36">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#c4a16f]/20" />
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-[#c4a16f]/20" />
        <div className="relative mx-auto max-w-[1500px] text-center">
          <p className="text-[10px] tracking-[.3em] text-[#c9a775]">BEE’NİN HİKÂYESİ</p>
          <h1 className="mx-auto mt-5 max-w-5xl font-serif text-6xl leading-[.95] md:text-8xl">Koku, hatıranın görünmez hâlidir.</h1>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-white/60">Bee, parfümü yalnızca bir aksesuar değil, kişiliğin en zarif ifadesi olarak gören bir anlayışla doğdu. Her seçimimizde özgünlük, güven ve kalıcı bir deneyim arıyoruz.</p>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 border-y border-white/10 py-7">
            <div><b className="font-serif text-3xl text-[#d2b17e] md:text-5xl">11+</b><p className="mt-2 text-[9px] tracking-widest text-white/45">SEÇKİN MARKA</p></div>
            <div className="border-x border-white/10"><b className="font-serif text-3xl text-[#d2b17e] md:text-5xl">%100</b><p className="mt-2 text-[9px] tracking-widest text-white/45">ORİJİNAL ÜRÜN</p></div>
            <div><b className="font-serif text-3xl text-[#d2b17e] md:text-5xl">7/6</b><p className="mt-2 text-[9px] tracking-widest text-white/45">UZMAN DESTEK</p></div>
          </div>
        </div>
      </section>
      <section className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] tracking-[.3em] text-[#956f42]">YAKLAŞIMIMIZ</p>
          <h2 className="mt-4 font-serif text-5xl md:text-7xl">Her koku kişisel bir hikâye anlatır.</h2>
          <p className="mt-7 text-base leading-8 text-neutral-600">Dünyanın saygın parfüm evlerini özenle seçiyor, her ürünü özgünlük ve kalite standartlarımızdan geçiriyoruz. Amacımız yalnızca parfüm sunmak değil; size ait kokuyu bulacağınız güvenilir ve ilham veren bir deneyim yaratmak.</p>
        </div>
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {[
            [ShieldCheck, "Güven", "Her ürünümüz yetkili ve güvenilir tedarik kanallarından gelir."],
            [Gem, "Seçkinlik", "Koleksiyonumuzu kalite, karakter ve kalıcılık odağında oluştururuz."],
            [HeartHandshake, "Kişisel Deneyim", "Doğru kokuyu bulmanız için uzmanlık ve özenle yanınızdayız."],
          ].map(([Icon, title, text]) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return <article key={title as string} className="border border-black/10 bg-white p-8 text-center"><ItemIcon className="mx-auto text-[#9c7749]" strokeWidth={1.2} size={32} /><h3 className="mt-5 font-serif text-3xl">{title as string}</h3><p className="mt-3 text-sm leading-6 text-neutral-500">{text as string}</p></article>;
          })}
        </div>
        <div className="mt-20 grid gap-12 border-t border-black/10 pt-16 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">NASIL SEÇİYORUZ?</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Koleksiyonumuzun arkasındaki özen</h2>
          </div>
          <div className="space-y-8">
            <div className="flex gap-5"><Sparkles className="shrink-0 text-[#9c7749]" strokeWidth={1.2} /><div><h3 className="font-serif text-2xl">Kürasyon</h3><p className="mt-2 text-sm leading-7 text-neutral-600">Performansı, nota dengesi ve karakteri güçlü parfümleri uzman değerlendirmesiyle seçiyoruz.</p></div></div>
            <div className="flex gap-5"><Leaf className="shrink-0 text-[#9c7749]" strokeWidth={1.2} /><div><h3 className="font-serif text-2xl">Bilinçli deneyim</h3><p className="mt-2 text-sm leading-7 text-neutral-600">Koku aileleri, kullanım zamanı ve nota bilgileriyle karar vermenizi kolaylaştırıyoruz.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
