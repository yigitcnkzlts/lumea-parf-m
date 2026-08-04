import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Panel",
};

const cards = [
  {
    href: "/admin/siparisler",
    title: "Siparişler",
    text: "Sipariş listesi, kargo firması ve takip no girme, iptal / iade.",
  },
  {
    href: "/admin/stok",
    title: "Ürün & stok",
    text: "Yeni parfüm ekle, görsel sürükle-bırak, açıklama, CSV stok import.",
  },
  {
    href: "/admin/bildirimler",
    title: "Bildirimler",
    text: "E-posta/SMS kuyruğu, newsletter sayısı, stok alert özeti.",
  },
] as const;

export default function AdminHomePage() {
  return (
    <main className="section-shell !py-16">
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">BEE ADMIN</p>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl">Yönetim paneli</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
        Admin hesabıyla giriş yapın. Rol için Supabase’de{" "}
        <code className="text-xs">profiles.role = &apos;admin&apos;</code> olmalı.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group border border-black/10 bg-white/50 p-8 transition hover:border-black hover:bg-[#141312] hover:text-white"
          >
            <h2 className="font-serif text-3xl">{card.title}</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600 transition group-hover:text-white/65">{card.text}</p>
            <span className="mt-8 inline-block text-[10px] tracking-[.18em] text-[#956f42] transition group-hover:text-[#d0ad7b]">
              AÇ →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-14 border border-[#c9a775]/35 bg-[#f7f1e6] p-6 text-sm text-[#4a3520]">
        <p className="font-medium">İlk kurulum</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
          <li>Supabase SQL: migrations 001, 002, 003</li>
          <li>Admin kullanıcı: profiles.role = admin</li>
          <li>Vercel env + iyzico anahtarları</li>
        </ol>
      </div>
    </main>
  );
}
