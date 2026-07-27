export const WHATSAPP_PHONE = "905452267531";
export const WHATSAPP_DISPLAY = "0545 226 75 31";
export const CONTACT_EMAIL = "beekozmatik59@outlook.com";
export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FEE = 99;

/**
 * Gerçek IBAN’ınızı buraya yazın.
 * Boş veya örnek bırakılırsa müşteriye IBAN gösterilmez;
 * havale bilgisi WhatsApp üzerinden iletilir.
 */
export const BANK_ACCOUNT = {
  bank: "Ziraat Bankası",
  holder: "Bee Kozmetik",
  iban: "",
} as const;

export function hasBankDetails() {
  const iban = BANK_ACCOUNT.iban.replace(/\s/g, "");
  return iban.length >= 24 && !iban.includes("000000000000");
}

export const INSTALLMENT_OPTIONS = [
  { id: "pesin", label: "Peşin", note: "Tek seferde ödeme" },
  { id: "2", label: "2 Taksit", note: "WhatsApp ile planlanır" },
  { id: "3", label: "3 Taksit", note: "WhatsApp ile planlanır" },
] as const;

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
