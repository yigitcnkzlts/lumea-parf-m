"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";

export function RequireLogin({
  children,
  message = "Satın alma için giriş yapın veya kayıt olun.",
}: {
  children: React.ReactNode;
  message?: string;
}) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      auth.setAuthOpen(true, message);
    }
  }, [auth.loading, auth.user, auth.setAuthOpen, message]);

  if (auth.loading) {
    return <p className="text-sm text-neutral-500">Oturum kontrol ediliyor…</p>;
  }

  if (!auth.user) {
    return (
      <div className="border border-black/10 bg-white/50 px-8 py-16 text-center">
        <p className="font-serif text-3xl">Üyelik gerekli</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-600">{message}</p>
        <button
          className="btn-dark mt-8"
          onClick={() => auth.setAuthOpen(true, message)}
        >
          GİRİŞ YAP / KAYIT OL
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
