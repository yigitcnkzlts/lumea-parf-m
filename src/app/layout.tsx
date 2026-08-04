import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { StoreShell } from "@/components/layout/store-shell";
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
              <AnalyticsScripts />
              <StoreShell>{children}</StoreShell>
              <Toaster position="bottom-center" richColors />
            </ShopProvider>
          </CatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
