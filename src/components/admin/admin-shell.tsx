"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
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

const nav = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard, exact: true },
  { href: "/admin/siparisler", label: "Siparişler", icon: Package },
  { href: "/admin/stok", label: "Ürün & stok", icon: Boxes },
  { href: "/admin/bildirimler", label: "Bildirimler", icon: Bell },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [configMessage, setConfigMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () =>
    fetch("/api/admin/gate")
      .then(async (res) => {
        const data = await res.json();
        setConfigured(Boolean(data.configured));
        setUnlocked(Boolean(data.unlocked));
        setConfigMessage(data.message ?? null);
      })
      .catch(() => {
        setConfigured(false);
        setUnlocked(false);
      })
      .finally(() => setReady(true));

  useEffect(() => {
    void refresh();
  }, []);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş başarısız");
      setPassword("");
      setUnlocked(true);
      toast.success("Panele giriş yapıldı");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/gate", { method: "DELETE" });
    setUnlocked(false);
    toast.message("Panel oturumu kapandı");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f0e0d] text-white/60">
        Panel yükleniyor…
      </div>
    );
  }

  if (!configured || !unlocked) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f0e0d] px-5 text-white">
        <form onSubmit={onLogin} className="w-full max-w-md border border-white/10 bg-[#161513] p-8">
          <p className="text-[10px] tracking-[.28em] text-[#c9a775]">BEE PANEL</p>
          <h1 className="mt-4 font-serif text-4xl">Şifre ile giriş</h1>
          <p className="mt-4 text-sm leading-6 text-white/55">
            Yönetim paneli yalnızca panel şifresi ile açılır. Müşteri hesabı gerekmez.
          </p>

          {!configured && (
            <p className="mt-4 border border-[#c9a775]/40 bg-[#c9a775]/10 p-3 text-xs text-[#e8d2ad]">
              {configMessage || "ADMIN_PANEL_PASSWORD eksik."}
            </p>
          )}

          <label className="mt-8 block text-[10px] tracking-[.2em] text-white/45">
            PANEL ŞİFRESİ
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#c9a775]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button
            disabled={busy || !configured}
            className="mt-6 w-full bg-[#c9a775] py-3 text-xs tracking-[.16em] text-black disabled:opacity-50"
          >
            {busy ? "KONTROL..." : "GİRİŞ YAP"}
          </button>

          <Link href="/" className="mt-5 block text-center text-xs text-white/40 underline">
            Mağazaya dön
          </Link>
        </form>
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
            <p className="text-xs text-white/70">Panel oturumu</p>
            <p className="text-[10px] text-white/35">Şifre ile korumalı</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[.14em] text-white/50 hover:text-white"
              onClick={() => void onLogout()}
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
            <button type="button" className="text-[10px] tracking-wider underline lg:hidden" onClick={() => void onLogout()}>
              Çıkış
            </button>
          </header>
          <div className="px-5 py-8 lg:px-10 lg:py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
