import type { Metadata } from "next";
import { NotificationsAdmin } from "@/components/admin/notifications-admin";

export const metadata: Metadata = {
  title: "Admin · Bildirimler",
};

export default function AdminBildirimlerPage() {
  return (
    <main className="section-shell !py-16">
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">ADMIN</p>
      <h1 className="mt-3 font-serif text-5xl">Bildirimler</h1>
      <p className="mt-3 text-sm text-neutral-600">Sipariş e-posta/SMS kuyruğu ve abone özeti.</p>
      <div className="mt-10">
        <NotificationsAdmin />
      </div>
    </main>
  );
}
