import type { Metadata } from "next";
import { FREE_SHIPPING_THRESHOLD, WHATSAPP_DISPLAY, CONTACT_EMAIL } from "@/lib/contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://beekozmetik.com";

export const siteConfig = {
  name: "Bee Kozmetik",
  tagline: "Kokunuz, İmzanızdır",
  description:
    "Tekirdağ merkezli Bee Kozmetik — Chanel, Dior, Tom Ford ve seçkin parfüm markaları. 1.500 TL üzeri ücretsiz kargo, orijinal ürün garantisi.",
  url: siteUrl,
  locale: "tr_TR",
  phone: WHATSAPP_DISPLAY,
  email: CONTACT_EMAIL,
  freeShipping: FREE_SHIPPING_THRESHOLD,
  keywords: [
    "parfüm",
    "Tekirdağ parfüm",
    "Bee Kozmetik",
    "orijinal parfüm",
    "erkek parfüm",
    "kadın parfüm",
    "Chanel",
    "Dior",
    "Tom Ford",
    "online parfüm satış",
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: siteConfig.locale,
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  },
};
