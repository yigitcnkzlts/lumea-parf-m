import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-stage group relative min-h-[calc(100svh-108px)] overflow-hidden bg-[#05080f]">
      <div className="absolute inset-0 scale-110">
        <Image
          src="/images/hero-bg.jpeg"
          alt=""
          fill
          priority
          aria-hidden
          className="hero-ambient object-cover object-center opacity-50 blur-2xl transition duration-[1200ms] ease-out group-hover:opacity-70 group-hover:blur-3xl"
          sizes="100vw"
        />
      </div>

      <div className="hero-frame absolute inset-y-0 right-0 w-full overflow-hidden md:w-[64%]">
        <div className="absolute inset-0 transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]">
          <Image
            src="/images/hero-bg.jpeg"
            alt="Seçkin parfüm koleksiyonu"
            fill
            priority
            className="hero-visual object-cover object-[center_30%] brightness-[0.92] contrast-[1.05] transition duration-[1400ms] ease-out group-hover:brightness-110 group-hover:contrast-110 md:object-center"
            sizes="(max-width: 768px) 100vw, 64vw"
          />
        </div>
        <div className="hero-sheen pointer-events-none absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-[#05080f]/30 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#05080f] via-[#05080f]/30 to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-8 right-0 hidden w-px bg-gradient-to-b from-transparent via-[#c9a775]/50 to-transparent opacity-0 transition duration-700 group-hover:opacity-100 lg:block" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#05080f] via-[#05080f]/92 to-transparent transition duration-700 group-hover:via-[#05080f]/78 md:via-[#05080f]/70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05080f]/80 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100svh-108px)] max-w-[1500px] items-end px-5 pb-16 pt-32 md:items-center md:pb-24 lg:px-8">
        <div className="max-w-xl animate-rise">
          <p className="font-serif text-[clamp(3.8rem,9vw,8.5rem)] leading-none tracking-[.12em] text-white transition duration-700 group-hover:tracking-[.16em]">
            BEE
          </p>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-px w-10 bg-[#c9a775] transition-all duration-700 group-hover:w-16" />
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
              className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.15em] text-white transition hover:border-[#c9a775] hover:bg-[#c9a775] hover:text-black"
            >
              EN ÇOK SATANLAR
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
