export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refund_requested"
  | "refunded"
  | "payment_failed";

export type PaymentStatus =
  | "not_started"
  | "initialized"
  | "pending_3ds"
  | "success"
  | "failed"
  | "cancelled"
  | "refunded";

export interface CheckoutCartLine {
  productId: number;
  size: number;
  quantity: number;
}

export interface CheckoutAddressInput {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  addressLine: string;
  note?: string;
}

export interface PricedLine {
  productId: number;
  productSlug: string;
  brand: string;
  name: string;
  sizeMl: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableStock: number;
}

export interface PricedCart {
  lines: PricedLine[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode: string | null;
  total: number;
  currency: "TRY";
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Beklemede",
  awaiting_payment: "Ödeme bekleniyor",
  paid: "Ödendi",
  preparing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim edildi",
  cancelled: "İptal edildi",
  refund_requested: "İade talebi",
  refunded: "İade edildi",
  payment_failed: "Ödeme başarısız",
};
