import type { Metadata } from "next";
import { NotificationsAdmin } from "@/components/admin/notifications-admin";

export const metadata: Metadata = {
  title: "Bildirimler",
};

export default function AdminBildirimlerPage() {
  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">BİLDİRİM</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Bildirimler</h1>
      <p className="mt-3 text-sm text-neutral-600">Sipariş e-posta/SMS kuyruğu, newsletter ve stok alert özeti.</p>
      <div className="mt-8">
        <NotificationsAdmin />
      </div>
    </div>
  );
}
