import { SoftImage } from "@/components/media/soft-image";

export const aboutGallery = [
  {
    primary: "/images/about/store-1.jpg",
    fallback: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
    alt: "Bee Kozmetik — mağaza / koleksiyon",
    caption: "Seçkin koleksiyon",
  },
  {
    primary: "/images/about/packaging.jpg",
    fallback: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85",
    alt: "Özenli paketleme",
    caption: "Özenli paketleme",
  },
  {
    primary: "/images/about/tekirdag.jpg",
    fallback: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=85",
    alt: "Tekirdağ’dan yola çıkar",
    caption: "Tekirdağ’dan yola çıkar",
  },
] as const;

export function AboutGalleryGrid() {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-3">
      {aboutGallery.map((item) => (
        <li key={item.primary} className="group">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe5da]">
            <SoftImage
              primary={item.primary}
              fallback={item.fallback}
              alt={item.alt}
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <p className="mt-3 text-[10px] tracking-[.2em] text-neutral-500">{item.caption}</p>
        </li>
      ))}
    </ul>
  );
}
