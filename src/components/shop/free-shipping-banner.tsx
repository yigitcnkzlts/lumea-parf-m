"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/contact";
import { formatPrice } from "@/data/products";

export function FreeShippingBanner({
  remaining,
  compact = false,
}: {
  remaining?: number;
  compact?: boolean;
}) {
  const left = remaining ?? 0;
  const earned = left <= 0;

  return (
    <div
      className={`flex items-start gap-3 border border-[#c9a775]/35 bg-[#f7f1e6] px-4 py-3 text-[#4a3520] ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <Truck className="mt-0.5 shrink-0 text-[#956f42]" size={18} />
      <div>
        {earned ? (
          <p>
            <b>Ücretsiz kargo kazandınız.</b> {formatPrice(FREE_SHIPPING_THRESHOLD)} ve üzeri siparişlerde kargo bedava.
          </p>
        ) : (
          <p>
            <b>Ücretsiz kargoya {formatPrice(left)} kaldı.</b> {formatPrice(FREE_SHIPPING_THRESHOLD)} üzeri siparişlerde kargo ücretsiz.
          </p>
        )}
        {!compact && (
          <Link href="/urunler" className="mt-1 inline-block text-xs tracking-wider underline underline-offset-4">
            Alışverişe devam et
          </Link>
        )}
      </div>
    </div>
  );
}
