"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { tryCreateClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthProvider = "email" | "google" | "facebook";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  role?: "customer" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithProvider: (provider: AuthProvider) => Promise<boolean>;
  loginWithEmailOnly: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getUserFavorites: () => number[];
  saveUserFavorites: (ids: number[]) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: User, role?: "customer" | "admin"): AuthUser {
  const provider = (user.app_metadata?.provider as string) || "email";
  const mappedProvider: AuthProvider =
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
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

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
      setFavorites((profile?.favorite_product_ids as number[]) ?? []);
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
      toast.error("Supabase henüz yapılandırılmadı. Lütfen proje yöneticisine bildirin.");
      return false;
    }
    return true;
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!ensureConfigured()) return false;
    const supabase = tryCreateClient();
    if (!supabase) return false;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : error.message);
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      toast.error(error.message);
      return false;
    }
    setAuthOpen(false);
    toast.success("Kayıt tamamlandı. Giriş yaptınız.");
    return true;
  };

  const loginWithProvider = async (provider: AuthProvider) => {
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
      },
    });
    if (error) {
      toast.error(error.message);
      return false;
    }
    return true;
  };

  const loginWithEmailOnly = async (_name: string, email: string) => {
    if (!ensureConfigured()) return false;
    const supabase = tryCreateClient();
    if (!supabase) return false;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
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
      setAuthOpen,
      loginWithEmail,
      registerWithEmail,
      loginWithProvider,
      loginWithEmailOnly,
      logout,
      getUserFavorites,
      saveUserFavorites,
    }),
    [user, authOpen, loading, configured, favorites],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
