import type { Metadata } from "next";
import { OrderDetail } from "@/components/account/order-detail";

export const metadata: Metadata = {
  title: "Sipariş detayı",
};

export default async function SiparisDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#faf8f3,#f1ebe2)]" />
      <section className="section-shell relative !py-16 md:!py-20">
        <OrderDetail orderId={id} />
      </section>
    </main>
  );
}
