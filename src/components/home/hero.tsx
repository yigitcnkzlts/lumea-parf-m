import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#070b12]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpeg"
          alt="Dior Sauvage koleksiyonu"
          fill
          priority
          className="object-contain object-right md:object-[85%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/88 to-[#070b12]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12]/80 via-transparent to-[#070b12]/35" />
      </div>

      <div className="relative mx-auto flex min-h-[min(92svh,920px)] max-w-[1500px] items-end px-5 pb-16 pt-28 md:items-center md:pb-24 md:pt-24 lg:px-8">
        <div className="max-w-2xl animate-rise">
          <p className="mb-5 text-[10px] tracking-[.34em] text-[#d4b48a]">YENİ SEZON · 2026</p>
          <h1 className="font-serif text-[clamp(3.2rem,7vw,7.4rem)] leading-[.9] tracking-[-.04em] text-white">
            Kokunuz,<br /><em className="font-light">imzanızdır.</em>
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-7 text-white/75 md:text-base">
            Dünyanın seçkin parfüm markalarını keşfedin. Tarzınızı tamamlayan eşsiz kokuyu Bee ile bulun.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/urunler" className="btn-dark">
              KOLEKSİYONU KEŞFET <ArrowDownRight size={16} />
            </Link>
            <Link
              href="#cok-satanlar"
              className="btn-light border-white/35 bg-white/10 text-white hover:bg-white hover:text-black"
            >
              EN ÇOK SATANLAR
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
