"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

export function WhatsAppFab() {
  return (
    <Link
      href={whatsappLink("Merhaba Bee, bilgi almak istiyorum.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 bg-[#181816] px-4 py-3 text-[10px] tracking-[.14em] text-white shadow-lg transition hover:bg-[#9b784a] md:bottom-8 md:right-8"
    >
      <MessageCircle size={16} /> DESTEK
    </Link>
  );
}
