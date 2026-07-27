"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, CreditCard, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { useShop } from "@/context/shop-context";
import {
  BANK_ACCOUNT,
  CONTACT_EMAIL,
  FREE_SHIPPING_THRESHOLD,
  INSTALLMENT_OPTIONS,
  whatsappLink,
} from "@/lib/contact";

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
  const [payment, setPayment] = useState<"havale" | "whatsapp">("havale");
  const [installment, setInstallment] = useState<(typeof INSTALLMENT_OPTIONS)[number]["id"]>("pesin");
  const [copied, setCopied] = useState(false);
  const [kvkk, setKvkk] = useState(false);

  const subtotal = shop.cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;
  const selectedPlan = INSTALLMENT_OPTIONS.find((item) => item.id === installment)!;
  const installmentAmount = installment === "pesin" ? total : Math.ceil(total / Number(installment));

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
      `Ödeme yöntemi: ${payment === "havale" ? "Havale / EFT" : "WhatsApp yönlendirme"}`,
      `Ödeme planı: ${selectedPlan.label}${installment !== "pesin" ? ` (yaklaşık ${formatPrice(installmentAmount)} x${installment})` : ""}`,
      `IBAN: ${BANK_ACCOUNT.iban}`,
      `Hesap: ${BANK_ACCOUNT.holder} / ${BANK_ACCOUNT.bank}`,
      "",
      `Ad Soyad: ${name || "-"}`,
      `Telefon: ${phone || "-"}`,
      `Şehir: ${city}`,
      `Adres: ${address || "-"}`,
      note ? `Not: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [shop.cart, subtotal, shipping, total, payment, selectedPlan, installment, installmentAmount, name, phone, city, address, note]);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT.iban.replace(/\s/g, ""));
      setCopied(true);
      toast.success("IBAN kopyalandı");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("IBAN kopyalanamadı");
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!kvkk) {
      toast.error("Sipariş için KVKK ve satış koşullarını onaylayın.");
      return;
    }
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
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <form onSubmit={submit} className="space-y-6">
        <section className="border border-black/10 bg-white p-7 md:p-10">
          <p className="text-[10px] tracking-[.25em] text-[#956f42]">TESLİMAT</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Teslimat bilgileri</h2>
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
        </section>

        <section className="border border-black/10 bg-white p-7 md:p-10">
          <p className="text-[10px] tracking-[.25em] text-[#956f42]">ÖDEME SİSTEMİ</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">IBAN ve taksit</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Online kart ödeme yok. Havale/EFT ile ödersiniz; taksit seçenekleri WhatsApp üzerinden planlanır.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setPayment("havale")} className={`border px-4 py-4 text-left text-sm ${payment === "havale" ? "border-black bg-black text-white" : "border-black/15"}`}>
              <b className="block text-xs tracking-widest">HAVALE / EFT</b>
              <span className="mt-1 block text-xs opacity-70">IBAN’a ödeme</span>
            </button>
            <button type="button" onClick={() => setPayment("whatsapp")} className={`border px-4 py-4 text-left text-sm ${payment === "whatsapp" ? "border-black bg-black text-white" : "border-black/15"}`}>
              <b className="block text-xs tracking-widest">WHATSAPP</b>
              <span className="mt-1 block text-xs opacity-70">Ödeme yönlendirmesi</span>
            </button>
          </div>

          <div className="mt-6 border border-black/10 bg-[#f7f4ed] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-widest text-neutral-500">BANKA / HESAP</p>
                <p className="mt-2 font-serif text-2xl">{BANK_ACCOUNT.holder}</p>
                <p className="mt-1 text-sm text-neutral-600">{BANK_ACCOUNT.bank}</p>
              </div>
              <CreditCard className="text-[#9c7749]" strokeWidth={1.2} />
            </div>
            <p className="mt-5 text-[10px] tracking-widest text-neutral-500">IBAN</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code className="font-serif text-lg tracking-wide md:text-xl">{BANK_ACCOUNT.iban}</code>
              <button type="button" onClick={copyIban} className="inline-flex items-center gap-2 border border-black/20 px-3 py-2 text-[10px] tracking-wider">
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "KOPYALANDI" : "KOPYALA"}
              </button>
            </div>
            <p className="mt-3 text-xs text-neutral-500">Açıklamaya ad-soyad ve telefon yazın. IBAN’ı kendi hesabınızla güncellemeyi unutmayın.</p>
          </div>

          <p className="mt-8 text-[10px] tracking-widest text-neutral-500">ÖDEME PLANI / TAKSİT</p>
          <div className="mt-3 grid gap-3">
            {INSTALLMENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setInstallment(option.id)}
                className={`flex items-center justify-between border px-4 py-4 text-left ${installment === option.id ? "border-black bg-[#f7f4ed]" : "border-black/15"}`}
              >
                <span>
                  <b className="block font-serif text-xl">{option.label}</b>
                  <span className="text-xs text-neutral-500">{option.note}</span>
                </span>
                <span className="text-sm">
                  {option.id === "pesin" ? formatPrice(total) : `${formatPrice(Math.ceil(total / Number(option.id)))} x${option.id}`}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="border border-black/10 bg-white p-7 md:p-10">
          <label className="flex gap-3 text-xs leading-5 text-neutral-600">
            <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} className="mt-0.5 accent-black" />
            <span>
              <Link href="/kvkk" className="underline" target="_blank">KVKK</Link>,{" "}
              <Link href="/mesafeli-satis" className="underline" target="_blank">Mesafeli Satış</Link> ve{" "}
              <Link href="/gizlilik" className="underline" target="_blank">Gizlilik</Link> metinlerini okudum, siparişi onaylıyorum.
            </span>
          </label>
          <button type="submit" className="btn-dark mt-6 w-full sm:w-auto">
            <MessageCircle size={16} /> WHATSAPP İLE SİPARİŞİ GÖNDER
          </button>
          <p className="mt-4 text-xs text-neutral-500">Yardım: <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a></p>
        </section>
      </form>

      <aside className="h-fit border border-black/10 bg-[#f7f4ed] p-7 md:sticky md:top-28 md:p-8">
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
          <div className="flex justify-between"><span>Plan</span><b>{selectedPlan.label}</b></div>
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
