"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/data/products";
import type { Product } from "@/types/product";
import { useShop } from "@/context/shop-context";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const shop = useShop();
  const favorite = shop.favorites.includes(product.id);
  const discount = Math.round((1 - product.salePrice / product.price) * 100);

  return (
    <article className="product-card group min-w-0">
      <div className={`relative overflow-hidden bg-[#eeeae2] ${compact ? "aspect-[4/4.7]" : "aspect-[4/5]"}`}>
        <Link href={`/urunler/${product.slug}`} className="block h-full">
          <Image src={product.images[0]} alt={`${product.brand} ${product.name}`} fill className="object-cover transition duration-700 group-hover:scale-[1.04] group-hover:opacity-0" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          <Image src={product.images[1]} alt="" fill className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.isBestSeller && <span className="bg-black px-2.5 py-1 text-[9px] tracking-widest text-white">ÇOK SATAN</span>}
          {product.isNew && <span className="bg-[#af8956] px-2.5 py-1 text-[9px] tracking-widest text-white">YENİ</span>}
          {discount > 0 && <span className="bg-white px-2.5 py-1 text-[9px]">-%{discount}</span>}
        </div>
        <button aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"} onClick={() => shop.toggleFavorite(product.id)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 transition hover:scale-105"><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button>
        <div className="absolute inset-x-3 bottom-3 grid translate-y-3 grid-cols-[1fr_auto] gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          <button onClick={() => shop.addToCart(product)} className="flex items-center justify-center gap-2 bg-black px-3 py-3 text-[10px] tracking-wider text-white"><ShoppingBag size={14} /> SEPETE EKLE</button>
          <button aria-label="Hızlı incele" onClick={() => shop.setQuickProduct(product)} className="bg-white p-3"><Eye size={17} /></button>
        </div>
      </div>
      <div className="pt-4">
        <p className="text-[9px] tracking-[.2em] text-neutral-500">{product.brand}</p>
        <Link href={`/urunler/${product.slug}`} className="mt-1 block truncate font-serif text-lg md:text-xl">{product.name}</Link>
        <p className="mt-1 text-[11px] text-neutral-500">{product.category} · {product.scentFamily}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <b>{formatPrice(product.salePrice)}</b>
          {product.price > product.salePrice && <span className="text-xs text-neutral-400 line-through">{formatPrice(product.price)}</span>}
        </div>
        <button onClick={() => shop.addToCart(product)} className="mt-3 w-full border border-black py-2 text-[10px] tracking-wider md:hidden">SEPETE EKLE</button>
      </div>
    </article>
  );
}
