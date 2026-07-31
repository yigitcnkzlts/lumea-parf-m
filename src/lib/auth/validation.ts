import { z } from "zod";
import { isValidEmail } from "@/lib/validation";

export const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalı.")
  .max(72, "Şifre en fazla 72 karakter olabilir.")
  .regex(/[A-Za-zÇĞİÖŞÜçğıöşü]/, "Şifrede en az bir harf olmalı.")
  .regex(/[0-9]/, "Şifrede en az bir rakam olmalı.");

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-posta zorunludur.")
    .refine(isValidEmail, "Geçerli bir e-posta girin."),
  password: z.string().min(1, "Şifre zorunludur."),
});

const mustAccept = (message: string) =>
  z.boolean().refine((v): v is true => v === true, { message });

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Ad soyad en az 3 karakter olmalı.")
      .max(80, "Ad soyad çok uzun.")
      .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, "Ad ve soyadınızı yazın.")
      .refine(
        (v) => /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÊêÎîÔôÛû'’.\-\s]+$/.test(v),
        "Ad soyad yalnızca harf içermelidir.",
      ),
    email: z
      .string()
      .trim()
      .min(1, "E-posta zorunludur.")
      .refine(isValidEmail, "Geçerli bir e-posta girin."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Şifre tekrarını girin."),
    kvkk: mustAccept("KVKK onayını işaretleyin."),
    terms: mustAccept("Üyelik koşullarını kabul edin."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export const magicLinkSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-posta zorunludur.")
    .refine(isValidEmail, "Geçerli bir e-posta girin."),
  kvkk: mustAccept("KVKK onayını işaretleyin."),
  terms: mustAccept("Üyelik koşullarını kabul edin."),
});

export const socialConsentSchema = z.object({
  kvkk: mustAccept("KVKK onayını işaretleyin."),
  terms: mustAccept("Üyelik koşullarını kabul edin."),
});

export function mapAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-posta veya şifre hatalı.";
  if (m.includes("email not confirmed")) return "E-posta henüz doğrulanmamış. Gelen kutunuzu kontrol edin.";
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "Bu e-posta ile kayıt var. Giriş yapın.";
  }
  if (m.includes("password")) return "Şifre gereksinimlerini karşılamıyor.";
  if (m.includes("rate limit") || m.includes("too many")) return "Çok fazla deneme. Biraz sonra tekrar deneyin.";
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) {
    return "Bu giriş yöntemi henüz Supabase’de açılmamış.";
  }
  if (m.includes("network") || m.includes("fetch")) return "Bağlantı hatası. İnternetinizi kontrol edin.";
  return message || "İşlem başarısız. Tekrar deneyin.";
}
