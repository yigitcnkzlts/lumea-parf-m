import { IyzicoCheckoutFormProvider } from "@/lib/payments/iyzico";
import type { PaymentProvider } from "@/lib/payments/types";

let singleton: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!singleton) singleton = new IyzicoCheckoutFormProvider();
  return singleton;
}
