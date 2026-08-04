"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const nav = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard, exact: true },
  { href: "/admin/siparisler", label: "Siparişler", icon: Package },
  { href: "/admin/stok", label: "Ürün & stok", icon: Boxes },
  { href: "/admin/bildirimler", label: "Bildirimler", icon: Bell },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f0e0d] text-white/60">
        Panel yükleniyor…
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f0e0d] px-5 text-white">
        <div className="max-w-md border border-white/10 bg-[#161513] p-8 text-center">
          <p className="text-[10px] tracking-[.28em] text-[#c9a775]">BEE PANEL</p>
          <h1 className="mt-4 font-serif text-4xl">Giriş gerekli</h1>
          <p className="mt-4 text-sm text-white/55">Admin paneli için hesabına giriş yap.</p>
          <button
            type="button"
            className="mt-8 w-full bg-[#c9a775] py-3 text-xs tracking-[.16em] text-black"
            onClick={() => auth.setAuthOpen(true)}
          >
            GİRİŞ YAP
          </button>
          <Link href="/" className="mt-4 block text-xs text-white/45 underline">
            Mağazaya dön
          </Link>
        </div>
      </div>
    );
  }

  if (auth.user.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f0e0d] px-5 text-white">
        <div className="max-w-md border border-white/10 bg-[#161513] p-8 text-center">
          <p className="text-[10px] tracking-[.28em] text-[#c9a775]">BEE PANEL</p>
          <h1 className="mt-4 font-serif text-4xl">Yetki yok</h1>
          <p className="mt-4 text-sm leading-6 text-white/55">
            Bu hesap admin değil. Supabase’de{" "}
            <code className="text-[#c9a775]">profiles.role = &apos;admin&apos;</code> yapıp tekrar giriş yap.
          </p>
          <p className="mt-3 text-xs text-white/35">{auth.user.email}</p>
          <Link href="/" className="mt-8 inline-block border border-white/20 px-6 py-3 text-xs tracking-[.14em]">
            MAĞAZAYA DÖN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3efe6] text-[#141312]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-black/10 bg-[#141312] text-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center justify-between px-5 py-5 lg:block">
            <div>
              <p className="font-serif text-2xl tracking-[.12em]">BEE</p>
              <p className="mt-1 text-[10px] tracking-[.2em] text-[#c9a775]">YÖNETİM PANELİ</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] tracking-[.14em] text-white/50 lg:mt-6"
            >
              <Store size={14} /> MAĞAZA
            </Link>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
            {nav.map((item) => {
              const active =
                "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 whitespace-nowrap px-3 py-3 text-xs tracking-[.12em] transition ${
                    active ? "bg-white text-black" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden border-t border-white/10 px-5 py-5 lg:block">
            <p className="truncate text-xs text-white/70">{auth.user.name}</p>
            <p className="truncate text-[10px] text-white/35">{auth.user.email}</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[.14em] text-white/50 hover:text-white"
              onClick={() => {
                void auth.logout();
                toast.message("Çıkış yapıldı");
              }}
            >
              <LogOut size={14} /> ÇIKIŞ
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-black/10 bg-[#faf8f3]/90 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShoppingBag size={14} />
              <span>Bee Kozmetik operasyon</span>
            </div>
            <div className="flex items-center gap-3 lg:hidden">
              <span className="max-w-[10rem] truncate text-[10px] text-neutral-500">{auth.user.email}</span>
              <button type="button" className="text-[10px] tracking-wider underline" onClick={() => void auth.logout()}>
                Çıkış
              </button>
            </div>
          </header>
          <div className="px-5 py-8 lg:px-10 lg:py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
