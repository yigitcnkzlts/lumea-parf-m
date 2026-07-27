export type DeliveryErrors = Partial<Record<"name" | "phone" | "email" | "city" | "district" | "address", string>>;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** TR cep: 05XXXXXXXXX (11 hane) veya 5XXXXXXXXX (10 hane) */
export function normalizeTrPhone(value: string) {
  let digits = digitsOnly(value);
  if (digits.startsWith("90") && digits.length >= 12) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("5")) digits = `0${digits}`;
  return digits;
}

export function isValidTrPhone(value: string) {
  const phone = normalizeTrPhone(value);
  return /^05\d{9}$/.test(phone);
}

export function formatTrPhone(value: string) {
  const phone = normalizeTrPhone(value).slice(0, 11);
  if (phone.length <= 4) return phone;
  if (phone.length <= 7) return `${phone.slice(0, 4)} ${phone.slice(4)}`;
  if (phone.length <= 9) return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 9)} ${phone.slice(9)}`;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function validateDelivery(input: {
  name: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  cities: readonly string[];
}): DeliveryErrors {
  const errors: DeliveryErrors = {};
  const name = input.name.trim().replace(/\s+/g, " ");
  const parts = name.split(" ").filter(Boolean);

  if (name.length < 5) errors.name = "Ad soyad en az 5 karakter olmalı.";
  else if (parts.length < 2) errors.name = "Lütfen ad ve soyadınızı yazın.";
  else if (!/^[A-Za-zÇĞİÖŞÜçğıöşüÂâÊêÎîÔôÛû'’.\-\s]+$/.test(name)) {
    errors.name = "Ad soyad yalnızca harf içermelidir.";
  }

  if (!input.phone.trim()) errors.phone = "Telefon zorunludur.";
  else if (!isValidTrPhone(input.phone)) {
    errors.phone = "Geçerli bir cep telefonu girin (05XX XXX XX XX).";
  }

  if (input.email.trim() && !isValidEmail(input.email)) {
    errors.email = "Geçerli bir e-posta adresi girin.";
  }

  if (!input.city || !input.cities.includes(input.city)) {
    errors.city = "Listeden bir il seçin.";
  }

  if (input.district.trim().length < 2) {
    errors.district = "İlçe zorunludur.";
  }

  if (input.address.trim().length < 10) {
    errors.address = "Açık adres en az 10 karakter olmalı (mahalle, sokak, no).";
  }

  return errors;
}

export function isDeliveryComplete(input: Parameters<typeof validateDelivery>[0]) {
  return Object.keys(validateDelivery(input)).length === 0;
}
