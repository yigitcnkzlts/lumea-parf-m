import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-stage group relative overflow-hidden bg-[#05080f]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpeg"
          alt=""
          fill
          priority
          aria-hidden
          className="hero-ambient scale-125 object-cover opacity-40 blur-3xl transition duration-1000 group-hover:opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#05080f]/55" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-108px)] max-w-[1500px] items-center gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:px-8 lg:py-10">
        <div className="relative z-10 max-w-xl animate-rise lg:pb-8">
          <p className="font-serif text-[clamp(3.4rem,8vw,7.8rem)] leading-none tracking-[.12em] text-white transition duration-700 group-hover:tracking-[.16em]">
            BEE
          </p>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-px w-10 bg-[#c9a775] transition-all duration-700 group-hover:w-16" />
            <p className="text-[10px] tracking-[.34em] text-[#d4b48a]">YENİ SEZON · 2026</p>
          </div>
          <h1 className="mt-6 font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.08] tracking-[-.02em] text-white/95">
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
              className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.15em] text-white transition hover:border-[#c9a775] hover:bg-[#c9a775] hover:text-black"
            >
              EN ÇOK SATANLAR
            </Link>
          </div>
        </div>

        <div className="hero-frame relative mx-auto w-full max-w-[680px] lg:max-w-none">
          <div className="pointer-events-none absolute -inset-3 rounded-[2px] border border-[#c9a775]/20 transition duration-700 group-hover:border-[#c9a775]/55" />
          <div className="relative aspect-square overflow-hidden bg-[#0a1018] shadow-[0_30px_80px_rgba(0,0,0,.55)]">
            <div className="absolute inset-0 transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]">
              <Image
                src="/images/hero-bg.jpeg"
                alt="Seçkin parfüm koleksiyonu"
                fill
                priority
                className="hero-visual object-contain object-center"
                sizes="(max-width: 1024px) 90vw, 48vw"
              />
            </div>
            <div className="hero-sheen pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
