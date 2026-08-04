import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

const groups: [string, [string, string][]][] = [
  ["Kurumsal", [["Hakkımızda", "/hakkimizda"], ["İletişim", "/iletisim"], ["Hizmetler", "/hizmetler"], ["Koku Danışmanı", "/koku-danismani"]]],
  ["Hizmetler", [
    ["Genel Bakış", "/hizmetler#genel"],
    ["Kargo ve Teslimat", "/hizmetler#kargo"],
    ["Sipariş Takibi", "/hizmetler#takip"],
    ["İade ve Değişim", "/hizmetler#iade"],
    ["Ödeme", "/hizmetler#odeme"],
    ["SSS", "/hizmetler#sss"],
  ]],
  ["Kategoriler", [["Kadın", "/kadin-parfumleri"], ["Erkek", "/erkek-parfumleri"], ["Unisex", "/unisex"], ["Niş Parfümler", "/urunler"]]],
  ["Yasal", [
    ["Gizlilik Politikası", "/gizlilik"],
    ["Mesafeli Satış Sözleşmesi", "/mesafeli-satis"],
    ["Çerez Politikası", "/cerez-politikasi"],
    ["KVKK", "/kvkk"],
  ]],
];

export function Footer() {
  return (
    <footer className="bg-[#151514] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-4xl tracking-[.1em]">BEE</Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">Kokunun kişisel bir imza olduğuna inanıyoruz. Dünyanın seçkin parfümlerini özenle seçerek sizinle buluşturuyoruz.</p>
            <div className="mt-7 space-y-3 text-xs text-white/65">
              <p className="flex gap-3"><MapPin size={16} /> Tekirdağ, Süleymanpaşa</p>
              <p className="flex gap-3"><Phone size={16} /> 0545 226 75 31</p>
              <p className="flex gap-3"><Mail size={16} /> beekozmatik59@outlook.com</p>
            </div>
          </div>
          {groups.map(([title, items]) => (
            <div key={title}>
              <p className="mb-5 text-xs tracking-[.16em] text-[#c7a675]">{title}</p>
              <ul className="space-y-3 text-xs text-white/55">{items.map(([label, href]) => <li key={label}><Link href={href} className="transition hover:text-white">{label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6 pt-7 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Bee Kozmetik. Tüm hakları saklıdır.</p>
          <div className="flex gap-3">
            <span className="payment">Site Siparişi</span>
            <span className="payment">Havale / EFT</span>
          </div>
          <div className="flex gap-4">
            <Link href="https://instagram.com/beekozmatik" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Camera size={18} /></Link>
            <Link href={whatsappLink("Merhaba Bee!")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
