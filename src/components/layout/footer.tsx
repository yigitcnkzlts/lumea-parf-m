import Link from "next/link";
import { AtSign, Camera, Mail, MapPin, Phone } from "lucide-react";

const groups = [
  ["Kurumsal", ["Hakkımızda", "Mağazalarımız", "Kariyer", "İletişim"]],
  ["Müşteri Hizmetleri", ["Sıkça Sorulan Sorular", "Kargo ve Teslimat", "İade ve Değişim", "Sipariş Takibi"]],
  ["Kategoriler", ["Kadın", "Erkek", "Unisex", "Niş Parfümler"]],
  ["Yasal", ["Gizlilik Politikası", "Mesafeli Satış Sözleşmesi", "Çerez Politikası", "KVKK"]],
];

export function Footer() {
  return (
    <footer id="iletisim" className="bg-[#151514] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-4xl tracking-[.1em]">LUMÉA</Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">Kokunun kişisel bir imza olduğuna inanıyoruz. Dünyanın seçkin parfümlerini özenle seçerek sizinle buluşturuyoruz.</p>
            <div className="mt-7 space-y-3 text-xs text-white/65"><p className="flex gap-3"><MapPin size={16} /> Nişantaşı, İstanbul</p><p className="flex gap-3"><Phone size={16} /> 0850 450 58 63</p><p className="flex gap-3"><Mail size={16} /> merhaba@lumeaparfum.com</p></div>
          </div>
          {groups.map(([title, items]) => (
            <div key={title as string}>
              <p className="mb-5 text-xs tracking-[.16em] text-[#c7a675]">{title}</p>
              <ul className="space-y-3 text-xs text-white/55">{(items as string[]).map((item) => <li key={item}><Link href="#" className="transition hover:text-white">{item}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6 pt-7 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Luméa Parfüm. Tüm hakları saklıdır.</p>
          <div className="flex gap-3"><span className="payment">VISA</span><span className="payment">Mastercard</span><span className="payment">TROY</span></div>
          <div className="flex gap-4"><Link href="#" aria-label="Instagram"><Camera size={18} /></Link><Link href="#" aria-label="Sosyal medya"><AtSign size={18} /></Link></div>
        </div>
      </div>
    </footer>
  );
}
