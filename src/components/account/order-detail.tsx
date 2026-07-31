"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/commerce/types";

interface OrderDetailData {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  customer_name: string;
  shipping_city: string;
  shipping_district: string;
  shipping_address: string;
  cargo_company: string | null;
  tracking_number: string | null;
  created_at: string;
  order_items: Array<{
    id: string;
    brand: string;
    name: string;
    size_ml: number;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch(`/api/account/orders/${orderId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sipariş bulunamadı.");
        if (active) setOrder(data.order);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  const reload = () => {
    void fetch(`/api/account/orders/${orderId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sipariş bulunamadı.");
        setOrder(data.order);
      })
      .catch((err: Error) => setError(err.message));
  };

  const act = async (action: "cancel" | "refund") => {
    const reason = window.prompt(action === "cancel" ? "İptal nedeni" : "İade nedeni");
    if (!reason) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/account/orders/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İşlem başarısız.");
      toast.success(action === "cancel" ? "Sipariş iptal edildi." : "İade talebi alındı.");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  if (error) return <p className="border border-red-200 bg-red-50 p-4 text-sm">{error}</p>;
  if (!order) return <p className="text-sm text-neutral-500">Yükleniyor…</p>;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/hesabim/siparislerim" className="text-xs tracking-wider underline">← Siparişlerim</Link>
        <p className="mt-4 text-[10px] tracking-[.2em] text-[#956f42]">{order.order_number}</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{ORDER_STATUS_LABELS[order.status]}</h1>
        <p className="mt-2 text-sm text-neutral-500">{new Date(order.created_at).toLocaleString("tr-TR")}</p>
      </div>

      <div className="border border-black/10 bg-white/50 p-6">
        <p className="text-[10px] tracking-[.2em] text-[#956f42]">ÜRÜNLER</p>
        <ul className="mt-4 space-y-3 text-sm">
          {order.order_items?.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 border-b border-black/5 pb-3">
              <span>{item.brand} {item.name} · {item.size_ml} ml × {item.quantity}</span>
              <b>{formatPrice(Number(item.line_total))}</b>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><b>{formatPrice(Number(order.subtotal))}</b></div>
          <div className="flex justify-between"><span>Kargo</span><b>{Number(order.shipping_fee) === 0 ? "Ücretsiz" : formatPrice(Number(order.shipping_fee))}</b></div>
          <div className="flex justify-between border-t border-black/10 pt-2"><span>Toplam</span><b>{formatPrice(Number(order.total))}</b></div>
        </div>
      </div>

      <div className="border border-black/10 bg-white/50 p-6 text-sm leading-6">
        <p className="text-[10px] tracking-[.2em] text-[#956f42]">TESLİMAT</p>
        <p className="mt-3">{order.customer_name}</p>
        <p>{order.shipping_address}</p>
        <p>{order.shipping_district} / {order.shipping_city}</p>
        {order.tracking_number && (
          <p className="mt-3">Kargo: {order.cargo_company} · Takip: {order.tracking_number}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {["pending", "awaiting_payment", "payment_failed"].includes(order.status) && (
          <button disabled={busy} className="btn-light" onClick={() => act("cancel")}>İPTAL ET</button>
        )}
        {["paid", "preparing", "shipped", "delivered"].includes(order.status) && (
          <button disabled={busy} className="btn-light" onClick={() => act("refund")}>İADE TALEBİ</button>
        )}
      </div>
    </div>
  );
}
