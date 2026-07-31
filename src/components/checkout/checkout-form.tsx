"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { TURKEY_CITIES } from "@/data/cities";
import { formatPrice } from "@/data/products";
import { useAuth } from "@/context/auth-context";
import { useShop } from "@/context/shop-context";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/contact";
import {
  DEFAULT_INSTALLMENT_PLANS,
  quoteInstallment,
  type InstallmentQuote,
} from "@/lib/payments/installments";

type Step = "address" | "pay";

export function CheckoutForm() {
  const auth = useAuth();
  const shop = useShop();
  const [step, setStep] = useState<Step>("address");
  const [busy, setBusy] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [configMessage, setConfigMessage] = useState<string | null>(null);
  const [installmentCount, setInstallmentCount] = useState(1);
  const [quotes, setQuotes] = useState<InstallmentQuote[]>([]);

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
  const cashTotal = subtotal + shipping;

  const selectedQuote = useMemo(() => {
    const fromApi = quotes.find((q) => q.count === installmentCount);
    if (fromApi) return fromApi;
    const plan = DEFAULT_INSTALLMENT_PLANS.find((p) => p.count === installmentCount) ?? DEFAULT_INSTALLMENT_PLANS[0];
    return quoteInstallment(cashTotal, plan);
  }, [quotes, installmentCount, cashTotal]);

  useEffect(() => {
    if (cashTotal <= 0) {
      setQuotes([]);
      return;
    }
    let active = true;
    void fetch("/api/checkout/installments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cashTotal }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (active) setQuotes(data.quotes ?? []);
      })
      .catch(() => {
        if (active) {
          setQuotes(DEFAULT_INSTALLMENT_PLANS.map((p) => quoteInstallment(cashTotal, p)));
        }
      });
    return () => {
      active = false;
    };
  }, [cashTotal]);

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

  const ensureAuth = () =>
    auth.requireAuth("Satın alma için giriş yapın veya kayıt olun.");

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
          preferredInstallment: installmentCount,
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
            "iyzico sandbox anahtarları eklenmeden kart formu açılamaz. Anahtarlar gelince Trendyol gibi bu sayfada kart alanları görünür.",
        );
        setStep("pay");
        return;
      }

      setCheckoutHtml(data.payment.checkoutFormContent);
      setStep("pay");
      toast.success("Kart formu hazır. Bilgilerinizi güvenli alanda girin.");
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
    <div className="space-y-8">
      <ol className="grid gap-3 md:grid-cols-3">
        {(
          [
            { n: "1", label: "Teslimat", active: step === "address" },
            { n: "2", label: "Taksit & özet", active: true },
            { n: "3", label: "Kart bilgileri", active: step === "pay" },
          ] as const
        ).map((item) => (
          <li
            key={item.label}
            className={`flex items-center gap-3 border px-4 py-3 text-sm ${item.active ? "border-black bg-white" : "border-black/10 text-neutral-400"}`}
          >
            <span className="grid h-7 w-7 place-items-center border border-current text-[11px]">{item.n}</span>
            {item.label}
          </li>
        ))}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div className="space-y-6">
          {step === "address" && (
            <form onSubmit={onSubmitAddress} className="space-y-5 border border-black/10 bg-white/50 p-6 md:p-8">
              <p className="text-[10px] tracking-[.28em] text-[#956f42]">TESLİMAT</p>
              <h2 className="font-serif text-3xl">Teslimat bilgileri</h2>

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

              <div className="border border-black/10 bg-[#f7f4ed] p-5">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <p className="text-[10px] tracking-[.2em] text-[#956f42]">TAKSİT SEÇİMİ</p>
                </div>
                <p className="mt-2 text-xs text-neutral-600">Seçince toplam ve aylık tutar anında güncellenir.</p>
                <div className="mt-4 grid gap-2">
                  {(quotes.length ? quotes : DEFAULT_INSTALLMENT_PLANS.map((p) => quoteInstallment(cashTotal, p))).map((quote) => {
                    const active = installmentCount === quote.count;
                    return (
                      <button
                        key={quote.count}
                        type="button"
                        onClick={() => setInstallmentCount(quote.count)}
                        className={`flex items-center justify-between border px-4 py-3 text-left text-sm transition ${active ? "border-black bg-white" : "border-black/10 bg-transparent hover:border-black/30"}`}
                      >
                        <span>
                          <b>{quote.label}</b>
                          {!quote.isInterestFree && (
                            <span className="ml-2 text-xs text-[#956f42]">+%{quote.interestRatePercent} vade farkı</span>
                          )}
                          {quote.isInterestFree && quote.count > 1 && (
                            <span className="ml-2 text-xs text-emerald-700">vade farksız</span>
                          )}
                        </span>
                        <span className="text-right text-xs">
                          {quote.count === 1 ? (
                            <b>{formatPrice(quote.payableTotal)}</b>
                          ) : (
                            <>
                              <b>{formatPrice(quote.monthlyAmount)} / ay</b>
                              <span className="mt-0.5 block text-neutral-500">toplam {formatPrice(quote.payableTotal)}</span>
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button disabled={busy} className="btn-dark w-full">
                {busy ? "ÖDEME HAZIRLANIYOR..." : "KART BİLGİLERİNE GEÇ"}
              </button>
              <p className="flex items-center gap-2 text-xs text-neutral-500">
                <Lock size={14} /> Kart no, SKT, CVC ve 3D şifre sonraki adımda güvenli alanda girilir.
              </p>
            </form>
          )}

          {step === "pay" && (
            <div className="border border-black/10 bg-white/50 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[.28em] text-[#956f42]">KART BİLGİLERİ</p>
                  <h2 className="mt-2 font-serif text-3xl">Güvenli ödeme</h2>
                  {orderNumber && <p className="mt-2 text-sm text-neutral-600">Sipariş no: {orderNumber}</p>}
                </div>
                <p className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-[10px] tracking-[.14em]">
                  <ShieldCheck size={14} /> 3D SECURE
                </p>
              </div>

              <div className="mt-5 grid gap-2 border border-black/10 bg-[#f7f4ed] p-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-[10px] tracking-widest text-neutral-500">TAKSİT</p>
                  <p className="mt-1 font-medium">{selectedQuote.label}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-neutral-500">AYLIK</p>
                  <p className="mt-1 font-medium">
                    {selectedQuote.count === 1 ? "—" : formatPrice(selectedQuote.monthlyAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-neutral-500">ÖDENECEK TOPLAM</p>
                  <p className="mt-1 font-medium">{formatPrice(selectedQuote.payableTotal)}</p>
                </div>
              </div>

              {configMessage ? (
                <div className="mt-6 space-y-4 border border-[#956f42]/35 bg-[#956f42]/10 p-5 text-sm leading-6 text-[#4a3520]">
                  <p className="font-medium">Kart formu henüz açılamıyor</p>
                  <p>
                    Trendyol / Yemeksepeti’nde gördüğün kart alanları aslında ödeme firmasının güvenli kutusudur.
                    Bizde de aynı şekilde <b>iyzico Checkout Form</b> bu kutunun içinde açılır.
                  </p>
                  <p>{configMessage}</p>
                  <p>
                    `.env.local` içine <b>IYZICO_API_KEY</b> ve <b>IYZICO_SECRET_KEY</b> (sandbox) ekleyip
                    `npm run dev` yeniden başlatınca aşağıda kart no / SKT / CVC / taksit / 3D alanları görünür.
                  </p>
                  <Link href="/hesabim/siparislerim" className="btn-dark inline-flex">SİPARİŞLERİME GİT</Link>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="mb-3 text-sm text-neutral-600">
                    Kart numarası, son kullanma tarihi, CVC ve 3D Secure şifresi aşağıdaki güvenli alanda girilir.
                    Bee sunucularına kart verisi gelmez.
                  </p>
                  <div className="overflow-hidden border border-black/15 bg-white">
                    <div className="flex items-center gap-2 border-b border-black/10 bg-[#141312] px-4 py-3 text-xs tracking-[.16em] text-white">
                      <Lock size={14} className="text-[#c9a775]" />
                      GÜVENLİ ÖDEME ALANI · IYZICO
                    </div>
                    <div id="iyzico-checkout-form" className="min-h-[420px] p-3 md:p-4" />
                  </div>
                </div>
              )}

              <button type="button" className="mt-5 text-xs underline" onClick={() => setStep("address")}>
                ← Teslimat bilgilerine dön
              </button>
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
            <div className="flex justify-between text-white/70"><span>Peşin tutar</span><b>{formatPrice(cashTotal)}</b></div>
            {!selectedQuote.isInterestFree && (
              <div className="flex justify-between text-[#c9a775]">
                <span>Vade farkı (%{selectedQuote.interestRatePercent})</span>
                <b>+{formatPrice(selectedQuote.interestAmount)}</b>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-3 text-base">
              <span>{selectedQuote.count === 1 ? "Ödenecek" : `${selectedQuote.count} taksit toplam`}</span>
              <b>{formatPrice(selectedQuote.payableTotal)}</b>
            </div>
            {selectedQuote.count > 1 && (
              <div className="flex justify-between text-[#c9a775]">
                <span>Aylık ödeme</span>
                <b>{formatPrice(selectedQuote.monthlyAmount)}</b>
              </div>
            )}
          </div>
          <p className="mt-5 text-xs leading-5 text-white/55">
            Taksit seçince tutar burada güncellenir. Kart formundaki banka tablosu kesin kayıttır.
          </p>
        </aside>
      </div>
    </div>
  );
}
