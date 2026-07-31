import type { Metadata } from "next";
import { OrderAdminDetail } from "@/components/admin/order-admin-detail";

export const metadata: Metadata = {
  title: "Admin · Sipariş detayı",
};

export default async function AdminSiparisDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="section-shell !py-16">
      <OrderAdminDetail orderId={id} />
    </main>
  );
}
