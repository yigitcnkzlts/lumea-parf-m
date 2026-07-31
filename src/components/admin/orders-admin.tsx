"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/data/products";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/commerce/types";

interface AdminOrder {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  total: number;
  customer_name: string;
  customer_email: string;
  created_at: string;
  cargo_company: string | null;
  tracking_number: string | null;
}

export function OrdersAdmin() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yetkisiz veya hata.");
        setOrders(data.orders ?? []);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="border border-black/10 bg-white/60 p-8">
        <p className="font-serif text-3xl">Admin erişimi</p>
        <p className="mt-3 text-sm text-neutral-600">{error}</p>
        <p className="mt-2 text-xs text-neutral-500">
          Admin yapmak için Supabase `profiles.role = &apos;admin&apos;` güncelleyin.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-black/10 bg-white/50">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-black/10 text-[10px] tracking-[.18em] text-neutral-500">
          <tr>
            <th className="px-4 py-3">SİPARİŞ</th>
            <th className="px-4 py-3">MÜŞTERİ</th>
            <th className="px-4 py-3">DURUM</th>
            <th className="px-4 py-3">TUTAR</th>
            <th className="px-4 py-3">KARGO</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-black/5">
              <td className="px-4 py-4">
                <Link href={`/admin/siparisler/${order.id}`} className="underline">
                  {order.order_number}
                </Link>
                <p className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleString("tr-TR")}</p>
              </td>
              <td className="px-4 py-4">
                <p>{order.customer_name}</p>
                <p className="text-xs text-neutral-500">{order.customer_email}</p>
              </td>
              <td className="px-4 py-4">{ORDER_STATUS_LABELS[order.status] ?? order.status}</td>
              <td className="px-4 py-4">{formatPrice(Number(order.total))}</td>
              <td className="px-4 py-4 text-xs">{order.tracking_number ? `${order.cargo_company} / ${order.tracking_number}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
