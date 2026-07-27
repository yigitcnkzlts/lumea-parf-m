import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ShopOverlays } from "@/components/layout/shop-overlays";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { AuthProvider } from "@/context/auth-context";
import { ShopProvider } from "@/context/shop-context";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Bee Parfüm | Kokunuz, İmzanızdır",
    template: "%s | Bee Parfüm",
  },
  description: "Dünyanın seçkin parfüm markalarını Bee ayrıcalığıyla keşfedin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AuthProvider>
          <ShopProvider>
            <Header />
            {children}
            <Footer />
            <ShopOverlays />
            <AuthModal />
            <WhatsAppFab />
            <Toaster position="bottom-center" richColors />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
