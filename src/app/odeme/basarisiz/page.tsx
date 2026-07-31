import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme başarısız",
};

export default async function OdemeBasarisizPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reason?: string }>;
}) {
  const { order, reason } = await searchParams;
  const reasonText =
    reason === "config"
      ? "Ödeme sağlayıcısı henüz yapılandırılmadı."
      : reason === "amount"
        ? "Ödeme tutarı doğrulanamadı."
        : reason === "token"
          ? "Ödeme oturumu bulunamadı."
          : "Ödeme tamamlanamadı veya doğrulanamadı.";

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(120,80,40,.12),transparent_40%),linear-gradient(180deg,#faf8f3,#f2ece3)]" />
      <section className="section-shell relative flex min-h-[60vh] flex-col items-start justify-center !py-20">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖDEME</p>
        <h1 className="mt-3 max-w-2xl font-serif text-5xl md:text-6xl">Ödeme alınamadı</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600">
          {reasonText}
          {order ? <> Sipariş: <b>{order}</b>.</> : null} Stok rezervasyonunuz serbest bırakılmış olabilir; tekrar deneyebilirsiniz.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/odeme" className="btn-dark">TEKRAR DENE</Link>
          <Link href="/hesabim/siparislerim" className="btn-light">SİPARİŞLERİM</Link>
        </div>
      </section>
    </main>
  );
}
