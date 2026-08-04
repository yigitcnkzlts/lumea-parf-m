"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { whatsappLink } from "@/lib/contact";

export function WhatsAppFab() {
  const pathname = usePathname();
  const shop = useShop();

  const cartSummary =
    shop.cart.length > 0
      ? shop.cart
          .slice(0, 3)
          .map((item) => `${item.product.brand} ${item.product.name} ${item.size}ml x${item.quantity}`)
          .join(", ")
      : "";

  const message =
    pathname?.startsWith("/odeme") || pathname?.startsWith("/sepet")
      ? `Merhaba Bee, sipariş / ödeme hakkında yardım istiyorum.${cartSummary ? `\nSepetim: ${cartSummary}` : ""}`
      : pathname?.startsWith("/urunler/")
        ? "Merhaba Bee, bu parfüm hakkında bilgi almak istiyorum."
        : pathname?.startsWith("/hesabim")
          ? "Merhaba Bee, sipariş takibi için yazıyorum."
          : "Merhaba Bee Kozmetik, bilgi almak istiyorum.";

  return (
    <Link
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 bg-[#181816] px-4 py-3 text-[10px] tracking-[.14em] text-white shadow-lg transition hover:bg-[#9b784a] md:bottom-8 md:right-8"
    >
      <MessageCircle size={16} /> DESTEK
    </Link>
  );
}
