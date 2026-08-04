"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Boxes, Package, Sparkles } from "lucide-react";

type Stats = {
  pendingOrders: number;
  preparingOrders: number;
  activeProducts: number;
  lowStock: number;
  pendingStockAlerts: number;
  newsletterCount: number;
  lowStockThreshold: number;
};

const cards = [
  {
    href: "/admin/siparisler",
    title: "Siparişler",
    text: "Kargo firması, takip no, iptal / iade.",
    icon: Package,
  },
  {
    href: "/admin/urunler",
    title: "Ürünler",
    text: "Katalog, yeni parfüm, düzenle / sil.",
    icon: Sparkles,
  },
  {
    href: "/admin/stok",
    title: "Stok",
    text: "Hızlı adet güncelleme ve CSV.",
    icon: Boxes,
  },
  {
    href: "/admin/bildirimler",
    title: "Bildirimler",
    text: "E-posta kuyruğu, bülten, stok alert.",
    icon: Bell,
  },
] as const;

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/stats")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Özet yüklenemedi");
        setStats(data as Stats);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖZET</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Bee yönetim paneli</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        Bu alan mağazadan ayrıdır ve yalnızca panel şifresi ile açılır. Yeni parfüm için{" "}
        <Link href="/admin/urunler/yeni" className="underline">
          Ürünler → Yeni parfüm
        </Link>
        .
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="İşlemdeki sipariş"
          value={stats?.pendingOrders}
          href="/admin/siparisler"
          hint={stats ? `${stats.preparingOrders} hazırlanıyor` : undefined}
        />
        <StatTile
          label="Aktif ürün"
          value={stats?.activeProducts}
          href="/admin/urunler"
        />
        <StatTile
          label="Düşük stok"
          value={stats?.lowStock}
          href="/admin/stok"
          hint={stats ? `< ${stats.lowStockThreshold} adet` : undefined}
          warn={Boolean(stats && stats.lowStock > 0)}
        />
        <StatTile
          label="Bekleyen stok alert"
          value={stats?.pendingStockAlerts}
          href="/admin/bildirimler"
          hint={stats ? `${stats.newsletterCount} bülten abonesi` : undefined}
        />
      </div>

      {error && <p className="mt-4 text-xs text-red-700">{error}</p>}

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-8">
        <Link href="/admin/urunler/yeni" className="btn-dark inline-flex">
          + YENİ PARFÜM EKLE
        </Link>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  href,
  hint,
  warn,
}: {
  label: string;
  value: number | undefined;
  href: string;
  hint?: string;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border p-5 transition hover:border-black ${
        warn ? "border-amber-600/40 bg-amber-50/80" : "border-black/10 bg-white/70"
      }`}
    >
      <p className="text-[10px] tracking-[.18em] text-neutral-500">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value ?? "—"}</p>
      {hint ? <p className="mt-1 text-[11px] text-neutral-500">{hint}</p> : null}
    </Link>
  );
}
