"use client";

import { FormEvent, useState } from "react";
import { Mail, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function AuthModal() {
  const auth = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "social">("login");
  const [social, setSocial] = useState<"google" | "facebook">("google");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!auth.authOpen) return null;

  const onEmail = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "login") auth.loginWithEmail(email, password);
    else auth.registerWithEmail(name, email, password);
  };

  const onSocial = (event: FormEvent) => {
    event.preventDefault();
    auth.loginWithProvider(social, name || email.split("@")[0], email);
  };

  const startSocial = (provider: "google" | "facebook") => {
    setSocial(provider);
    setMode("social");
  };

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={() => auth.setAuthOpen(false)}>
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md bg-[#faf8f3] p-8 md:p-10" onMouseDown={(e) => e.stopPropagation()}>
        <button aria-label="Kapat" onClick={() => auth.setAuthOpen(false)} className="absolute right-4 top-4"><X size={20} /></button>
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">HESABIM</p>
        <h2 className="mt-3 font-serif text-4xl">{mode === "register" ? "Kayıt ol" : mode === "social" ? `${social === "google" ? "Google" : "Facebook"} ile giriş` : "Giriş yap"}</h2>
        <p className="mt-3 text-sm text-neutral-600">Favorilerinizi ve sipariş tercihlerinizi kaydedin.</p>

        {mode !== "social" && (
          <>
            <div className="mt-8 grid gap-3">
              <button type="button" onClick={() => startSocial("google")} className="flex items-center justify-center gap-2 border border-black/15 py-3 text-xs tracking-[.12em] transition hover:border-black">
                <span className="font-serif text-base">G</span> GOOGLE İLE DEVAM ET
              </button>
              <button type="button" onClick={() => startSocial("facebook")} className="flex items-center justify-center gap-2 border border-black/15 py-3 text-xs tracking-[.12em] transition hover:border-black">
                <span className="font-serif text-base">f</span> FACEBOOK İLE DEVAM ET
              </button>
            </div>
            <div className="my-7 flex items-center gap-3 text-[10px] tracking-widest text-neutral-400">
              <span className="h-px flex-1 bg-black/10" /> VEYA E-POSTA <span className="h-px flex-1 bg-black/10" />
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
              {social === "google" ? "Google" : "Facebook"} hesabınızla devam etmek için ad ve e-posta bilgilerinizi onaylayın.
            </p>
            <label className="block text-[10px] tracking-widest text-neutral-500">AD SOYAD
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <label className="block text-[10px] tracking-widest text-neutral-500">E-POSTA
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
            </label>
            <button className="btn-dark w-full">DEVAM ET</button>
            <button type="button" className="text-xs underline" onClick={() => setMode("login")}>Geri dön</button>
          </form>
        )}
      </div>
    </div>
  );
}
