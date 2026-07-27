"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, Copy, CreditCard, MessageCircle, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { useShop } from "@/context/shop-context";
import {
  BANK_ACCOUNT,
  CONTACT_EMAIL,
  FREE_SHIPPING_THRESHOLD,
  INSTALLMENT_OPTIONS,
  SHIPPING_FEE,
  WHATSAPP_DISPLAY,
  hasBankDetails,
  whatsappLink,
} from "@/lib/contact";

const cities = [
  "Adana", "Ankara", "Antalya", "Bursa", "İstanbul", "İzmir", "Tekirdağ", "Kocaeli", "Gaziantep", "Konya", "Diğer",
];

const steps = [
  { id: 1, label: "Teslimat" },
  { id: 2, label: "Ödeme" },
  { id: 3, label: "Onay" },
] as const;

type Step = 1 | 2 | 3;

export function OrderForm() {
  const shop = useShop();
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Tekirdağ");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"havale" | "whatsapp">("havale");
  const [installment, setInstallment] = useState<(typeof INSTALLMENT_OPTIONS)[number]["id"]>("pesin");
  const [copied, setCopied] = useState(false);
  const [kvkk, setKvkk] = useState(false);
  const [distance, setDistance] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState(shop.cart);

  const cart = done ? orderSnapshot : shop.cart;
  const subtotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const selectedPlan = INSTALLMENT_OPTIONS.find((item) => item.id === installment)!;
  const installmentAmount = installment === "pesin" ? total : Math.ceil(total / Number(installment));
  const showIban = done && payment === "havale" && hasBankDetails();

  const message = useMemo(() => {
    const lines = cart.map(
      (item) => `• ${item.product.brand} ${item.product.name} (${item.size} ml) x${item.quantity} — ${formatPrice(item.product.salePrice * item.quantity)}`,
    );
    const bankLines =
      payment === "havale" && hasBankDetails()
        ? [`Hesap: ${BANK_ACCOUNT.holder} / ${BANK_ACCOUNT.bank}`, `IBAN talep edildi (havale)`]
        : payment === "havale"
          ? ["Ödeme: Havale / EFT — IBAN bilgisini paylaşın lütfen"]
          : ["Ödeme: WhatsApp üzerinden yönlendirme"];

    return [
      "Merhaba Bee, yeni sipariş.",
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
      ...bankLines,
      "",
      `Ad Soyad: ${name || "-"}`,
      `Telefon: ${phone || "-"}`,
      email ? `E-posta: ${email}` : "",
      `Şehir: ${city}${district ? ` / ${district}` : ""}`,
      `Adres: ${address || "-"}`,
      note ? `Not: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [cart, subtotal, shipping, total, payment, selectedPlan, installment, installmentAmount, name, phone, email, city, district, address, note]);

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

  const goPayment = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Teslimat bilgilerini eksiksiz doldurun.");
      return;
    }
    setStep(2);
  };

  const goConfirm = () => setStep(3);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!kvkk || !distance) {
      toast.error("Devam etmek için zorunlu onayları işaretleyin.");
      return;
    }
    setOrderSnapshot(shop.cart);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    shop.clearCart();
    setDone(true);
    toast.success("Sipariş WhatsApp’a yönlendirildi");
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

  if (done) {
    return (
      <div className="mx-auto max-w-2xl border border-black/10 bg-white px-7 py-12 md:px-12">
        <div className="mx-auto grid h-14 w-14 place-content-center rounded-full bg-[#e8f3ea] text-emerald-800">
          <Check size={28} />
        </div>
        <h2 className="mt-6 text-center font-serif text-4xl md:text-5xl">Siparişiniz alındı</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-neutral-600">
          Sipariş özeti WhatsApp’a iletildi. En kısa sürede sizinle iletişime geçeceğiz.
        </p>

        <div className="mt-10 space-y-3 border-y border-black/10 py-6 text-sm">
          <div className="flex justify-between"><span>Toplam</span><b>{formatPrice(total)}</b></div>
          <div className="flex justify-between"><span>Ödeme</span><b>{payment === "havale" ? "Havale / EFT" : "WhatsApp"}</b></div>
          <div className="flex justify-between"><span>Plan</span><b>{selectedPlan.label}</b></div>
          <div className="flex justify-between"><span>Teslimat</span><b>{city}{district ? `, ${district}` : ""}</b></div>
        </div>

        {payment === "havale" && (
          <div className="mt-8 border border-black/10 bg-[#f7f4ed] p-6">
            <p className="text-[10px] tracking-[.25em] text-[#956f42]">ÖDEME BİLGİSİ</p>
            {showIban ? (
              <>
                <p className="mt-3 text-sm text-neutral-600">Havale/EFT için aşağıdaki hesaba ödeme yapın. Açıklamaya ad soyad ve telefon yazın.</p>
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
                Havale IBAN bilgisi WhatsApp konuşmasında tarafınıza iletilecek. Ödemeyi yaptıktan sonra dekontu aynı sohbete göndermeniz yeterlidir.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink("Merhaba Bee, siparişim hakkında bilgi almak istiyorum.")} target="_blank" rel="noreferrer" className="btn-dark">
            <MessageCircle size={16} /> WHATSAPP
          </a>
          <Link href="/urunler" className="inline-flex items-center border border-black px-6 py-3 text-xs tracking-[.16em]">ALIŞVERİŞE DEVAM</Link>
        </div>
        <p className="mt-6 text-center text-xs text-neutral-500">Destek: {WHATSAPP_DISPLAY} · {CONTACT_EMAIL}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <div>
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
          <form onSubmit={goPayment} className="border border-black/10 bg-white p-7 md:p-10">
            <p className="text-[10px] tracking-[.25em] text-[#956f42]">ADIM 1</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Teslimat bilgileri</h2>
            <p className="mt-3 text-sm text-neutral-500">Siparişiniz Tekirdağ’dan yurt içi kargo ile gönderilir.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-[10px] tracking-widest text-neutral-500">AD SOYAD *
                <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500">TELEFON *
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx xxx xx xx" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">E-POSTA (OPSİYONEL)
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500">ŞEHİR *
                <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black">
                  {cities.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500">İLÇE
                <input value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">AÇIK ADRES *
                <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="Mahalle, sokak, bina no, daire" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="text-[10px] tracking-widest text-neutral-500 sm:col-span-2">SİPARİŞ NOTU
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
            </div>
            <button type="submit" className="btn-dark mt-8 w-full sm:w-auto">ÖDEMEYE GEÇ</button>
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
              Online kart ödeme yoktur. Havale seçerseniz IBAN bilgisi sipariş onayından sonra gösterilir.
            </p>

            <div className="mt-7 grid gap-3">
              <button type="button" onClick={() => setPayment("havale")} className={`flex items-start gap-4 border px-4 py-5 text-left ${payment === "havale" ? "border-black bg-[#f7f4ed]" : "border-black/15"}`}>
                <CreditCard className="mt-0.5 shrink-0 text-[#9c7749]" strokeWidth={1.2} />
                <span>
                  <b className="block text-sm tracking-wide">Havale / EFT</b>
                  <span className="mt-1 block text-xs text-neutral-500">Onay sonrası banka bilgisi paylaşılır</span>
                </span>
              </button>
              <button type="button" onClick={() => setPayment("whatsapp")} className={`flex items-start gap-4 border px-4 py-5 text-left ${payment === "whatsapp" ? "border-black bg-[#f7f4ed]" : "border-black/15"}`}>
                <MessageCircle className="mt-0.5 shrink-0 text-[#9c7749]" strokeWidth={1.2} />
                <span>
                  <b className="block text-sm tracking-wide">WhatsApp ile yönlendirme</b>
                  <span className="mt-1 block text-xs text-neutral-500">Ödeme seçeneğini birlikte netleştiririz</span>
                </span>
              </button>
            </div>

            {payment === "havale" && (
              <>
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
              </>
            )}

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
                <p className="text-neutral-600">{district ? `${district}, ` : ""}{city}</p>
              </div>
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] tracking-widest text-neutral-500">ÖDEME</p>
                <p className="mt-2">{payment === "havale" ? "Havale / EFT" : "WhatsApp yönlendirme"} · {selectedPlan.label}</p>
                {payment === "havale" && (
                  <p className="mt-1 text-xs text-neutral-500">IBAN, onaydan sonra bu sayfada veya WhatsApp’ta paylaşılır.</p>
                )}
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

            <button type="submit" className="btn-dark mt-8 w-full">
              <MessageCircle size={16} /> WHATSAPP İLE SİPARİŞİ ONAYLA
            </button>
            <p className="mt-4 text-xs text-neutral-500">Onay sonrası WhatsApp açılır; havale seçtiyseniz ödeme bilgisi bir sonraki ekranda gelir.</p>
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
