export type PaymentProviderName = "iyzico";

export interface InitializeCheckoutInput {
  orderId: string;
  orderNumber: string;
  total: number;
  currency: "TRY";
  customer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    identityNumber?: string;
    ip: string;
    city: string;
    address: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  callbackUrl: string;
}

export interface InitializeCheckoutResult {
  provider: PaymentProviderName;
  token: string;
  checkoutFormContent: string;
  conversationId: string;
  paymentPageUrl?: string;
}

export interface VerifyPaymentInput {
  token: string;
  conversationId?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  paymentId: string | null;
  conversationId: string | null;
  paidPrice: number | null;
  raw: Record<string, unknown>;
  errorMessage?: string;
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  readonly configured: boolean;
  initializeCheckout(input: InitializeCheckoutInput): Promise<InitializeCheckoutResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}

export function isIyzicoConfigured() {
  const apiKey = process.env.IYZICO_API_KEY?.trim() ?? "";
  const secret = process.env.IYZICO_SECRET_KEY?.trim() ?? "";
  return Boolean(
    apiKey &&
      secret &&
      !apiKey.includes("YOUR_IYZICO") &&
      !secret.includes("YOUR_IYZICO"),
  );
}

export function missingIyzicoMessage() {
  return "iyzico sandbox anahtarları eksik. IYZICO_API_KEY ve IYZICO_SECRET_KEY değerlerini .env.local dosyasına ekleyin. Sahte başarılı ödeme oluşturulmaz.";
}
