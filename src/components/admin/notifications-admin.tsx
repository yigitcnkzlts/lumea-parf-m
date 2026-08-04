"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Job {
  id: string;
  channel: string;
  template_key: string;
  recipient: string;
  status: string;
  last_error: string | null;
  created_at: string;
}

export function NotificationsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [pendingStockAlerts, setPendingStockAlerts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetch("/api/admin/notifications")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yetkisiz");
        setJobs(data.jobs ?? []);
        setNewsletterCount(data.newsletterCount ?? 0);
        setPendingStockAlerts(data.pendingStockAlerts ?? 0);
      })
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    void load();
  }, []);

  if (error) {
    return (
      <div className="border border-black/10 bg-white/60 p-8">
        <p className="font-serif text-3xl">Bildirimler</p>
        <p className="mt-3 text-sm text-neutral-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-black/10 bg-white/50 p-5">
          <p className="text-[10px] tracking-[.18em] text-neutral-500">NEWSLETTER</p>
          <p className="mt-2 font-serif text-3xl">{newsletterCount}</p>
        </div>
        <div className="border border-black/10 bg-white/50 p-5">
          <p className="text-[10px] tracking-[.18em] text-neutral-500">STOK ALERT</p>
          <p className="mt-2 font-serif text-3xl">{pendingStockAlerts}</p>
        </div>
        <div className="border border-black/10 bg-white/50 p-5">
          <p className="text-[10px] tracking-[.18em] text-neutral-500">KUYRUK</p>
          <button
            type="button"
            disabled={busy}
            className="btn-dark mt-3 !min-h-10"
            onClick={async () => {
              setBusy(true);
              try {
                const res = await fetch("/api/admin/notifications", { method: "POST" });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                toast.success(`${data.processed} iş işlendi`);
                await load();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Hata");
              } finally {
                setBusy(false);
              }
            }}
          >
            KUYRUGU İŞLE
          </button>
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        E-posta/SMS gerçek gönderim için <code>EMAIL_PROVIDER</code> / <code>SMS_PROVIDER</code> gerekir. Provider yoksa işler failed olur — sahte “gönderildi” yok.
      </p>

      <div className="overflow-x-auto border border-black/10 bg-white/50">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 text-[10px] tracking-[.16em] text-neutral-500">
            <tr>
              <th className="px-4 py-3">KANAL</th>
              <th className="px-4 py-3">ŞABLON</th>
              <th className="px-4 py-3">ALICI</th>
              <th className="px-4 py-3">DURUM</th>
              <th className="px-4 py-3">HATA</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-black/5">
                <td className="px-4 py-3">{job.channel}</td>
                <td className="px-4 py-3">{job.template_key}</td>
                <td className="px-4 py-3">{job.recipient}</td>
                <td className="px-4 py-3">{job.status}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{job.last_error ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/admin" className="text-xs underline">
        ← Admin ana panel
      </Link>
    </div>
  );
}
