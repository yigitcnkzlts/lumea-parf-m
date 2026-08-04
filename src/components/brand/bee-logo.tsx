import Link from "next/link";

export function BeeLogo({
  href = "/",
  compact = false,
  invert = false,
  className = "",
}: {
  href?: string | null;
  compact?: boolean;
  invert?: boolean;
  className?: string;
}) {
  const mark = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`grid h-9 w-9 place-items-center font-serif text-lg tracking-tight ${
          invert ? "bg-[#c9a775] text-[#141312]" : "bg-[#141312] text-[#c9a775]"
        }`}
        aria-hidden
      >
        B
      </span>
      <span className="leading-none">
        <span className={`block font-serif text-2xl tracking-[.12em] ${invert ? "text-white" : "text-[#141312]"}`}>
          BEE
        </span>
        {!compact && (
          <span className={`mt-1 block text-[9px] tracking-[.28em] ${invert ? "text-[#c9a775]" : "text-[#9c7749]"}`}>
            KOZMETİK
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} className="inline-flex" aria-label="Bee Kozmetik ana sayfa">
      {mark}
    </Link>
  );
}
