"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { TURKEY_CITIES } from "@/data/cities";
import { formatPrice } from "@/data/products";
import { useAuth } from "@/context/auth-context";
import { useShop } from "@/context/shop-context";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/contact";

type Step = "address" | "pay";

export function CheckoutForm() {
  const auth = useAuth();
  const shop = useShop();
  const [step, setStep] = useState<Step>("address");
  const [busy, setBusy] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutHtml || step !== "pay") return;
    const container = document.getElementById("iyzico-checkout-form");
    if (!container) return;
    container.innerHTML = checkoutHtml;
    container.querySelectorAll("script").forEach((oldScript) => {
      const script = document.createElement("script");
      if (oldScript.src) script.src = oldScript.src;
      else script.textContent = oldScript.textContent;
      document.body.appendChild(script);
      oldScript.remove();
    });
  }, [checkoutHtml, step]);

  const [fullName, setFullName] = useState(auth.user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(auth.user?.email ?? "");
  const [city, setCity] = useState("Tekirdağ");
  const [district, setDistrict] = useState("Süleymanpaşa");
  const [addressLine, setAddressLine] = useState("");
  const [note, setNote] = useState("");

  const subtotal = useMemo(
    () => shop.cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0),
    [shop.cart],
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const ensureAuth = () => {
    if (!auth.user) {
      auth.setAuthOpen(true);
      toast.error("Ödeme için giriş yapmalısınız.");
      return false;
    }
    return true;
  };

  const onSubmitAddress = async (event: FormEvent) => {
    event.preventDefault();
    if (!ensureAuth()) return;
    if (!shop.cart.length) {
      toast.error("Sepetiniz boş.");
      return;
    }

    setBusy(true);
    setConfigMessage(null);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: shop.cart.map((item) => ({
            productId: item.product.id,
            size: item.size,
            quantity: item.quantity,
          })),
          address: { fullName, phone, email, city, district, addressLine, note },
          idempotencyKey: typeof crypto !== "undefined" ? crypto.randomUUID() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sipariş oluşturulamadı.");
        return;
      }

      setOrderNumber(data.orderNumber);
      if (data.requiresPaymentConfig || !data.payment?.checkoutFormContent) {
        setConfigMessage(
          data.message ||
            "Sipariş awaiting_payment olarak oluşturuldu. iyzico sandbox anahtarları eklenmeden kart ödemesi başlatılmaz.",
        );
        setStep("pay");
        return;
      }

      setCheckoutHtml(data.payment.checkoutFormContent);
      setStep("pay");
    } catch {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  if (!shop.cart.length && step === "address") {
    return (
      <div className="border border-black/10 bg-white/50 px-8 py-16 text-center">
        <p className="font-serif text-3xl">Sepetiniz boş</p>
        <Link href="/urunler" className="btn-dark mt-8 inline-flex">ALIŞVERİŞE BAŞLA</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
      <div>
        {step === "address" && (
          <form onSubmit={onSubmitAddress} className="space-y-5 border border-black/10 bg-white/40 p-6 md:p-8">
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">TESLİMAT</p>
            <h2 className="font-serif text-3xl">Teslimat bilgileri</h2>
            <p className="text-sm text-neutral-600">Kart bilgileri bu formda istenmez. Ödeme yalnızca iyzico güvenli formunda alınır.</p>

            <label className="block text-[10px] tracking-widest text-neutral-500">AD SOYAD
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-[10px] tracking-widest text-neutral-500">TELEFON
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-[10px] tracking-widest text-neutral-500">İL
                <select required value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black">
                  {TURKEY_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block text-[10px] tracking-widest text-neutral-500">İLÇE
                <input required value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
            </div>
            <label className="block text-[10px] tracking-widest text-neutral-500">ADRES
              <textarea required rows={3} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <label className="block text-[10px] tracking-widest text-neutral-500">SİPARİŞ NOTU
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <button disabled={busy} className="btn-dark w-full md:w-auto">
              {busy ? "HAZIRLANIYOR..." : "GÜVENLİ ÖDEMEYE GEÇ"}
            </button>
          </form>
        )}

        {step === "pay" && (
          <div className="border border-black/10 bg-white/40 p-6 md:p-8">
            <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖDEME</p>
            <h2 className="mt-2 font-serif text-3xl">Güvenli ödeme</h2>
            {orderNumber && <p className="mt-2 text-sm text-neutral-600">Sipariş no: {orderNumber}</p>}
            {configMessage ? (
              <div className="mt-6 space-y-4 border border-[#956f42]/30 bg-[#956f42]/8 p-5 text-sm leading-6 text-[#4a3520]">
                <p>{configMessage}</p>
                <p>Sipariş veritabanında <b>awaiting_payment</b> durumunda bekliyor. Sahte başarılı ödeme oluşturulmadı.</p>
                <Link href="/hesabim/siparislerim" className="btn-dark inline-flex">SİPARİŞLERİME GİT</Link>
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm text-neutral-600">
                  Kart numarası, CVC ve 3D Secure kodu yalnızca iyzico formunda girilir; sitemizde saklanmaz.
                </p>
                <div id="iyzico-checkout-form" className="mt-6 min-h-[320px]" />
              </>
            )}
          </div>
        )}
      </div>

      <aside className="h-fit border border-black/10 bg-[#141312] p-6 text-white md:p-8">
        <p className="text-[10px] tracking-[.28em] text-[#c9a775]">ÖZET</p>
        <h3 className="mt-2 font-serif text-3xl">Sipariş özeti</h3>
        <ul className="mt-6 space-y-4 text-sm">
          {shop.cart.map((item) => (
            <li key={`${item.product.id}-${item.size}`} className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span>{item.product.brand} {item.product.name} · {item.size} ml × {item.quantity}</span>
              <b>{formatPrice(item.product.salePrice * item.quantity)}</b>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><b>{formatPrice(subtotal)}</b></div>
          <div className="flex justify-between text-white/70"><span>Kargo</span><b>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</b></div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-base"><span>Toplam</span><b>{formatPrice(total)}</b></div>
        </div>
        <p className="mt-5 text-xs leading-5 text-white/55">
          Gösterilen tutar bilgilendirme amaçlıdır. Kesin tutar sunucuda güncel ürün fiyatlarıyla yeniden hesaplanır.
        </p>
      </aside>
    </div>
  );
}
