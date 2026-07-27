export const WHATSAPP_PHONE = "905452267531";
export const WHATSAPP_DISPLAY = "0545 226 75 31";
export const CONTACT_EMAIL = "beekozmatik59@outlook.com";
export const FREE_SHIPPING_THRESHOLD = 1500;

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
