export type OrderPayment = "havale" | "whatsapp";

export interface OrderItemPayload {
  brand: string;
  name: string;
  size: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderPayload {
  name: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  note: string;
  payment: OrderPayment;
  installmentLabel: string;
  subtotal: number;
  shipping: number;
  total: number;
  accountEmail?: string;
  items: OrderItemPayload[];
}

export interface PlacedOrder extends OrderPayload {
  orderId: string;
  createdAt: string;
  status: "odeme_bekleniyor" | "hazirlaniyor" | "kargoda" | "tamamlandi";
}

export function createOrderId() {
  const stamp = new Date();
  const date = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(stamp.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BEE-${date}-${rand}`;
}

const ORDERS_KEY = "bee-placed-orders";

export function saveLocalOrder(order: PlacedOrder) {
  try {
    const current = readLocalOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...current].slice(0, 30)));
  } catch {
    /* ignore */
  }
}

export function readLocalOrders(): PlacedOrder[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]") as PlacedOrder[];
  } catch {
    return [];
  }
}

export function formatOrderEmail(order: PlacedOrder) {
  const lines = order.items.map(
    (item) =>
      `• ${item.brand} ${item.name} (${item.size} ml) x${item.quantity} — ${item.lineTotal.toLocaleString("tr-TR")} TL`,
  );
  return [
    `Yeni sipariş: ${order.orderId}`,
    `Tarih: ${new Date(order.createdAt).toLocaleString("tr-TR")}`,
    "",
    "Ürünler:",
    ...lines,
    "",
    `Ara toplam: ${order.subtotal.toLocaleString("tr-TR")} TL`,
    `Kargo: ${order.shipping === 0 ? "Ücretsiz" : `${order.shipping.toLocaleString("tr-TR")} TL`}`,
    `Toplam: ${order.total.toLocaleString("tr-TR")} TL`,
    "",
    `Ödeme: ${order.payment === "havale" ? "Havale / EFT" : "Diğer"}`,
    `Plan: ${order.installmentLabel}`,
    "",
    `Ad Soyad: ${order.name}`,
    `Telefon: ${order.phone}`,
    `E-posta: ${order.email || "-"}`,
    `Hesap: ${order.accountEmail || "-"}`,
    `Adres: ${order.address}`,
    `İlçe / İl: ${order.district} / ${order.city}`,
    order.note ? `Not: ${order.note}` : "",
    "",
    "Durum: Ödeme bekleniyor",
  ]
    .filter(Boolean)
    .join("\n");
}
