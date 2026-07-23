"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, CreditCard, Headphones, PackageCheck, RotateCcw, ShieldCheck, Sparkles, Star, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { brands } from "@/data/brands";
import { products } from "@/data/products";

const categoryImages = [
  ["Kadın Parfümleri", "Zarafetin unutulmaz ifadesi", "/kadin-parfumleri", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85"],
  ["Erkek Parfümleri", "Güçlü ve karakterli seçimler", "/erkek-parfumleri", "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=85"],
  ["Unisex Parfümler", "Sınırların ötesinde kokular", "/unisex", "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=85"],
  ["Niş Parfümler", "Nadir ve özgün kompozisyonlar", "/urunler", "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85"],
];
const families = [
  ["Çiçeksi", "Gül ve yaseminin zarif uyumu", "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80"],
  ["Odunsu", "Sıcak ve sofistike derinlik", "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"],
  ["Oryantal", "Gizemli ve duyusal dokunuş", "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=600&q=80"],
  ["Ferah", "Temiz ve enerjik bir esinti", "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80"],
  ["Meyveli", "Canlı, neşeli ve parlak", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"],
  ["Baharatlı", "Cesur ve sıcak karakter", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"],
  ["Narenciye", "Taze bergamot ve limon ışıltısı", "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80"],
];
const instagram = [
  "photo-1547887538-e3a2f32cb1cc", "photo-1610461888750-10bfc601b874", "photo-1594035910387-fea47794261f",
  "photo-1523293182086-7651a899d37f", "photo-1619994403073-2cec844b8e63", "photo-1541643600914-78b084683601",
];

export function BrandMarquee() {
  const line = brands.map((brand) => <Link key={brand} href={`/urunler?brand=${encodeURIComponent(brand)}`} className="mx-8 shrink-0 font-serif text-xl tracking-[.08em] text-neutral-700 md:mx-12 md:text-2xl">{brand}</Link>);
  return <section aria-label="Markalar" className="marquee-mask overflow-hidden border-y border-black/10 bg-[#f7f4ed] py-7"><div className="marquee-track flex w-max hover:[animation-play-state:paused]">{line}{brands.map((brand) => <Link aria-hidden="true" tabIndex={-1} key={`copy-${brand}`} href={`/urunler?brand=${encodeURIComponent(brand)}`} className="mx-8 shrink-0 font-serif text-xl tracking-[.08em] text-neutral-700 md:mx-12 md:text-2xl">{brand}</Link>)}</div></section>;
}

export function CategorySection() {
  return <section className="section-shell"><SectionTitle eyebrow="KENDİNİZE ÖZEL" title="Koleksiyonları Keşfedin" /><div className="grid gap-4 md:grid-cols-2">{categoryImages.map(([title, text, href, image], index) => <Link href={href} key={title} className={`image-card group relative overflow-hidden ${index < 2 ? "aspect-[4/3]" : "aspect-[5/3]"}`}><Image src={image} alt="" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition group-hover:bg-black/30" /><div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-10"><h3 className="font-serif text-3xl md:text-4xl">{title}</h3><p className="mt-2 text-xs text-white/75">{text}</p><span className="mt-5 inline-block border-b border-white pb-1 text-[10px] tracking-[.2em]">KEŞFET</span></div></Link>)}</div></section>;
}

export function ProductSection({ type }: { type: "best" | "new" }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const list = products.filter((p) => type === "best" ? p.isBestSeller : p.isNew);
  const scroll = (direction: number) => rowRef.current?.scrollBy({ left: direction * rowRef.current.clientWidth * .75, behavior: "smooth" });
  return <section id={type === "best" ? "cok-satanlar" : undefined} className="section-shell"><div className="flex items-end justify-between"><SectionTitle eyebrow={type === "best" ? "BEE SEÇKİSİ" : "YENİ KEŞİFLER"} title={type === "best" ? "En Çok Satan Parfümler" : "Yeni Gelenler"} align="left" /><div className="mb-12 hidden gap-2 sm:flex"><button aria-label="Önceki ürünler" onClick={() => scroll(-1)} className="arrow-button"><ArrowLeft size={18} /></button><button aria-label="Sonraki ürünler" onClick={() => scroll(1)} className="arrow-button"><ArrowRight size={18} /></button></div></div><div ref={rowRef} className="hide-scrollbar grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto sm:auto-cols-[47%] lg:auto-cols-[calc(25%-12px)]">{list.map((product) => <div className="snap-start" key={product.id}><ProductCard product={product} /></div>)}</div></section>;
}

export function CollectionBanner() {
  return <section className="relative min-h-[560px] overflow-hidden bg-[#151514]"><Image src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=85" alt="" fill className="object-cover opacity-35" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" /><div className="relative mx-auto flex min-h-[560px] max-w-[1500px] items-center px-5 lg:px-8"><div className="max-w-2xl text-white"><p className="text-[10px] tracking-[.3em] text-[#c9a775]">ÖZEL KOLEKSİYON</p><h2 className="mt-5 font-serif text-5xl leading-none md:text-7xl">Geceye İz Bırakan Kokular</h2><p className="mt-6 max-w-lg leading-7 text-white/65">Yoğun, karakterli ve unutulmaz parfümlerden oluşan özel koleksiyonu keşfedin.</p><Link href="/urunler" className="mt-8 inline-flex border border-[#c9a775] px-7 py-4 text-xs tracking-[.15em] text-[#e5c89d] transition hover:bg-[#c9a775] hover:text-black">KOLEKSİYONU İNCELE</Link></div></div></section>;
}

export function ScentFamilies() {
  return <section className="section-shell"><SectionTitle eyebrow="KOKUNUN DİLİ" title="Koku Aileleri" /><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-7">{families.map(([title, text, image]) => <Link href={`/urunler?family=${title}`} key={title} className="group text-center"><div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full"><Image src={image} alt="" fill className="object-cover transition duration-700 group-hover:scale-110" sizes="17vw" /></div><h3 className="mt-5 font-serif text-xl">{title}</h3><p className="mx-auto mt-1 max-w-40 text-xs leading-5 text-neutral-500">{text}</p></Link>)}</div></section>;
}

export function Campaigns() {
  const cards = [
    ["İkinci ürüne özel indirim", "Birlikte daha güzel", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85"],
    ["Yaz kokularında fırsatlar", "Ferahlığı keşfedin", "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1000&q=85"],
    ["Niş parfümlerde seçili fırsatlar", "Sıradanlığın ötesinde", "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1000&q=85"],
  ];
  return <section id="kampanyalar" className="section-shell"><SectionTitle eyebrow="SADECE SİZE ÖZEL" title="Bee Ayrıcalıkları" /><div className="grid gap-4 md:grid-cols-2">{cards.map(([title, text, image], i) => <Link href="/urunler" key={title} className={`group relative overflow-hidden ${i === 0 ? "min-h-[570px] md:row-span-2" : "min-h-[277px]"}`}><Image src={image} alt="" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="50vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-0 p-7 text-white"><p className="text-xs text-white/65">{text}</p><h3 className="mt-2 max-w-md font-serif text-3xl">{title}</h3><span className="mt-4 inline-block text-[10px] tracking-widest underline underline-offset-4">FIRSATI KEŞFET</span></div></Link>)}</div></section>;
}

export function TrustAndReviews() {
  const perks = [[ShieldCheck, "Orijinal Ürün", "Yetkili tedarik garantisi"], [CreditCard, "Güvenli Ödeme", "256-bit SSL koruması"], [PackageCheck, "Hızlı Kargo", "Özenli ve hızlı teslimat"], [RotateCcw, "Kolay İade", "14 gün içinde iade"], [Headphones, "Uzman Destek", "Koku danışmanlığı"]];
  const reviews = [["Elif A.", "Coco Mademoiselle", "Paketleme başlı başına bir deneyimdi. Ürün tamamen orijinal ve teslimat çok hızlıydı."], ["Mert K.", "Sauvage Elixir", "Koku danışmanının önerisi tam isabet oldu. Kalıcılığı ve performansı harika."], ["Deniz S.", "Libre Intense", "Bee artık parfüm alışverişindeki tek adresim. Her detay çok özenli."]];
  return <><section id="hakkimizda" className="border-y border-black/10 bg-white py-12"><div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-8 px-5 md:grid-cols-5 lg:px-8">{perks.map(([Icon, title, text]) => { const I = Icon as typeof ShieldCheck; return <div key={title as string} className="text-center"><I className="mx-auto text-[#9d7747]" strokeWidth={1.2} /><h3 className="mt-3 font-serif text-lg">{title as string}</h3><p className="mt-1 text-[11px] text-neutral-500">{text as string}</p></div>; })}</div></section><section className="section-shell"><SectionTitle eyebrow="SİZDEN GELENLER" title="Bee Deneyimleri" /><div className="grid gap-4 md:grid-cols-3">{reviews.map(([name, product, text]) => <article key={name} className="border border-black/10 bg-white p-7 md:p-9"><div className="flex gap-1 text-[#b68c55]">{Array.from({length:5}).map((_,i)=><Star key={i} size={13} fill="currentColor" />)}</div><blockquote className="mt-6 font-serif text-xl leading-8">“{text}”</blockquote><div className="mt-7 border-t border-black/10 pt-5"><div className="flex items-center justify-between"><b className="text-sm">{name}</b><span className="flex items-center gap-1 text-[9px] text-emerald-700"><BadgeCheck size={13} /> DOĞRULANMIŞ</span></div><p className="mt-1 text-xs text-neutral-500">{product}</p></div></article>)}</div></section></>;
}

export function GuideAndInstagram() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <><section className="relative overflow-hidden bg-[#ded5c5] py-24"><Sparkles className="absolute -right-16 -top-16 h-72 w-72 text-white/20" strokeWidth={.5} /><div className="relative mx-auto max-w-4xl px-5 text-center"><p className="text-[10px] tracking-[.3em] text-[#795c3b]">KOKU REHBERİ</p><h2 className="mt-4 font-serif text-5xl md:text-7xl">Hangi Koku Size Uygun?</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-neutral-600">Birkaç basit seçimle karakterinizi tamamlayan koku ailesini birlikte bulalım.</p><div className="mt-7 flex flex-wrap justify-center gap-2">{["Günlük kullanım", "Özel davet", "Ofis", "Yaz mevsimi", "Kış mevsimi", "Hediye seçimi"].map((x)=><span key={x} className="rounded-full border border-black/15 bg-white/30 px-4 py-2 text-xs">{x}</span>)}</div><button onClick={() => setOpen(true)} className="btn-dark mx-auto mt-9">KOKUNU BUL</button></div></section><section className="py-20 text-center"><h2 className="font-serif text-4xl">@beekozmatik</h2><p className="mt-2 text-sm text-neutral-500">Koku dünyamıza katılın.</p><div className="mt-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">{instagram.map((id)=><Link href="#" aria-label="Instagram gönderisi" className="group relative aspect-square overflow-hidden" key={id}><Image src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="17vw" /><div className="absolute inset-0 grid place-content-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"><Camera /></div></Link>)}</div></section>{open && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-5 backdrop-blur-sm" onMouseDown={() => setOpen(false)}><div role="dialog" aria-modal="true" className="relative w-full max-w-xl bg-[#faf8f3] p-8 text-center md:p-12" onMouseDown={(e)=>e.stopPropagation()}><button aria-label="Rehberi kapat" onClick={()=>setOpen(false)} className="absolute right-4 top-4"><X /></button><Sparkles className="mx-auto text-[#a17a49]" /><h3 className="mt-4 font-serif text-3xl">Koku Yolculuğunuz Başlıyor</h3><p className="mt-4 text-sm leading-6 text-neutral-600">Kişisel koku rehberi yakında burada olacak. Bu sırada koleksiyonlarımızı koku ailelerine göre keşfedebilirsiniz.</p><Link href="/urunler" onClick={()=>setOpen(false)} className="btn-dark mx-auto mt-7">KOKULARI KEŞFET</Link></div></div>}</>;
}

const emailSchema = z.string().email("Geçerli bir e-posta adresi girin.");
export function Newsletter() {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<{ email: string }>();
  const submit = ({ email }: { email: string }) => { const result = emailSchema.safeParse(email); if (!result.success) return setError("email", { message: result.error.issues[0].message }); toast.success("Bee dünyasına hoş geldiniz!"); reset(); };
  return <section className="border-t border-black/10 bg-[#eee8dc] py-20"><div className="mx-auto max-w-2xl px-5 text-center"><p className="text-[10px] tracking-[.3em] text-[#8d693e]">BEE PRIVÉ</p><h2 className="mt-4 font-serif text-4xl md:text-6xl">Bee Dünyasına Katılın</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600">Yeni koleksiyonlardan, kampanyalardan ve özel fırsatlardan ilk siz haberdar olun.</p><form onSubmit={handleSubmit(submit)} className="mx-auto mt-8 flex max-w-xl border-b border-black"><input {...register("email")} aria-label="E-posta adresi" placeholder="E-posta adresiniz" className="min-w-0 flex-1 bg-transparent px-1 py-4 text-sm outline-none" /><button className="px-4 text-[10px] tracking-[.18em]">ABONE OL <ArrowRight className="ml-2 inline" size={14} /></button></form>{errors.email && <p className="mt-2 text-left text-xs text-red-700">{errors.email.message}</p>}</div></section>;
}

function SectionTitle({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "left" | "center" }) {
  return <div className={`mb-10 md:mb-14 ${align === "center" ? "text-center" : ""}`}><p className="text-[10px] tracking-[.28em] text-[#956f42]">{eyebrow}</p><h2 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{title}</h2></div>;
}
