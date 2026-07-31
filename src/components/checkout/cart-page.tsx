"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useShop } from "@/context/shop-context";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/contact";

export function CartPageClient() {
  const shop = useShop();
  const subtotal = shop.cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (!shop.cart.length) {
    return (
      <div className="border border-black/10 bg-white/50 px-8 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 text-neutral-400" size={36} strokeWidth={1} />
        <p className="font-serif text-3xl">Sepetiniz henüz boş</p>
        <Link href="/urunler" className="btn-dark mt-8 inline-flex">ÜRÜNLERE GİT</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
      <div className="space-y-5">
        {shop.cart.map((item) => (
          <article key={`${item.product.id}-${item.size}`} className="flex gap-5 border border-black/10 bg-white/50 p-4 md:p-5">
            <div className="relative h-32 w-28 shrink-0 overflow-hidden bg-[#f1eee7]">
              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="112px" />
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-[10px] tracking-[.18em] text-neutral-500">{item.product.brand}</p>
              <p className="font-serif text-2xl">{item.product.name}</p>
              <p className="text-xs text-neutral-500">{item.size} ml</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                <div className="flex items-center border border-black/15">
                  <button aria-label="Adedi azalt" className="p-2" onClick={() => shop.updateQuantity(item.product.id, item.size, item.quantity - 1)}><Minus size={12} /></button>
                  <span className="w-8 text-center text-xs">{item.quantity}</span>
                  <button aria-label="Adedi artır" className="p-2" onClick={() => shop.updateQuantity(item.product.id, item.size, item.quantity + 1)}><Plus size={12} /></button>
                </div>
                <b>{formatPrice(item.product.salePrice * item.quantity)}</b>
                <button aria-label="Ürünü sil" onClick={() => shop.removeFromCart(item.product.id, item.size)}><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit border border-black/10 bg-[#141312] p-6 text-white md:p-8">
        <p className="text-[10px] tracking-[.28em] text-[#c9a775]">ÖZET</p>
        <h2 className="mt-2 font-serif text-3xl">Toplam</h2>
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><b>{formatPrice(subtotal)}</b></div>
          <div className="flex justify-between text-white/70"><span>Kargo</span><b>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</b></div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-base"><span>Genel toplam</span><b>{formatPrice(total)}</b></div>
        </div>
        <Link href="/odeme" className="btn-dark mt-8 flex w-full bg-white !text-black hover:!bg-[#c9a775]">ÖDEMEYE GEÇ</Link>
        <Link href="/urunler" className="mt-3 block text-center text-xs tracking-wider text-white/70 underline">Alışverişe devam</Link>
      </aside>
    </div>
  );
}
