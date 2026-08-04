import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ShopOverlays } from "@/components/layout/shop-overlays";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { AuthProvider } from "@/context/auth-context";
import { CatalogProvider } from "@/context/catalog-context";
import { ShopProvider } from "@/context/shop-context";
import { defaultMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/catalog/server";
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

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalog = await getCatalogProducts();

  return (
    <html lang="tr" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AuthProvider>
          <CatalogProvider initialProducts={catalog}>
            <ShopProvider>
              <Header />
              {children}
              <Footer />
              <ShopOverlays />
              <AuthModal />
              <WhatsAppFab />
              <Toaster position="bottom-center" richColors />
            </ShopProvider>
          </CatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
