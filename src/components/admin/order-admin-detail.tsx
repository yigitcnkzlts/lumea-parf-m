"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/commerce/types";

export function OrderAdminDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargoCompany, setCargoCompany] = useState("Yurtiçi Kargo");
  const [trackingNumber, setTrackingNumber] = useState("");

  const reload = () => {
    void fetch(`/api/admin/orders/${orderId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Hata");
        setOrder(data.order);
        if (data.order.cargo_company) setCargoCompany(data.order.cargo_company);
        if (data.order.tracking_number) setTrackingNumber(data.order.tracking_number);
      })
      .catch((err: Error) => setError(err.message));
  };

  useEffect(() => {
    let active = true;
    void fetch(`/api/admin/orders/${orderId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Hata");
        if (!active) return;
        setOrder(data.order);
        if (data.order.cargo_company) setCargoCompany(data.order.cargo_company);
        if (data.order.tracking_number) setTrackingNumber(data.order.tracking_number);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  const onShipping = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "shipping", cargoCompany, trackingNumber }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Kargo güncellenemedi.");
      return;
    }
    toast.success("Kargo bilgisi kaydedildi.");
    reload();
  };

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!order) return <p className="text-sm text-neutral-500">Yükleniyor…</p>;

  const status = order.status as OrderStatus;
  const items = (order.order_items as Array<Record<string, unknown>>) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/siparisler" className="text-xs underline">← Admin siparişler</Link>
        <p className="mt-4 text-[10px] tracking-[.2em] text-[#956f42]">{String(order.order_number)}</p>
        <h1 className="mt-2 font-serif text-4xl">{ORDER_STATUS_LABELS[status] ?? status}</h1>
        <p className="mt-2 text-sm text-neutral-600">Ödeme: {String(order.payment_status)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-black/10 bg-white/50 p-6 text-sm">
          <p className="text-[10px] tracking-[.2em] text-[#956f42]">MÜŞTERİ</p>
          <p className="mt-3">{String(order.customer_name)}</p>
          <p>{String(order.customer_email)}</p>
          <p>{String(order.customer_phone)}</p>
          <p className="mt-3">{String(order.shipping_address)}</p>
          <p>{String(order.shipping_district)} / {String(order.shipping_city)}</p>
        </div>

        <form onSubmit={onShipping} className="border border-black/10 bg-white/50 p-6 space-y-4">
          <p className="text-[10px] tracking-[.2em] text-[#956f42]">KARGO</p>
          <label className="block text-[10px] tracking-widest text-neutral-500">KARGO FİRMASI
            <input required value={cargoCompany} onChange={(e) => setCargoCompany(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
          </label>
          <label className="block text-[10px] tracking-widest text-neutral-500">TAKİP NO
            <input required value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
          </label>
          <button className="btn-dark">KARGOYA VER / GÜNCELLE</button>
        </form>
      </div>

      <div className="border border-black/10 bg-white/50 p-6">
        <p className="text-[10px] tracking-[.2em] text-[#956f42]">KALEMLER</p>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li key={String(item.id)} className="flex justify-between">
              <span>{String(item.brand)} {String(item.name)} · {String(item.size_ml)} ml × {String(item.quantity)}</span>
              <b>{formatPrice(Number(item.line_total))}</b>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">Toplam: <b>{formatPrice(Number(order.total))}</b></p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="btn-light"
          onClick={async () => {
            const reason = window.prompt("İptal nedeni");
            if (!reason) return;
            const res = await fetch(`/api/admin/orders/${orderId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "cancel", reason }),
            });
            const data = await res.json();
            if (!res.ok) toast.error(data.error);
            else {
              toast.success("İptal edildi");
              reload();
            }
          }}
        >
          İPTAL
        </button>
        <button
          className="btn-light"
          onClick={async () => {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "refunded" }),
            });
            const data = await res.json();
            if (!res.ok) toast.error(data.error);
            else {
              toast.success("İade tamamlandı olarak işaretlendi");
              reload();
            }
          }}
        >
          İADE TAMAMLANDI
        </button>
      </div>
    </div>
  );
}
