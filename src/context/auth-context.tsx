"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type AuthProvider = "email" | "google" | "facebook";

export interface AuthUser {
  name: string;
  email: string;
  provider: AuthProvider;
}

interface StoredAccount extends AuthUser {
  password?: string;
  favorites: number[];
}

interface AuthContextValue {
  user: AuthUser | null;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  loginWithEmail: (email: string, password: string) => boolean;
  registerWithEmail: (name: string, email: string, password: string) => boolean;
  loginWithProvider: (provider: "google" | "facebook", name: string, email: string) => void;
  logout: () => void;
  getUserFavorites: () => number[];
  saveUserFavorites: (ids: number[]) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USERS_KEY = "bee-users";
const SESSION_KEY = "bee-session";

function readUsers(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredAccount[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) setUser(JSON.parse(session) as AuthUser);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user, hydrated]);

  const persistSession = (next: AuthUser) => {
    setUser(next);
    setAuthOpen(false);
    toast.success(`Hoş geldiniz, ${next.name}`);
  };

  const loginWithEmail = (email: string, password: string) => {
    const users = readUsers();
    const found = users.find((item) => item.email.toLocaleLowerCase("tr-TR") === email.toLocaleLowerCase("tr-TR") && item.password === password);
    if (!found) {
      toast.error("E-posta veya şifre hatalı.");
      return false;
    }
    persistSession({ name: found.name, email: found.email, provider: "email" });
    return true;
  };

  const registerWithEmail = (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.some((item) => item.email.toLocaleLowerCase("tr-TR") === email.toLocaleLowerCase("tr-TR"))) {
      toast.error("Bu e-posta ile kayıt zaten var. Giriş yapın.");
      return false;
    }
    const account: StoredAccount = { name, email, password, provider: "email", favorites: [] };
    writeUsers([...users, account]);
    persistSession({ name, email, provider: "email" });
    return true;
  };

  const loginWithProvider = (provider: "google" | "facebook", name: string, email: string) => {
    const users = readUsers();
    const existing = users.find((item) => item.email.toLocaleLowerCase("tr-TR") === email.toLocaleLowerCase("tr-TR"));
    if (!existing) {
      writeUsers([...users, { name, email, provider, favorites: [] }]);
    } else {
      writeUsers(users.map((item) => (item.email === existing.email ? { ...item, name, provider } : item)));
    }
    persistSession({ name, email, provider });
  };

  const logout = () => {
    setUser(null);
    toast.success("Çıkış yapıldı");
  };

  const getUserFavorites = () => {
    if (!user) return [];
    const found = readUsers().find((item) => item.email === user.email);
    return found?.favorites ?? [];
  };

  const saveUserFavorites = (ids: number[]) => {
    if (!user) return;
    const users = readUsers().map((item) =>
      item.email === user.email ? { ...item, favorites: ids } : item,
    );
    writeUsers(users);
  };

  const value = useMemo(
    () => ({
      user,
      authOpen,
      setAuthOpen,
      loginWithEmail,
      registerWithEmail,
      loginWithProvider,
      logout,
      getUserFavorites,
      saveUserFavorites,
    }),
    [user, authOpen],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
