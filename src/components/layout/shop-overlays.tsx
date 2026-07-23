"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { formatPrice, products } from "@/data/products";
import { useShop } from "@/context/shop-context";

function useEscape(close: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, close]);
}

export function ShopOverlays() {
  const shop = useShop();
  const [query, setQuery] = useState("");
  const [quickSize, setQuickSize] = useState(50);
  useEscape(() => shop.setCartOpen(false), shop.cartOpen);
  useEscape(() => shop.setSearchOpen(false), shop.searchOpen);
  useEscape(() => shop.setQuickProduct(null), Boolean(shop.quickProduct));

  const subtotal = shop.cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const results = query.trim()
    ? products.filter((product) =>
        `${product.brand} ${product.name}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")),
      )
    : products.slice(0, 4);

  return (
    <>
      {shop.cartOpen && (
        <div className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm" onMouseDown={() => shop.setCartOpen(false)}>
          <aside
            aria-label="Sepet"
            className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fbfaf7] shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div>
                <p className="font-serif text-2xl">Sepetiniz</p>
                <p className="text-xs text-neutral-500">{shop.cart.length} ürün</p>
              </div>
              <button aria-label="Sepeti kapat" onClick={() => shop.setCartOpen(false)}><X /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {shop.cart.length === 0 ? (
                <div className="grid h-full place-content-center text-center text-neutral-500">
                  <ShoppingBag className="mx-auto mb-4" size={32} strokeWidth={1} />
                  <p>Sepetiniz henüz boş.</p>
                </div>
              ) : shop.cart.map((item) => (
                <article key={`${item.product.id}-${item.size}`} className="flex gap-4 border-b border-black/10 pb-5">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#f1eee7]">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] tracking-[.18em] text-neutral-500">{item.product.brand}</p>
                    <p className="font-serif text-lg">{item.product.name}</p>
                    <p className="text-xs text-neutral-500">{item.size} ml</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-black/15">
                        <button aria-label="Adedi azalt" className="p-2" onClick={() => shop.updateQuantity(item.product.id, item.size, item.quantity - 1)}><Minus size={12} /></button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button aria-label="Adedi artır" className="p-2" onClick={() => shop.updateQuantity(item.product.id, item.size, item.quantity + 1)}><Plus size={12} /></button>
                      </div>
                      <b className="text-sm">{formatPrice(item.product.salePrice * item.quantity)}</b>
                      <button aria-label="Ürünü sil" onClick={() => shop.removeFromCart(item.product.id, item.size)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="border-t border-black/10 p-6">
              <div className="mb-3 flex justify-between text-sm"><span>Ara toplam</span><b>{formatPrice(subtotal)}</b></div>
              <div className="mb-5 h-1 overflow-hidden rounded bg-black/10"><div className="h-full bg-[#aa8654]" style={{ width: `${Math.min(100, subtotal / 15)}%` }} /></div>
              <p className="mb-4 text-xs text-neutral-500">{subtotal >= 1500 ? "Ücretsiz kargo kazandınız." : `Ücretsiz kargoya ${formatPrice(1500 - subtotal)} kaldı.`}</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="border border-black px-4 py-3 text-xs tracking-wider">SEPETE GİT</button>
                <button className="bg-black px-4 py-3 text-xs tracking-wider text-white">ÖDEMEYE GEÇ</button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {shop.searchOpen && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#f8f5ef]/98 px-5 py-8 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl">
            <div className="flex justify-end"><button aria-label="Aramayı kapat" onClick={() => shop.setSearchOpen(false)}><X size={28} /></button></div>
            <p className="mt-8 text-center text-xs tracking-[.3em] text-[#987448]">LUMÉA ARAMA</p>
            <div className="relative mx-auto mt-5 max-w-3xl border-b border-black">
              <Search className="absolute left-0 top-4" strokeWidth={1.2} />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Parfüm veya marka ara..." className="w-full bg-transparent py-4 pl-10 pr-3 font-serif text-2xl outline-none md:text-4xl" />
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((product) => (
                <Link key={product.id} href={`/urunler/${product.slug}`} onClick={() => shop.setSearchOpen(false)}>
                  <div className="relative aspect-square overflow-hidden bg-white"><Image src={product.images[0]} alt={product.name} fill className="object-cover transition hover:scale-105" sizes="25vw" /></div>
                  <p className="mt-3 text-[10px] tracking-widest text-neutral-500">{product.brand}</p>
                  <p className="font-serif text-lg">{product.name}</p>
                </Link>
              ))}
            </div>
            {results.length === 0 && <p className="py-20 text-center text-neutral-500">Aramanızla eşleşen ürün bulunamadı.</p>}
          </div>
        </div>
      )}

      {shop.quickProduct && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={() => shop.setQuickProduct(null)}>
          <div role="dialog" aria-modal="true" className="relative grid w-full max-w-3xl overflow-hidden bg-[#fbfaf7] md:grid-cols-2" onMouseDown={(e) => e.stopPropagation()}>
            <button aria-label="Hızlı incelemeyi kapat" onClick={() => shop.setQuickProduct(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2"><X size={18} /></button>
            <div className="relative min-h-80 bg-[#eeeae2]"><Image src={shop.quickProduct.images[0]} alt={shop.quickProduct.name} fill className="object-cover" sizes="50vw" /></div>
            <div className="p-8 md:p-10">
              <p className="text-[10px] tracking-[.2em] text-[#987448]">{shop.quickProduct.brand}</p>
              <h2 className="mt-2 font-serif text-3xl">{shop.quickProduct.name}</h2>
              <p className="mt-3 text-xl">{formatPrice(shop.quickProduct.salePrice)}</p>
              <p className="mt-6 text-xs tracking-widest">BOYUT</p>
              <div className="mt-3 flex gap-2">{shop.quickProduct.sizes.map((size) => <button key={size} onClick={() => setQuickSize(size)} className={`border px-4 py-2 text-sm ${quickSize === size ? "border-black bg-black text-white" : "border-black/15"}`}>{size} ml</button>)}</div>
              <button onClick={() => shop.addToCart(shop.quickProduct!, quickSize)} className="mt-8 w-full bg-black py-4 text-xs tracking-[.16em] text-white">SEPETE EKLE</button>
              <Link href={`/urunler/${shop.quickProduct.slug}`} onClick={() => shop.setQuickProduct(null)} className="mt-4 block text-center text-xs underline underline-offset-4">Ürün detayına git</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
