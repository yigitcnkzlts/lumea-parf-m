"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export function AuthModal() {
  const auth = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "social" | "mail">("login");
  const [social, setSocial] = useState<"google" | "facebook">("google");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!auth.authOpen) return null;

  const needsConsent = mode === "register" || mode === "social" || mode === "mail";

  const ensureConsent = () => {
    if (!needsConsent) return true;
    if (!kvkk || !terms) {
      toast.error("Devam etmek için KVKK ve üyelik onaylarını işaretleyin.");
      return false;
    }
    return true;
  };

  const onEmail = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "login") {
      auth.loginWithEmail(email, password);
      return;
    }
    if (!ensureConsent()) return;
    auth.registerWithEmail(name, email, password);
  };

  const onSocial = (event: FormEvent) => {
    event.preventDefault();
    if (!ensureConsent()) return;
    auth.loginWithProvider(social, name || email.split("@")[0], email);
  };

  const onMailLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!ensureConsent()) return;
    auth.loginWithEmailOnly(name, email);
  };

  const startSocial = (provider: "google" | "facebook") => {
    setSocial(provider);
    setMode("social");
  };

  const consentBlock = needsConsent && (
    <div className="space-y-3 border border-black/10 bg-white/60 p-4 text-xs leading-5 text-neutral-600">
      <label className="flex gap-3">
        <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} className="mt-0.5 accent-black" required={needsConsent} />
        <span>
          <Link href="/kvkk" target="_blank" className="underline">KVKK Aydınlatma Metni</Link>’ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      <label className="flex gap-3">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 accent-black" required={needsConsent} />
        <span>
          <Link href="/mesafeli-satis" target="_blank" className="underline">Üyelik / Mesafeli Satış</Link> koşullarını ve{" "}
          <Link href="/gizlilik" target="_blank" className="underline">Gizlilik Politikası</Link>’nı kabul ediyorum.
        </span>
      </label>
      <label className="flex gap-3">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 accent-black" />
        <span>Kampanya ve fırsatlardan e-posta / WhatsApp ile haberdar olmak istiyorum. (İsteğe bağlı)</span>
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={() => auth.setAuthOpen(false)}>
      <div role="dialog" aria-modal="true" className="relative max-h-[92vh] w-full max-w-md overflow-y-auto bg-[#faf8f3] p-8 md:p-10" onMouseDown={(e) => e.stopPropagation()}>
        <button aria-label="Kapat" onClick={() => auth.setAuthOpen(false)} className="absolute right-4 top-4"><X size={20} /></button>
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">HESABIM</p>
        <h2 className="mt-3 font-serif text-4xl">
          {mode === "register" ? "Kayıt ol" : mode === "social" ? `${social === "google" ? "Google" : "Facebook"} ile giriş` : mode === "mail" ? "E-posta ile giriş" : "Giriş yap"}
        </h2>
        <p className="mt-3 text-sm text-neutral-600">Favorilerinizi kaydedin, siparişlerinizi kolaylaştırın.</p>

        {(mode === "login" || mode === "register") && (
          <>
            <div className="mt-8 grid gap-3">
              <button type="button" onClick={() => startSocial("google")} className="flex items-center justify-center gap-2 border border-black/15 py-3 text-xs tracking-[.12em] transition hover:border-black">
                <span className="font-serif text-base">G</span> GOOGLE İLE DEVAM ET
              </button>
              <button type="button" onClick={() => startSocial("facebook")} className="flex items-center justify-center gap-2 border border-black/15 py-3 text-xs tracking-[.12em] transition hover:border-black">
                <span className="font-serif text-base">f</span> FACEBOOK İLE DEVAM ET
              </button>
              <button type="button" onClick={() => setMode("mail")} className="flex items-center justify-center gap-2 border border-black/15 py-3 text-xs tracking-[.12em] transition hover:border-black">
                <Mail size={16} /> E-POSTA İLE GİRİŞ
              </button>
            </div>
            <div className="my-7 flex items-center gap-3 text-[10px] tracking-widest text-neutral-400">
              <span className="h-px flex-1 bg-black/10" /> VEYA ŞİFRE İLE <span className="h-px flex-1 bg-black/10" />
            </div>
            <form onSubmit={onEmail} className="space-y-4">
              {mode === "register" && (
                <label className="block text-[10px] tracking-widest text-neutral-500">AD SOYAD
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
                </label>
              )}
              <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              <label className="block text-[10px] tracking-widest text-neutral-500">ŞİFRE
                <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
              </label>
              {consentBlock}
              <button className="btn-dark w-full"><Mail size={16} /> {mode === "login" ? "GİRİŞ YAP" : "KAYIT OL"}</button>
            </form>
            <button type="button" className="mt-5 text-xs underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Hesabınız yok mu? Kayıt olun" : "Zaten üye misiniz? Giriş yapın"}
            </button>
          </>
        )}

        {mode === "social" && (
          <form onSubmit={onSocial} className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-neutral-600">
              {social === "google" ? "Google" : "Facebook"} ile devam için bilgilerinizi onaylayın.
            </p>
            <label className="block text-[10px] tracking-widest text-neutral-500">AD SOYAD
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            {consentBlock}
            <button className="btn-dark w-full">DEVAM ET</button>
            <button type="button" className="text-xs underline" onClick={() => setMode("login")}>Geri dön</button>
          </form>
        )}

        {mode === "mail" && (
          <form onSubmit={onMailLogin} className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-neutral-600">Şifre olmadan e-posta adresinizle hızlı giriş yapın.</p>
            <label className="block text-[10px] tracking-widest text-neutral-500">AD SOYAD
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="İsteğe bağlı" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            {consentBlock}
            <button className="btn-dark w-full"><Mail size={16} /> E-POSTA İLE GİR</button>
            <button type="button" className="text-xs underline" onClick={() => setMode("login")}>Geri dön</button>
          </form>
        )}
      </div>
    </div>
  );
}
