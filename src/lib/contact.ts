export const WHATSAPP_PHONE = "905452267531";
export const WHATSAPP_DISPLAY = "0545 226 75 31";
export const CONTACT_EMAIL = "beekozmatik59@outlook.com";
export const FREE_SHIPPING_THRESHOLD = 1500;

/** Sipariş sonrası havale için — gerçek IBAN ile değiştirin */
export const BANK_ACCOUNT = {
  bank: "Ziraat Bankası",
  holder: "Bee Kozmetik",
  iban: "TR00 0000 0000 0000 0000 0000 00",
} as const;

export const INSTALLMENT_OPTIONS = [
  { id: "pesin", label: "Peşin Havale / EFT", note: "Tek seferde ödeme" },
  { id: "2", label: "2 Taksit", note: "WhatsApp ile planlanır" },
  { id: "3", label: "3 Taksit", note: "WhatsApp ile planlanır" },
] as const;

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
