import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-108px)] overflow-hidden bg-[#05080f]">
      {/* Ambient color wash from the same photo */}
      <div className="absolute inset-0 scale-110">
        <Image
          src="/images/hero-bg.jpeg"
          alt=""
          fill
          priority
          aria-hidden
          className="hero-ambient object-cover object-center opacity-55 blur-2xl"
          sizes="100vw"
        />
      </div>

      {/* Sharp visual plane — edge to edge on the right */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
        <Image
          src="/images/hero-bg.jpeg"
          alt="Seçkin parfüm koleksiyonu"
          fill
          priority
          className="hero-visual object-cover object-[center_30%] md:object-center"
          sizes="(max-width: 768px) 100vw, 62vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-[#05080f]/25 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#05080f] via-[#05080f]/35 to-transparent md:block" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#05080f] via-[#05080f]/92 to-transparent md:via-[#05080f]/70" />

      <div className="relative mx-auto flex min-h-[calc(100svh-108px)] max-w-[1500px] items-end px-5 pb-16 pt-32 md:items-center md:pb-24 lg:px-8">
        <div className="max-w-xl animate-rise">
          <p className="font-serif text-[clamp(3.8rem,9vw,8.5rem)] leading-none tracking-[.12em] text-white">
            BEE
          </p>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-px w-10 bg-[#c9a775]" />
            <p className="text-[10px] tracking-[.34em] text-[#d4b48a]">YENİ SEZON · 2026</p>
          </div>
          <h1 className="mt-6 font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.05] tracking-[-.02em] text-white/95">
            Kokunuz, <em>imzanızdır.</em>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65 md:text-[15px]">
            Dünyanın seçkin parfüm markalarını keşfedin. Tarzınızı tamamlayan eşsiz kokuyu Bee ile bulun.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/urunler" className="btn-dark">
              KOLEKSİYONU KEŞFET <ArrowDownRight size={16} />
            </Link>
            <Link
              href="#cok-satanlar"
              className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.15em] text-white transition hover:bg-white hover:text-black"
            >
              EN ÇOK SATANLAR
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
