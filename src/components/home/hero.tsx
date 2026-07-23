import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-108px)] overflow-hidden bg-[#0b1018]">
      <Image
        src="/images/hero-bg.jpeg"
        alt="Dior Sauvage koleksiyonu"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="relative mx-auto flex min-h-[calc(100svh-108px)] max-w-[1500px] items-center px-5 py-20 lg:px-8">
        <div className="max-w-3xl animate-rise">
          <p className="mb-5 text-[10px] tracking-[.34em] text-[#d4b48a]">YENİ SEZON · 2026</p>
          <h1 className="max-w-2xl font-serif text-[clamp(3.6rem,7.8vw,8.2rem)] leading-[.87] tracking-[-.045em] text-white">
            Kokunuz,<br /><em className="font-light">imzanızdır.</em>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/75 md:text-base">Dünyanın seçkin parfüm markalarını keşfedin. Tarzınızı tamamlayan eşsiz kokuyu Bee ile bulun.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/urunler" className="btn-dark">KOLEKSİYONU KEŞFET <ArrowDownRight size={16} /></Link>
            <Link href="#cok-satanlar" className="btn-light border-white/40 bg-white/10 text-white hover:bg-white hover:text-black">EN ÇOK SATANLAR</Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-[10px] tracking-[.2em] text-white/70 lg:flex"><span className="h-px w-16 bg-white/50" /> AŞAĞI KAYDIR</div>
    </section>
  );
}
