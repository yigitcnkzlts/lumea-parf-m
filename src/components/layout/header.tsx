"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useShop } from "@/context/shop-context";

const notices = [
  "1.500 TL üzeri ücretsiz kargo",
  "WhatsApp ile kolay sipariş",
  "Yurt içi hızlı teslimat",
  "Orijinal ürün garantisi",
];

const links = [
  ["Ana Sayfa", "/"],
  ["Kadın Parfümleri", "/kadin-parfumleri"],
  ["Erkek Parfümleri", "/erkek-parfumleri"],
  ["Unisex", "/unisex"],
  ["Markalar", "/markalar"],
  ["Kampanyalar", "/kampanyalar"],
  ["Hakkımızda", "/hakkimizda"],
  ["İletişim", "/iletisim"],
];

export function Header() {
  const [notice, setNotice] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shop = useShop();
  const auth = useAuth();
  const cartCount = shop.cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const timer = window.setInterval(() => setNotice((value) => (value + 1) % notices.length), 3500);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const openAccount = () => {
    if (auth.user) {
      const leave = window.confirm(`${auth.user.name}, çıkış yapmak ister misiniz?`);
      if (leave) auth.logout();
      return;
    }
    auth.setAuthOpen(true);
  };

  return (
    <>
      <div className="flex h-8 items-center justify-center bg-[#181816] px-4 text-center text-[10px] tracking-[.18em] text-white">
        <span key={notice} className="animate-fade-in">{notices[notice]}</span>
      </div>
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-black/10 bg-[#faf8f3]/95 shadow-sm backdrop-blur-xl" : "border-transparent bg-[#faf8f3]/90"}`}>
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <button aria-label="Menüyü aç" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu /></button>
          <Link href="/" className="font-serif text-2xl tracking-[.08em] md:text-3xl">BEE<span className="ml-1 text-[9px] tracking-[.25em] text-[#9c7749]">PARFÜM</span></Link>
          <nav aria-label="Ana menü" className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {links.map(([label, href]) => <Link key={label} href={href} className="link-line whitespace-nowrap text-[11px] tracking-[.08em]">{label}</Link>)}
          </nav>
          <div className="flex items-center gap-3 md:gap-5">
            <button aria-label="Ara" onClick={() => shop.setSearchOpen(true)}><Search size={20} strokeWidth={1.4} /></button>
            <button aria-label={auth.user ? "Hesabım" : "Giriş yap"} onClick={openAccount} className="relative">
              <UserRound size={20} strokeWidth={1.4} />
              {auth.user && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#9c7749]" />}
            </button>
            <button aria-label="Favoriler" className="relative" onClick={() => shop.setFavoritesOpen(true)}>
              <Heart size={20} strokeWidth={1.4} fill={shop.favorites.length ? "currentColor" : "none"} />
              {shop.favorites.length > 0 && <span className="badge">{shop.favorites.length}</span>}
            </button>
            <button aria-label="Sepet" className="relative" onClick={() => shop.setCartOpen(true)}>
              <ShoppingBag size={20} strokeWidth={1.4} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40" onMouseDown={() => setMobileOpen(false)}>
          <nav className="h-full w-[88%] max-w-sm bg-[#f8f5ef] p-7" onMouseDown={(e) => e.stopPropagation()}>
            <div className="mb-12 flex items-center justify-between"><span className="font-serif text-2xl">BEE</span><button aria-label="Menüyü kapat" onClick={() => setMobileOpen(false)}><X /></button></div>
            <div className="flex flex-col">
              {links.map(([label, href]) => <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="border-b border-black/10 py-4 font-serif text-xl">{label}</Link>)}
              <button onClick={() => { setMobileOpen(false); openAccount(); }} className="border-b border-black/10 py-4 text-left font-serif text-xl">
                {auth.user ? `Hesap · ${auth.user.name}` : "Giriş / Kayıt"}
              </button>
              <button onClick={() => { setMobileOpen(false); shop.setFavoritesOpen(true); }} className="border-b border-black/10 py-4 text-left font-serif text-xl">Favoriler ({shop.favorites.length})</button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
