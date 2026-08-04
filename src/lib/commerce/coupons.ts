export interface Coupon {
  code: string;
  label: string;
  /** Percent off subtotal, e.g. 10 = %10 */
  percentOff: number;
  minSubtotal: number;
  active: boolean;
}

/** Server + client preview. Final validation must happen on checkout API. */
export const COUPONS: Coupon[] = [
  {
    code: "BEE10",
    label: "%10 hoş geldin indirimi",
    percentOff: 10,
    minSubtotal: 2000,
    active: true,
  },
  {
    code: "YAZ15",
    label: "%15 yaz kampanyası",
    percentOff: 15,
    minSubtotal: 3500,
    active: true,
  },
];

export function findCoupon(code: string) {
  const normalized = code.trim().toLocaleUpperCase("tr-TR");
  return COUPONS.find((c) => c.code === normalized && c.active) ?? null;
}

export function applyCoupon(subtotal: number, code: string) {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false as const, error: "Geçersiz kupon kodu." };
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false as const,
      error: `Bu kupon için minimum sepet ${coupon.minSubtotal.toLocaleString("tr-TR")} TL.`,
    };
  }
  const discount = Math.round(subtotal * (coupon.percentOff / 100));
  return {
    ok: true as const,
    coupon,
    discount,
    totalAfter: Math.max(0, subtotal - discount),
  };
}
