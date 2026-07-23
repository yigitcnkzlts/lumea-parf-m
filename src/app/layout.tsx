import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ShopOverlays } from "@/components/layout/shop-overlays";
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
    default: "Luméa Parfüm | Kokunuz, İmzanızdır",
    template: "%s | Luméa Parfüm",
  },
  description: "Dünyanın seçkin parfüm markalarını Luméa ayrıcalığıyla keşfedin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ShopProvider>
          <Header />
          {children}
          <Footer />
          <ShopOverlays />
          <Toaster position="bottom-center" richColors />
        </ShopProvider>
      </body>
    </html>
  );
}
