"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useShop } from "@/context/shop-context";
import { CONTACT_EMAIL, FREE_SHIPPING_THRESHOLD, whatsappLink } from "@/lib/contact";

const cities = [
  "Adana", "Ankara", "Antalya", "Bursa", "İstanbul", "İzmir", "Tekirdağ", "Kocaeli", "Gaziantep", "Konya", "Diğer",
];

export function OrderForm() {
  const shop = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Tekirdağ");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const subtotal = shop.cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const message = useMemo(() => {
    const lines = shop.cart.map(
      (item) => `• ${item.product.brand} ${item.product.name} (${item.size} ml) x${item.quantity} — ${formatPrice(item.product.salePrice * item.quantity)}`,
    );
    return [
      "Merhaba Bee, sipariş vermek istiyorum.",
      "",
      "Ürünler:",
      ...(lines.length ? lines : ["• Sepet boş"]),
      "",
      `Ara toplam: ${formatPrice(subtotal)}`,
      `Kargo: ${shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}`,
      `Toplam: ${formatPrice(total)}`,
      "",
      `Ad Soyad: ${name || "-"}`,
      `Telefon: ${phone || "-"}`,
      `Şehir: ${city}`,
      `Adres: ${address || "-"}`,
      note ? `Not: ${note}` : "",
      "",
      "Ödeme: Havale/EFT veya sizden gelecek yönlendirme.",
    ]
      .filter(Boolean)
      .join("\n");
  }, [shop.cart, subtotal, shipping, total, name, phone, city, address, note]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  if (shop.cart.length === 0) {
    return (
      <div className="border border-black/10 bg-white p-10 text-center">
        <p className="font-serif text-3xl">Sepetiniz boş</p>
        <p className="mt-3 text-sm text-neutral-500">Sipariş için önce ürün ekleyin.</p>
        <Link href="/urunler" className="btn-dark mx-auto mt-8 w-fit">ÜRÜNLERE GİT</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
      <form onSubmit={submit} className="border border-black/10 bg-white p-7 md:p-10">
        <p className="text-[10px] tracking-[.25em] text-[#956f42]">TESLİMAT BİLGİLERİ</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">WhatsApp ile sipariş</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Bilgilerinizi doldurun; WhatsApp üzerinden siparişinizi bize iletin. Ödeme havale/EFT veya yönlendirdiğimiz yöntemle alınır.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="text-[10px] tracking-widest text-neutral-500">AD SOYAD
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          </label>
          <label className="text-[10px] tracking-widest text-neutral-500">TELEFON
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx xxx xx xx" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          </label>
          <label className="text-[10px] tracking-widest text-neutral-500">ŞEHİR
            <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black">
              {cities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">ADRES
            <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          </label>
          <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">SİPARİŞ NOTU (OPSİYONEL)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          </label>
        </div>
        <button type="submit" className="btn-dark mt-8">
          <MessageCircle size={16} /> WHATSAPP İLE SİPARİŞ GÖNDER
        </button>
        <p className="mt-4 text-xs text-neutral-500">
          Yardım: <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
        </p>
      </form>

      <aside className="border border-black/10 bg-[#f7f4ed] p-7 md:p-8">
        <p className="text-[10px] tracking-[.25em] text-[#956f42]">SİPARİŞ ÖZETİ</p>
        <div className="mt-6 space-y-5">
          {shop.cart.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-white">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-widest text-neutral-500">{item.product.brand}</p>
                <p className="font-serif text-lg leading-tight">{item.product.name}</p>
                <p className="mt-1 text-xs text-neutral-500">{item.size} ml · x{item.quantity}</p>
              </div>
              <b className="text-sm">{formatPrice(item.product.salePrice * item.quantity)}</b>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3 border-t border-black/10 pt-5 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><b>{formatPrice(subtotal)}</b></div>
          <div className="flex justify-between"><span>Kargo</span><b>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</b></div>
          <div className="flex justify-between border-t border-black/10 pt-3 text-base"><span>Toplam</span><b>{formatPrice(total)}</b></div>
        </div>
        <p className="mt-5 text-xs leading-6 text-neutral-500">
          {subtotal >= FREE_SHIPPING_THRESHOLD
            ? "Ücretsiz kargo kazandınız."
            : `Ücretsiz kargoya ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} kaldı.`}
        </p>
      </aside>
    </div>
  );
}
