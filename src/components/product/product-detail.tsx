"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronRight, Heart, Minus, PackageCheck, Plus, ShieldCheck, Star } from "lucide-react";
import { formatPrice, products } from "@/data/products";
import type { Product } from "@/types/product";
import { useShop } from "@/context/shop-context";
import { ProductCard } from "./product-card";

export function ProductDetail({ product }: { product: Product }) {
  const [image, setImage] = useState(product.images[0]);
  const [size, setSize] = useState(product.sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const shop = useShop();
  const favorite = shop.favorites.includes(product.id);
  const discount = Math.round((1 - product.salePrice / product.price) * 100);
  const similar = products.filter((p) => p.id !== product.id && (p.scentFamily === product.scentFamily || p.category === product.category)).slice(0, 4);

  return (
    <main>
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
        <nav aria-label="Sayfa yolu" className="flex items-center gap-1 text-[10px] text-neutral-500"><Link href="/">Ana Sayfa</Link><ChevronRight size={11} /><Link href="/urunler">Parfümler</Link><ChevronRight size={11} /><span>{product.name}</span></nav>
        <div className="mt-7 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div className="grid gap-3 md:grid-cols-[90px_1fr]">
            <div className="order-2 flex gap-3 md:order-1 md:flex-col">{product.images.map((src) => <button aria-label="Ürün görselini göster" onClick={() => setImage(src)} key={src} className={`relative aspect-square w-20 overflow-hidden border ${image === src ? "border-black" : "border-transparent"}`}><Image src={src} alt="" fill className="object-cover" sizes="90px" /></button>)}</div>
            <div className="relative order-1 aspect-[4/4.5] overflow-hidden bg-[#ede9e1] md:order-2"><Image src={image} alt={`${product.brand} ${product.name}`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" /><span className="absolute left-4 top-4 bg-black px-3 py-1.5 text-[10px] text-white">-%{discount}</span></div>
          </div>
          <section className="lg:py-5">
            <p className="text-[10px] tracking-[.25em] text-[#927048]">{product.brand}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{product.name}</h1>
            <p className="mt-2 text-sm text-neutral-500">{product.category} · Eau de Parfum</p>
            <div className="mt-5 flex items-center gap-2"><span className="flex gap-0.5 text-[#ad824b]">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="currentColor" />)}</span><span className="text-xs">{product.rating} ({product.reviewCount} yorum)</span></div>
            <div className="mt-7 flex items-baseline gap-3"><b className="text-2xl">{formatPrice(product.salePrice)}</b><span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span></div>
            <div className="my-8 h-px bg-black/10" />
            <div className="flex justify-between text-xs"><b>BOYUT SEÇİN</b><button className="underline">Boyut rehberi</button></div>
            <div className="mt-4 grid grid-cols-3 gap-2">{product.sizes.map((value) => <button key={value} onClick={() => setSize(value)} className={`border py-3 text-sm transition ${size === value ? "border-black bg-black text-white" : "border-black/15 hover:border-black"}`}>{value} ml</button>)}</div>
            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-black/20"><button aria-label="Adedi azalt" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4"><Minus size={14} /></button><span className="w-8 text-center text-sm">{quantity}</span><button aria-label="Adedi artır" onClick={() => setQuantity(quantity + 1)} className="p-4"><Plus size={14} /></button></div>
              <button disabled={!product.stock} onClick={() => shop.addToCart(product, size, quantity)} className="flex-1 bg-black px-5 py-4 text-xs tracking-[.16em] text-white disabled:bg-neutral-400">{product.stock ? "SEPETE EKLE" : "STOKTA YOK"}</button>
              <button aria-label="Favorilere ekle" onClick={() => shop.toggleFavorite(product.id)} className="border border-black/20 p-4"><Heart fill={favorite ? "currentColor" : "none"} /></button>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-emerald-800"><Check size={14} /> {product.stock ? `Stokta · ${product.stock} adet` : "Tükendi"}</div>
            <div className="mt-7 grid grid-cols-2 gap-3 border-y border-black/10 py-5 text-xs"><p className="flex items-center gap-2"><PackageCheck strokeWidth={1.3} /> Tahmini teslimat: 1–3 iş günü</p><p className="flex items-center gap-2"><ShieldCheck strokeWidth={1.3} /> Orijinal ürün garantisi</p></div>
            <p className="mt-7 text-sm leading-7 text-neutral-600">{product.description}</p>
          </section>
        </div>
      </div>
      <section className="mt-20 bg-[#ebe5da] py-20"><div className="mx-auto max-w-5xl px-5 text-center"><p className="text-[10px] tracking-[.3em] text-[#8d693e]">KOKU PİRAMİDİ</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Kokunun Katmanları</h2><div className="mt-12 grid gap-8 md:grid-cols-3">{[["Üst Notalar", product.topNotes], ["Orta Notalar", product.heartNotes], ["Alt Notalar", product.baseNotes]].map(([title, notes], i)=><div key={title as string} className="relative"><div className="mx-auto mb-5 grid h-16 w-16 place-content-center rounded-full border border-[#a98555] font-serif text-2xl">{i+1}</div><h3 className="font-serif text-2xl">{title as string}</h3><p className="mt-2 text-sm text-neutral-600">{(notes as string[]).join(", ")}</p></div>)}</div><div className="mt-12 grid gap-4 border-t border-black/10 pt-8 text-left md:grid-cols-2"><div><b className="text-xs tracking-widest">KOKU AİLESİ</b><p className="mt-2 text-sm">{product.scentFamily}</p></div><div><b className="text-xs tracking-widest">KULLANIM ÖNERİSİ</b><p className="mt-2 text-sm">Temiz cilde, nabız noktalarına 15–20 cm uzaktan uygulayın.</p></div></div></div></section>
      <section className="section-shell"><p className="text-center text-[10px] tracking-[.28em] text-[#956f42]">SİZİN İÇİN SEÇTİK</p><h2 className="mt-3 text-center font-serif text-4xl md:text-5xl">Benzer Parfümler</h2><div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">{similar.map((item)=><ProductCard product={item} key={item.id} />)}</div></section>
      <section className="mx-auto max-w-[1500px] px-5 pb-20 lg:px-8"><h2 className="font-serif text-3xl">Son Görüntülenenler</h2><div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">{products.filter((p)=>p.id!==product.id).slice(-3).map((item)=><ProductCard product={item} compact key={item.id} />)}</div></section>
    </main>
  );
}
