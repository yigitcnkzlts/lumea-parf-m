import { redirect } from "next/navigation";

/** Legacy route — checkout moved to /odeme (iyzico Checkout Form). */
export default function OrderPage() {
  redirect("/odeme");
}
