"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Mail, X } from "lucide-react";
import {
  loginSchema,
  magicLinkSchema,
  registerSchema,
  socialConsentSchema,
} from "@/lib/auth/validation";
import { useAuth } from "@/context/auth-context";

type Mode = "login" | "register" | "social" | "mail";
type FieldErrors = Record<string, string | undefined>;

export function AuthModal() {
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [social, setSocial] = useState<"google" | "facebook">("google");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!auth.authOpen) return;
    setErrors({});
    setBusy(false);
  }, [auth.authOpen, mode]);

  if (!auth.authOpen) return null;

  const close = () => auth.setAuthOpen(false);

  const firstIssue = (result: { success: false; error: { issues: Array<{ path: PropertyKey[]; message: string }> } }) => {
    const next: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return next;
  };

  const onEmail = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (mode === "login") {
      const parsed = loginSchema.safeParse({ email, password });
      if (!parsed.success) {
        firstIssue(parsed);
        return;
      }
      setBusy(true);
      try {
        await auth.loginWithEmail(parsed.data.email, parsed.data.password);
      } finally {
        setBusy(false);
      }
      return;
    }

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      kvkk: kvkk ? true : false,
      terms: terms ? true : false,
    });
    if (!parsed.success) {
      firstIssue(parsed);
      return;
    }
    setBusy(true);
    try {
      await auth.registerWithEmail(parsed.data.name, parsed.data.email, parsed.data.password);
    } finally {
      setBusy(false);
    }
  };

  const onSocial = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    const parsed = socialConsentSchema.safeParse({
      kvkk: kvkk ? true : false,
      terms: terms ? true : false,
    });
    if (!parsed.success) {
      firstIssue(parsed);
      return;
    }
    setBusy(true);
    try {
      await auth.loginWithProvider(social);
    } finally {
      setBusy(false);
    }
  };

  const onMailLogin = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    const parsed = magicLinkSchema.safeParse({
      email,
      kvkk: kvkk ? true : false,
      terms: terms ? true : false,
    });
    if (!parsed.success) {
      firstIssue(parsed);
      return;
    }
    setBusy(true);
    try {
      await auth.loginWithEmailOnly(parsed.data.email);
    } finally {
      setBusy(false);
    }
  };

  const startSocial = (provider: "google" | "facebook") => {
    setSocial(provider);
    setMode("social");
    setErrors({});
  };

  const fieldError = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-red-700">{errors[key]}</p> : null;

  const consentBlock = (mode === "register" || mode === "social" || mode === "mail") && (
    <div className="space-y-3 border border-black/10 bg-white/60 p-4 text-xs leading-5 text-neutral-600">
      <label className="flex gap-3">
        <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} className="mt-0.5 accent-black" />
        <span>
          <Link href="/kvkk" target="_blank" className="underline">KVKK Aydınlatma Metni</Link>’ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {fieldError("kvkk")}
      <label className="flex gap-3">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 accent-black" />
        <span>
          <Link href="/mesafeli-satis" target="_blank" className="underline">Üyelik / Mesafeli Satış</Link> koşullarını ve{" "}
          <Link href="/gizlilik" target="_blank" className="underline">Gizlilik Politikası</Link>’nı kabul ediyorum.
        </span>
      </label>
      {fieldError("terms")}
      <label className="flex gap-3">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 accent-black" />
        <span>Kampanya ve fırsatlardan e-posta / WhatsApp ile haberdar olmak istiyorum. (İsteğe bağlı)</span>
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={close}>
      <div role="dialog" aria-modal="true" className="relative max-h-[92vh] w-full max-w-md overflow-y-auto bg-[#faf8f3] p-8 md:p-10" onMouseDown={(e) => e.stopPropagation()}>
        <button aria-label="Kapat" onClick={close} className="absolute right-4 top-4"><X size={20} /></button>
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">HESABIM</p>
        <h2 className="mt-3 font-serif text-4xl">
          {mode === "register"
            ? "Kayıt ol"
            : mode === "social"
              ? `${social === "google" ? "Google" : "Facebook"} ile giriş`
              : mode === "mail"
                ? "E-posta linki ile giriş"
                : "Giriş yap"}
        </h2>
        <p className="mt-3 text-sm text-neutral-600">
          {auth.authMessage || "Favorilerinizi kaydedin, satın alma için üye olun."}
        </p>

        {!auth.configured && (
          <p className="mt-4 border border-[#956f42]/30 bg-[#956f42]/10 px-3 py-2 text-xs leading-5 text-[#6d4f2d]">
            Supabase bağlı değil. Terminalde sunucuyu durdurup (`Ctrl+C`) tekrar <b>npm run dev</b> çalıştırın.
            Canlı sitedeyseniz Vercel Environment Variables eksik demektir.
          </p>
        )}

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
                <Mail size={16} /> E-POSTA LİNKİ İLE GİRİŞ
              </button>
            </div>
            <div className="my-7 flex items-center gap-3 text-[10px] tracking-widest text-neutral-400">
              <span className="h-px flex-1 bg-black/10" /> VEYA ŞİFRE İLE <span className="h-px flex-1 bg-black/10" />
            </div>
            <form onSubmit={onEmail} className="space-y-4" noValidate>
              {mode === "register" && (
                <label className="block text-[10px] tracking-widest text-neutral-500">AD SOYAD
                  <input
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                  {fieldError("name")}
                </label>
              )}
              <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
                <input
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                />
                {fieldError("email")}
              </label>
              <label className="block text-[10px] tracking-widest text-neutral-500">ŞİFRE
                <input
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                />
                {fieldError("password")}
                {mode === "register" && (
                  <span className="mt-1 block text-[10px] tracking-normal text-neutral-400">
                    En az 8 karakter, 1 harf ve 1 rakam
                  </span>
                )}
              </label>
              {mode === "register" && (
                <label className="block text-[10px] tracking-widest text-neutral-500">ŞİFRE TEKRAR
                  <input
                    autoComplete="new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                  {fieldError("confirmPassword")}
                </label>
              )}
              {consentBlock}
              <button disabled={busy || !auth.configured} className="btn-dark w-full">
                <Mail size={16} /> {busy ? "LÜTFEN BEKLEYİN..." : mode === "login" ? "GİRİŞ YAP" : "KAYIT OL"}
              </button>
            </form>
            <button
              type="button"
              className="mt-5 text-xs underline"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErrors({});
              }}
            >
              {mode === "login" ? "Hesabınız yok mu? Kayıt olun" : "Zaten üye misiniz? Giriş yapın"}
            </button>
          </>
        )}

        {mode === "social" && (
          <form onSubmit={onSocial} className="mt-8 space-y-4" noValidate>
            <p className="text-sm leading-6 text-neutral-600">
              {social === "google" ? "Google" : "Facebook"} ile güvenli giriş. Kart bilgisi istenmez.
            </p>
            <p className="border border-[#956f42]/25 bg-[#956f42]/08 px-3 py-2 text-xs leading-5 text-[#6d4f2d]">
              Panelde kapalıysa hata alırsınız: Supabase → Authentication → Providers →{" "}
              {social === "google" ? "Google" : "Facebook"} açın. Redirect URL:{" "}
              <span className="break-all">{typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "/auth/callback"}</span>
            </p>
            {consentBlock}
            <button disabled={busy || !auth.configured} className="btn-dark w-full">
              {busy ? "YÖNLENDİRİLİYORSUNUZ..." : social === "google" ? "GOOGLE İLE DEVAM ET" : "FACEBOOK İLE DEVAM ET"}
            </button>
            <button type="button" className="text-xs underline" onClick={() => setMode("login")}>Geri dön</button>
          </form>
        )}

        {mode === "mail" && (
          <form onSubmit={onMailLogin} className="mt-8 space-y-4" noValidate>
            <p className="text-sm leading-6 text-neutral-600">Şifresiz giriş bağlantısı e-posta adresinize gönderilir.</p>
            <p className="border border-black/10 bg-white/70 px-3 py-2 text-xs leading-5 text-neutral-600">
              Mail gelmezse: Supabase Auth e-posta şablonu veya özel SMTP (Auth → Emails) ayarlı olmalıdır.
            </p>
            <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
              <input
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
              />
              {fieldError("email")}
            </label>
            {consentBlock}
            <button disabled={busy || !auth.configured} className="btn-dark w-full">
              <Mail size={16} /> {busy ? "GÖNDERİLİYOR..." : "LİNK GÖNDER"}
            </button>
            <button type="button" className="text-xs underline" onClick={() => setMode("login")}>Geri dön</button>
          </form>
        )}
      </div>
    </div>
  );
}
