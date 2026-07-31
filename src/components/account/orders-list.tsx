"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/data/products";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/commerce/types";

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  total: number;
  created_at: string;
  cargo_company: string | null;
  tracking_number: string | null;
}

export function OrdersList() {
  const auth = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.user) return;

    let active = true;
    void fetch("/api/account/orders")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Siparişler alınamadı.");
        if (active) setOrders(data.orders ?? []);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [auth.user]);

  if (!auth.user) {
    return (
      <div className="border border-black/10 bg-white/50 p-8 text-center">
        <p className="font-serif text-3xl">Giriş gerekli</p>
        <button className="btn-dark mt-6" onClick={() => auth.setAuthOpen(true)}>GİRİŞ YAP</button>
      </div>
    );
  }

  if (error) return <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>;
  if (orders === null) return <p className="text-sm text-neutral-500">Siparişler yükleniyor…</p>;
  if (!orders.length) {
    return (
      <div className="border border-black/10 bg-white/50 p-8 text-center">
        <p className="font-serif text-3xl">Henüz siparişiniz yok</p>
        <Link href="/urunler" className="btn-dark mt-6 inline-flex">ALIŞVERİŞE BAŞLA</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/hesabim/siparislerim/${order.id}`}
          className="block border border-black/10 bg-white/50 p-5 transition hover:border-[#956f42]/50"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[.2em] text-[#956f42]">{order.order_number}</p>
              <p className="mt-1 font-serif text-2xl">{ORDER_STATUS_LABELS[order.status] ?? order.status}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {new Date(order.created_at).toLocaleString("tr-TR")}
              </p>
            </div>
            <b className="text-sm">{formatPrice(Number(order.total))}</b>
          </div>
          {order.tracking_number && (
            <p className="mt-3 text-xs text-neutral-600">
              Kargo: {order.cargo_company} · {order.tracking_number}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
