"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { mapAuthError } from "@/lib/auth/validation";
import { tryCreateClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthProviderKind = "email" | "google" | "facebook";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderKind;
  role?: "customer" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  authOpen: boolean;
  authMessage: string | null;
  setAuthOpen: (open: boolean, message?: string | null) => void;
  requireAuth: (message?: string) => boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithProvider: (provider: AuthProviderKind) => Promise<boolean>;
  loginWithEmailOnly: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getUserFavorites: () => number[];
  saveUserFavorites: (ids: number[]) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: User, role?: "customer" | "admin"): AuthUser {
  const provider = (user.app_metadata?.provider as string) || "email";
  const mappedProvider: AuthProviderKind =
    provider === "google" ? "google" : provider === "facebook" ? "facebook" : "email";
  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split("@")[0] ||
    "Misafir";
  return {
    id: user.id,
    name,
    email: user.email ?? "",
    provider: mappedProvider,
    role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [authOpen, setAuthOpenState] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  const setAuthOpen = useCallback((open: boolean, message: string | null = null) => {
    setAuthOpenState(open);
    setAuthMessage(open ? message : null);
  }, []);

  const requireAuth = useCallback(
    (message = "Devam etmek için giriş yapın veya kayıt olun.") => {
      if (user) return true;
      setAuthOpen(true, message);
      toast.error(message);
      return false;
    },
    [user, setAuthOpen],
  );

  useEffect(() => {
    let active = true;
    const supabase = tryCreateClient();

    if (!supabase) {
      queueMicrotask(() => {
        if (active) setLoading(false);
      });
      return () => {
        active = false;
      };
    }

    const hydrate = async (sessionUser: User | null) => {
      if (!sessionUser) {
        if (active) {
          setUser(null);
          setFavorites([]);
        }
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, favorite_product_ids")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (!active) return;
      const next = mapUser(sessionUser, profile?.role === "admin" ? "admin" : "customer");
      if (profile?.full_name) next.name = profile.full_name;
      setUser(next);

      const profileFavs = (profile?.favorite_product_ids as number[]) ?? [];
      let guestFavs: number[] = [];
      try {
        guestFavs = JSON.parse(localStorage.getItem("bee-favorites") ?? "[]") as number[];
      } catch {
        guestFavs = [];
      }
      const merged = Array.from(new Set([...profileFavs, ...guestFavs]));
      setFavorites(merged);
      if (merged.length !== profileFavs.length) {
        void supabase.from("profiles").update({ favorite_product_ids: merged }).eq("id", sessionUser.id);
      }
    };

    void supabase.auth.getSession().then(({ data }) =>
      hydrate(data.session?.user ?? null).finally(() => {
        if (active) setLoading(false);
      }),
    );

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrate(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const ensureConfigured = () => {
    if (!configured) {
      toast.error("Supabase henüz bağlanmadı. .env.local dosyasını kontrol edin.");
      return false;
    }
    return true;
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!ensureConfigured()) return false;
    const supabase = tryCreateClient();
    if (!supabase) return false;
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      toast.error(mapAuthError(error.message));
      return false;
    }
    setAuthOpen(false);
    toast.success("Hoş geldiniz");
    return true;
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    if (!ensureConfigured()) return false;
    const supabase = tryCreateClient();
    if (!supabase) return false;
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(mapAuthError(error.message));
      return false;
    }

    if (data.user?.id) {
      await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", data.user.id);
    }

    if (!data.session) {
      toast.success("Kayıt alındı. Giriş için e-postanızdaki doğrulama linkine tıklayın.");
      setAuthOpen(false);
      return true;
    }

    setAuthOpen(false);
    toast.success("Kayıt tamamlandı. Hoş geldiniz!");
    return true;
  };

  const loginWithProvider = async (provider: AuthProviderKind) => {
    if (!ensureConfigured()) return false;
    if (provider === "email") {
      toast.error("E-posta ile giriş için formu kullanın.");
      return false;
    }
    const supabase = tryCreateClient();
    if (!supabase) return false;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: provider === "google" ? { prompt: "select_account" } : undefined,
      },
    });
    if (error) {
      toast.error(mapAuthError(error.message));
      return false;
    }
    return true;
  };

  const loginWithEmailOnly = async (email: string) => {
    if (!ensureConfigured()) return false;
    const supabase = tryCreateClient();
    if (!supabase) return false;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    if (error) {
      toast.error(mapAuthError(error.message));
      return false;
    }
    toast.success("Giriş bağlantısı e-posta adresinize gönderildi.");
    setAuthOpen(false);
    return true;
  };

  const logout = async () => {
    const supabase = tryCreateClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setFavorites([]);
    toast.success("Çıkış yapıldı");
  };

  const getUserFavorites = () => favorites;

  const saveUserFavorites = (ids: number[]) => {
    setFavorites(ids);
    const supabase = tryCreateClient();
    if (!supabase || !user) return;
    void supabase.from("profiles").update({ favorite_product_ids: ids }).eq("id", user.id);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      authOpen,
      authMessage,
      setAuthOpen,
      requireAuth,
      loginWithEmail,
      registerWithEmail,
      loginWithProvider,
      loginWithEmailOnly,
      logout,
      getUserFavorites,
      saveUserFavorites,
    }),
    [user, authOpen, authMessage, loading, configured, favorites, setAuthOpen, requireAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

/** @deprecated use AuthProviderKind */
export type AuthProvider = AuthProviderKind;
