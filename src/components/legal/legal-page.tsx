import type { Metadata } from "next";
import Link from "next/link";

export function LegalPage({
  title,
  eyebrow,
  description,
  sections,
}: {
  title: string;
  eyebrow: string;
  description: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <main className="section-shell">
      <header className="mb-12 max-w-3xl">
        <p className="text-[10px] tracking-[.3em] text-[#956f42]">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">{title}</h1>
        <p className="mt-5 leading-7 text-neutral-600">{description}</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-10">
        {sections.map((section) => (
          <section key={section.heading} className="border-t border-black/10 pt-8">
            <h2 className="font-serif text-3xl">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-sm leading-7 text-neutral-600">{paragraph}</p>
            ))}
          </section>
        ))}
        <p className="border-t border-black/10 pt-8 text-sm text-neutral-500">
          Sorularınız için <Link href="/iletisim" className="underline">iletişim</Link> veya{" "}
          <Link href="/hizmetler" className="underline">hizmetler</Link> sayfalarını kullanabilirsiniz.
        </p>
      </div>
    </main>
  );
}

export type LegalMetadata = Metadata;
