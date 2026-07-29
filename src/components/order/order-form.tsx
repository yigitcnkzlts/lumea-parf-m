"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, Copy, CreditCard, Lock, Package, Truck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { TURKEY_CITIES } from "@/data/cities";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import {
  BANK_ACCOUNT,
  CONTACT_EMAIL,
  FREE_SHIPPING_THRESHOLD,
  INSTALLMENT_OPTIONS,
  SHIPPING_FEE,
  WHATSAPP_DISPLAY,
  hasBankDetails,
} from "@/lib/contact";
import { saveLocalOrder, type PlacedOrder } from "@/lib/orders";
import {
  DeliveryErrors,
  formatTrPhone,
  isDeliveryComplete,
  normalizeTrPhone,
  validateDelivery,
} from "@/lib/validation";

const steps = [
  { id: 1, label: "Teslimat" },
  { id: 2, label: "Ödeme" },
  { id: 3, label: "Onay" },
] as const;

type Step = 1 | 2 | 3;

function fieldClass(error?: string) {
  return `mt-2 w-full border px-4 py-3 text-sm outline-none transition ${
    error ? "border-red-500 focus:border-red-600" : "border-black/15 focus:border-black"
  }`;
}

export function OrderForm() {
  const shop = useShop();
  const auth = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Tekirdağ");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [installment, setInstallment] = useState<(typeof INSTALLMENT_OPTIONS)[number]["id"]>("pesin");
  const [copied, setCopied] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [kvkk, setKvkk] = useState(false);
  const [distance, setDistance] = useState(false);
  const [errors, setErrors] = useState<DeliveryErrors>({});
  const [orderSnapshot, setOrderSnapshot] = useState(shop.cart);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!auth.user || prefilled) return;
    setName((current) => current || auth.user!.name);
    setEmail((current) => current || auth.user!.email);
    setPrefilled(true);
  }, [auth.user, prefilled]);

  const cart = done ? orderSnapshot : shop.cart;
  const subtotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const selectedPlan = INSTALLMENT_OPTIONS.find((item) => item.id === installment)!;
  const showIban = done && hasBankDetails();

  const deliveryInput = useMemo(
    () => ({ name, phone, email, city, district, address, cities: TURKEY_CITIES }),
    [name, phone, email, city, district, address],
  );
  const canGoPayment = isDeliveryComplete(deliveryInput);

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

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrder(true);
      toast.success("Sipariş no kopyalandı");
      window.setTimeout(() => setCopiedOrder(false), 2000);
    } catch {
      toast.error("Kopyalanamadı");
    }
  };

  const clearError = (key: keyof DeliveryErrors) => {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const goPayment = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDelivery(deliveryInput);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Tüm zorunlu alanları doğru doldurun, sonra ödemeye geçin.");
      return;
    }
    setPhone(formatTrPhone(phone));
    setStep(2);
  };

  const goConfirm = () => setStep(3);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.user) {
      toast.error("Sipariş için giriş yapmalısınız.");
      auth.setAuthOpen(true);
      return;
    }
    if (!kvkk || !distance) {
      toast.error("Devam etmek için zorunlu onayları işaretleyin.");
      return;
    }
    const nextErrors = validateDelivery(deliveryInput);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStep(1);
      toast.error("Teslimat bilgileri eksik veya hatalı.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        phone: normalizeTrPhone(phone),
        email: email.trim() || auth.user.email,
        city,
        district: district.trim(),
        address: address.trim(),
        note: note.trim(),
        payment: "havale" as const,
        installmentLabel: selectedPlan.label,
        subtotal,
        shipping,
        total,
        accountEmail: auth.user.email,
        items: shop.cart.map((item) => ({
          brand: item.product.brand,
          name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.product.salePrice,
          lineTotal: item.product.salePrice * item.quantity,
        })),
      };

      const response = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        orderId?: string;
        createdAt?: string;
        order?: PlacedOrder;
        error?: string;
        emailed?: boolean;
      };

      if (!response.ok || !data.ok || !data.orderId || !data.order) {
        throw new Error(data.error || "Sipariş kaydedilemedi.");
      }

      saveLocalOrder(data.order);
      setOrderSnapshot(shop.cart);
      setOrderId(data.orderId);
      shop.clearCart();
      setDone(true);
      toast.success(`Sipariş alındı: ${data.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sipariş tamamlanamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!done && shop.cart.length === 0) {
    return (
      <div className="border border-black/10 bg-white px-8 py-16 text-center">
        <Package className="mx-auto text-[#9c7749]" strokeWidth={1.2} size={36} />
        <p className="mt-5 font-serif text-3xl">Sepetiniz boş</p>
        <p className="mt-3 text-sm text-neutral-500">Sipariş için önce ürün ekleyin.</p>
        <Link href="/urunler" className="btn-dark mx-auto mt-8 w-fit">ÜRÜNLERE GİT</Link>
      </div>
    );
  }

  if (!done && !auth.user) {
    return (
      <div className="border border-black/10 bg-white px-8 py-16 text-center">
        <Lock className="mx-auto text-[#9c7749]" strokeWidth={1.2} size={36} />
        <p className="mt-5 font-serif text-3xl">Sipariş için giriş gerekli</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-500">
          Teslimat ve ödeme adımlarına geçmek için önce giriş yapın veya hesap oluşturun.
          Sepetiniz korunur.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => auth.setAuthOpen(true)} className="btn-dark">
            <UserRound size={16} /> GİRİŞ YAP / KAYIT OL
          </button>
          <Link href="/urunler" className="inline-flex items-center border border-black px-6 py-3 text-xs tracking-[.16em]">
            ALIŞVERİŞE DEVAM
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl border border-black/10 bg-white px-7 py-12 md:px-12">
        <div className="mx-auto grid h-14 w-14 place-content-center rounded-full bg-[#e8f3ea] text-emerald-800">
          <Check size={28} />
        </div>
        <h2 className="mt-6 text-center font-serif text-4xl md:text-5xl">Siparişiniz alındı</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-neutral-600">
          Sipariş siteden kaydedildi. Aşağıdaki hesaba ödeme yaptıktan sonra ürününüz hazırlanır ve kargoya verilir.
        </p>

        <div className="mt-8 flex items-center justify-between gap-3 border border-black/10 bg-[#faf8f3] px-4 py-4">
          <div>
            <p className="text-[10px] tracking-widest text-neutral-500">SİPARİŞ NO</p>
            <p className="mt-1 font-serif text-2xl">{orderId}</p>
          </div>
          <button type="button" onClick={copyOrderId} className="inline-flex items-center gap-2 border border-black/20 px-3 py-2 text-[10px] tracking-wider">
            {copiedOrder ? <Check size={14} /> : <Copy size={14} />} {copiedOrder ? "KOPYALANDI" : "KOPYALA"}
          </button>
        </div>

        <div className="mt-8 space-y-3 border-y border-black/10 py-6 text-sm">
          <div className="flex justify-between"><span>Toplam</span><b>{formatPrice(total)}</b></div>
          <div className="flex justify-between"><span>Ödeme</span><b>Havale / EFT</b></div>
          <div className="flex justify-between"><span>Plan</span><b>{selectedPlan.label}</b></div>
          <div className="flex justify-between"><span>Teslimat</span><b>{district}, {city}</b></div>
        </div>

        <div className="mt-8 border border-black/10 bg-[#f7f4ed] p-6">
          <p className="text-[10px] tracking-[.25em] text-[#956f42]">HAVALE / EFT</p>
          {showIban ? (
            <>
              <p className="mt-3 text-sm text-neutral-600">
                Ödemeyi aşağıdaki hesaba yapın. Açıklamaya <b>sipariş no</b> ve ad soyad yazın.
              </p>
              <p className="mt-5 font-serif text-2xl">{BANK_ACCOUNT.holder}</p>
              <p className="mt-1 text-sm text-neutral-600">{BANK_ACCOUNT.bank}</p>
              <p className="mt-5 text-[10px] tracking-widest text-neutral-500">IBAN</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <code className="font-serif text-lg tracking-wide md:text-xl">{BANK_ACCOUNT.iban}</code>
                <button type="button" onClick={copyIban} className="inline-flex items-center gap-2 border border-black/20 px-3 py-2 text-[10px] tracking-wider">
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "KOPYALANDI" : "KOPYALA"}
                </button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Banka bilgisi yakında sitede görünecek. Şimdilik ödeme talimatı e-posta / telefon ile iletilecek:
              {" "}{CONTACT_EMAIL} · {WHATSAPP_DISPLAY}
            </p>
          )}
          <ol className="mt-5 list-decimal space-y-2 pl-4 text-xs leading-6 text-neutral-600">
            <li>Tutarı havale/EFT ile gönderin.</li>
            <li>Açıklamaya sipariş numaranızı yazın.</li>
            <li>Ödeme görününce sipariş hazırlanır (1–2 iş günü).</li>
            <li>Kargo takip numarası size iletilir.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/hizmetler#takip" className="btn-dark">SİPARİŞ TAKİBİ</Link>
          <Link href="/urunler" className="inline-flex items-center border border-black px-6 py-3 text-xs tracking-[.16em]">ALIŞVERİŞE DEVAM</Link>
        </div>
        <p className="mt-6 text-center text-xs text-neutral-500">Destek: {WHATSAPP_DISPLAY} · {CONTACT_EMAIL}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <div>
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-500">
          <UserRound size={14} className="text-[#9c7749]" />
          Giriş yapıldı: <b className="text-black">{auth.user?.name}</b>
        </div>

        <ol className="mb-8 grid grid-cols-3 border border-black/10 bg-white">
          {steps.map((item) => (
            <li
              key={item.id}
              className={`border-black/10 px-3 py-4 text-center text-[10px] tracking-[.18em] sm:text-[11px] ${item.id < 3 ? "border-r" : ""} ${step === item.id ? "bg-black text-white" : step > item.id ? "bg-[#f7f4ed] text-black" : "text-neutral-400"}`}
            >
              <span className="block font-serif text-lg tracking-normal sm:text-xl">{item.id}</span>
              {item.label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <form onSubmit={goPayment} noValidate className="border border-black/10 bg-white p-7 md:p-10">
            <p className="text-[10px] tracking-[.25em] text-[#956f42]">ADIM 1</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Teslimat bilgileri</h2>
            <p className="mt-3 text-sm text-neutral-500">Siparişiniz Tekirdağ’dan yurt içi kargo ile gönderilir.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-[10px] tracking-widest text-neutral-500">AD SOYAD *
                <input value={name} onChange={(e) => { setName(e.target.value); clearError("name"); }} autoComplete="name" className={fieldClass(errors.name)} />
                {errors.name && <span className="mt-1 block text-[11px] text-red-600">{errors.name}</span>}
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500">TELEFON *
                <input value={phone} onChange={(e) => { setPhone(formatTrPhone(e.target.value)); clearError("phone"); }} onBlur={() => setPhone((value) => (value ? formatTrPhone(value) : value))} inputMode="tel" placeholder="05XX XXX XX XX" autoComplete="tel" className={fieldClass(errors.phone)} />
                {errors.phone && <span className="mt-1 block text-[11px] text-red-600">{errors.phone}</span>}
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">E-POSTA
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError("email"); }} autoComplete="email" className={fieldClass(errors.email)} />
                {errors.email && <span className="mt-1 block text-[11px] text-red-600">{errors.email}</span>}
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500">ŞEHİR *
                <select value={city} onChange={(e) => { setCity(e.target.value); clearError("city"); }} className={fieldClass(errors.city)}>
                  <option value="">İl seçin</option>
                  {TURKEY_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                {errors.city && <span className="mt-1 block text-[11px] text-red-600">{errors.city}</span>}
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500">İLÇE *
                <input value={district} onChange={(e) => { setDistrict(e.target.value); clearError("district"); }} placeholder="Örn. Çankaya" className={fieldClass(errors.district)} />
                {errors.district && <span className="mt-1 block text-[11px] text-red-600">{errors.district}</span>}
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">AÇIK ADRES *
                <textarea value={address} onChange={(e) => { setAddress(e.target.value); clearError("address"); }} rows={3} placeholder="Mahalle, sokak, bina no, daire" className={fieldClass(errors.address)} />
                {errors.address && <span className="mt-1 block text-[11px] text-red-600">{errors.address}</span>}
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">SİPARİŞ NOTU
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
            </div>
            <button type="submit" disabled={!canGoPayment} className={`btn-dark mt-8 w-full sm:w-auto ${!canGoPayment ? "pointer-events-none opacity-40" : ""}`}>
              ÖDEMEYE GEÇ
            </button>
            {!canGoPayment && (
              <p className="mt-3 text-xs text-neutral-500">
                Ad soyad, telefon, şehir, ilçe ve açık adresi eksiksiz doldurunca ödeme adımı açılır.
              </p>
            )}
          </form>
        )}

        {step === 2 && (
          <div className="border border-black/10 bg-white p-7 md:p-10">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-xs tracking-wider text-neutral-500 hover:text-black">
              <ChevronLeft size={14} /> TESLİMAT
            </button>
            <p className="mt-5 text-[10px] tracking-[.25em] text-[#956f42]">ADIM 2</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Ödeme yöntemi</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Satış siteden tamamlanır. Ödeme Havale/EFT ile alınır; IBAN sipariş onayından sonra gösterilir.
            </p>

            <div className="mt-7 border border-black bg-[#f7f4ed] px-4 py-5">
              <div className="flex items-start gap-4">
                <CreditCard className="mt-0.5 shrink-0 text-[#9c7749]" strokeWidth={1.2} />
                <div>
                  <b className="block text-sm tracking-wide">Havale / EFT</b>
                  <span className="mt-1 block text-xs text-neutral-500">Sipariş sonrası IBAN bu sitede çıkar</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-[10px] tracking-widest text-neutral-500">ÖDEME PLANI</p>
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
                    {option.id === "pesin" ? formatPrice(total) : `${formatPrice(Math.ceil(total / Number(option.id)))} × ${option.id}`}
                  </span>
                </button>
              ))}
            </div>

            <button type="button" onClick={goConfirm} className="btn-dark mt-8 w-full sm:w-auto">SİPARİŞİ GÖZDEN GEÇİR</button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submit} className="border border-black/10 bg-white p-7 md:p-10">
            <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1 text-xs tracking-wider text-neutral-500 hover:text-black">
              <ChevronLeft size={14} /> ÖDEME
            </button>
            <p className="mt-5 text-[10px] tracking-[.25em] text-[#956f42]">ADIM 3</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Siparişi onayla</h2>

            <div className="mt-7 space-y-4 border border-black/10 bg-[#faf8f3] p-5 text-sm">
              <div>
                <p className="text-[10px] tracking-widest text-neutral-500">TESLİMAT</p>
                <p className="mt-2 font-medium">{name}</p>
                <p className="text-neutral-600">{phone}{email ? ` · ${email}` : ""}</p>
                <p className="mt-1 text-neutral-600">{address}</p>
                <p className="text-neutral-600">{district}, {city}</p>
              </div>
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] tracking-widest text-neutral-500">ÖDEME</p>
                <p className="mt-2">Havale / EFT · {selectedPlan.label}</p>
                <p className="mt-1 text-xs text-neutral-500">IBAN, sipariş alındıktan sonra bu sayfada gösterilir.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex gap-3 text-xs leading-5 text-neutral-600">
                <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} className="mt-0.5 accent-black" />
                <span>
                  <Link href="/kvkk" className="underline" target="_blank">KVKK Aydınlatma Metni</Link>’ni okudum, kişisel verilerimin sipariş için işlenmesini kabul ediyorum.
                </span>
              </label>
              <label className="flex gap-3 text-xs leading-5 text-neutral-600">
                <input type="checkbox" checked={distance} onChange={(e) => setDistance(e.target.checked)} className="mt-0.5 accent-black" />
                <span>
                  <Link href="/mesafeli-satis" className="underline" target="_blank">Mesafeli Satış Sözleşmesi</Link> ve{" "}
                  <Link href="/gizlilik" className="underline" target="_blank">Gizlilik Politikası</Link>’nı onaylıyorum.
                </span>
              </label>
            </div>

            <button type="submit" disabled={submitting} className={`btn-dark mt-8 w-full ${submitting ? "opacity-60" : ""}`}>
              {submitting ? "SİPARİŞ KAYDEDİLİYOR..." : "SİPARİŞİ TAMAMLA"}
            </button>
            <p className="mt-4 text-xs text-neutral-500">Sipariş sitede oluşur; ödeme bilgisi bir sonraki ekranda gelir. WhatsApp’a yönlendirilmezsiniz.</p>
          </form>
        )}
      </div>

      <aside className="h-fit border border-black/10 bg-[#f7f4ed] p-7 md:sticky md:top-28 md:p-8">
        <p className="text-[10px] tracking-[.25em] text-[#956f42]">SİPARİŞ ÖZETİ</p>
        <div className="mt-6 space-y-5">
          {cart.map((item) => (
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
          <div className="flex justify-between"><span className="inline-flex items-center gap-1.5"><Truck size={14} /> Kargo</span><b>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</b></div>
          {step >= 2 && <div className="flex justify-between"><span>Plan</span><b>{selectedPlan.label}</b></div>}
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
