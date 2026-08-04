import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Boxes, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Özet",
};

const cards = [
  {
    href: "/admin/siparisler",
    title: "Siparişler",
    text: "Kargo firması, takip no, iptal / iade.",
    icon: Package,
  },
  {
    href: "/admin/stok",
    title: "Ürün & stok",
    text: "Parfüm ekle, görsel yükle, CSV stok.",
    icon: Boxes,
  },
  {
    href: "/admin/bildirimler",
    title: "Bildirimler",
    text: "E-posta/SMS kuyruğu ve aboneler.",
    icon: Bell,
  },
] as const;

export default function AdminHomePage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖZET</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Bee yönetim paneli</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        Bu alan mağazadan ayrıdır ve yalnızca panel şifresi ile açılır.
        Vercel: <code className="text-xs">https://SENIN-DOMAIN/admin</code>
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group border border-black/10 bg-white p-7 transition hover:border-black hover:bg-[#141312] hover:text-white"
            >
              <Icon className="text-[#956f42] transition group-hover:text-[#d0ad7b]" size={22} />
              <h2 className="mt-5 font-serif text-3xl">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600 transition group-hover:text-white/65">
                {card.text}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
