import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme başarılı",
};

export default async function OdemeBasariliPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,167,117,.2),transparent_45%),linear-gradient(180deg,#faf8f3,#efe9de)]" />
      <section className="section-shell relative flex min-h-[60vh] flex-col items-start justify-center !py-20">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">ÖDEME</p>
        <h1 className="mt-3 max-w-2xl font-serif text-5xl md:text-6xl">Ödemeniz onaylandı</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600">
          Siparişiniz iyzico tarafından sunucu tarafında doğrulandıktan sonra hazırlığa alındı.
          {order ? <> Sipariş numaranız: <b>{order}</b>.</> : null}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/hesabim/siparislerim" className="btn-dark">SİPARİŞLERİM</Link>
          <Link href="/urunler" className="btn-light">ALIŞVERİŞE DEVAM</Link>
        </div>
      </section>
    </main>
  );
}
