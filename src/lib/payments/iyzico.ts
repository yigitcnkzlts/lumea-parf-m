import crypto from "node:crypto";
import {
  isIyzicoConfigured,
  missingIyzicoMessage,
  type InitializeCheckoutInput,
  type InitializeCheckoutResult,
  type PaymentProvider,
  type VerifyPaymentInput,
  type VerifyPaymentResult,
} from "@/lib/payments/types";

/**
 * iyzico Checkout Form provider.
 * Card data never touches our servers — only token + verification APIs.
 * Without env keys, methods throw (no fake success).
 */
export class IyzicoCheckoutFormProvider implements PaymentProvider {
  readonly name = "iyzico" as const;

  get configured() {
    return isIyzicoConfigured();
  }

  private baseUrl() {
    return (process.env.IYZICO_BASE_URL?.trim() || "https://sandbox-api.iyzipay.com").replace(/\/$/, "");
  }

  private assertConfigured() {
    if (!this.configured) throw new Error(missingIyzicoMessage());
  }

  private authHeader(path: string, body: string) {
    const apiKey = process.env.IYZICO_API_KEY!.trim();
    const secretKey = process.env.IYZICO_SECRET_KEY!.trim();
    const randomKey = `${Date.now()}${crypto.randomBytes(8).toString("hex")}`;
    const payload = randomKey + path + body;
    const encrypted = crypto.createHmac("sha256", secretKey).update(payload).digest("base64");
    const authorization = `IYZWSv2 ${Buffer.from(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${encrypted}`).toString("base64")}`;
    return { authorization, randomKey };
  }

  private async post<T>(path: string, payload: Record<string, unknown>): Promise<T> {
    this.assertConfigured();
    const body = JSON.stringify(payload);
    const { authorization, randomKey } = this.authHeader(path, body);
    const res = await fetch(`${this.baseUrl()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        "x-iyzi-rnd": randomKey,
      },
      body,
    });
    const data = (await res.json()) as T & { status?: string; errorMessage?: string };
    return data;
  }

  async initializeCheckout(input: InitializeCheckoutInput): Promise<InitializeCheckoutResult> {
    this.assertConfigured();

    const [name, ...rest] = input.customer.name.trim().split(/\s+/);
    const surname = input.customer.surname || rest.join(" ") || "Musteri";
    const conversationId = input.orderNumber;

    const payload = {
      locale: "tr",
      conversationId,
      price: input.total.toFixed(2),
      paidPrice: input.total.toFixed(2),
      currency: input.currency,
      basketId: input.orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: input.callbackUrl,
      enabledInstallments: input.enabledInstallments?.length
        ? input.enabledInstallments
        : [1, 2, 3, 6, 9],
      buyer: {
        id: input.customer.id,
        name: name || "Musteri",
        surname,
        gsmNumber: normalizePhone(input.customer.phone),
        email: input.customer.email,
        identityNumber: input.customer.identityNumber || "11111111111",
        registrationAddress: input.customer.address,
        ip: input.customer.ip,
        city: input.customer.city,
        country: "Turkey",
      },
      shippingAddress: {
        contactName: `${name} ${surname}`.trim(),
        city: input.customer.city,
        country: "Turkey",
        address: input.customer.address,
      },
      billingAddress: {
        contactName: `${name} ${surname}`.trim(),
        city: input.customer.city,
        country: "Turkey",
        address: input.customer.address,
      },
      basketItems: input.basketItems.map((item) => ({
        id: item.id,
        name: item.name.slice(0, 120),
        category1: item.category,
        itemType: "PHYSICAL",
        price: (item.price * item.quantity).toFixed(2),
      })),
    };

    const result = await this.post<{
      status: string;
      token?: string;
      checkoutFormContent?: string;
      paymentPageUrl?: string;
      errorMessage?: string;
      conversationId?: string;
    }>("/payment/iyzipos/checkoutform/initialize/auth/ecom", payload);

    if (result.status !== "success" || !result.token || !result.checkoutFormContent) {
      throw new Error(result.errorMessage || "iyzico Checkout Form başlatılamadı.");
    }

    return {
      provider: "iyzico",
      token: result.token,
      checkoutFormContent: result.checkoutFormContent,
      conversationId: result.conversationId || conversationId,
      paymentPageUrl: result.paymentPageUrl,
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    this.assertConfigured();

    const result = await this.post<{
      status: string;
      paymentStatus?: string;
      paymentId?: string | number;
      conversationId?: string;
      paidPrice?: string | number;
      errorMessage?: string;
      [key: string]: unknown;
    }>("/payment/iyzipos/checkoutform/auth/ecom/detail", {
      locale: "tr",
      conversationId: input.conversationId || undefined,
      token: input.token,
    });

    const success = result.status === "success" && result.paymentStatus === "SUCCESS";
    const raw = { ...result };
    // Never retain anything that looks like card data
    delete raw.cardNumber;
    delete raw.binNumber;

    return {
      success,
      paymentId: result.paymentId != null ? String(result.paymentId) : null,
      conversationId: result.conversationId ?? input.conversationId ?? null,
      paidPrice: result.paidPrice != null ? Number(result.paidPrice) : null,
      raw: raw as Record<string, unknown>,
      errorMessage: success ? undefined : result.errorMessage || "Ödeme doğrulanamadı.",
    };
  }
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return `+${digits}`;
  if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
  return `+90${digits}`;
}
