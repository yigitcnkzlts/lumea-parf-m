"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ShopOverlays } from "@/components/layout/shop-overlays";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

/** Mağaza chrome’u; /admin altında gizlenir (panel kendi shell’ini kullanır). */
export function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        {children}
        <AuthModal />
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ShopOverlays />
      <AuthModal />
      <WhatsAppFab />
    </>
  );
}
