"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { useAuth } from "@/context/auth-context";
import { useCatalogProducts } from "@/context/catalog-context";
import { reviewsForProduct, averageRating } from "@/data/reviews";
import { getCompareIds, getRecentIds, toggleCompare, trackRecentView } from "@/lib/client-prefs";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

interface LiveReview {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  photo_urls?: string[];
  created_at: string;
}

export function ProductExperienceExtras({ product }: { product: Product }) {
  const auth = useAuth();
  const catalog = useCatalogProducts();
  const [liveReviews, setLiveReviews] = useState<LiveReview[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [alertEmail, setAlertEmail] = useState("");
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    title: "",
    body: "",
    photos: [] as string[],
  });

  useEffect(() => {
    trackRecentView(product.id);
    setCompareIds(getCompareIds());
    const ids = getRecentIds().filter((id) => id !== product.id).slice(0, 3);
    setRecent(catalog.filter((p) => ids.includes(p.id)));
  }, [product.id, catalog]);

  useEffect(() => {
    void fetch(`/api/reviews?productId=${product.id}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) setLiveReviews(data.reviews ?? []);
      })
      .catch(() => undefined);
  }, [product.id]);

  useEffect(() => {
    if (auth.user?.email) setAlertEmail(auth.user.email);
    if (auth.user?.name) setReviewForm((f) => ({ ...f, name: auth.user?.name ?? f.name }));
  }, [auth.user]);

  const staticReviews = reviewsForProduct(product.id);
  const reviews =
    liveReviews.length > 0
      ? liveReviews.map((r) => ({
          id: r.id,
          name: r.name,
          rating: r.rating,
          title: r.title,
          body: r.body,
          date: r.created_at,
          photos: r.photo_urls ?? [],
        }))
      : staticReviews.map((r) => ({ ...r, photos: [] as string[] }));

  const avg =
    liveReviews.length > 0
      ? liveReviews.reduce((s, r) => s + r.rating, 0) / liveReviews.length
      : averageRating(product.id);

  const onStockAlert = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: alertEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message || "Kaydedildi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    }
  };

  const onReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.requireAuth("Yorum için giriş yapın.")) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: reviewForm.name,
          rating: reviewForm.rating,
          title: reviewForm.title,
          body: reviewForm.body,
          photoUrls: reviewForm.photos,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Yorumunuz yayınlandı");
      setReviewForm((f) => ({ ...f, title: "", body: "", photos: [] }));
      const refreshed = await fetch(`/api/reviews?productId=${product.id}`);
      const json = await refreshed.json();
      if (refreshed.ok) setLiveReviews(json.reviews ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    }
  };

  return (
    <>
      <div className="mx-auto flex max-w-[1500px] flex-wrap gap-3 px-5 pb-6 lg:px-8">
        <button
          type="button"
          className="border border-black/15 px-4 py-2 text-[10px] tracking-[.14em] hover:border-black"
          onClick={() => {
            const next = toggleCompare(product.id);
            setCompareIds(next);
            toast.success(next.includes(product.id) ? "Karşılaştırmaya eklendi" : "Kaldırıldı");
          }}
        >
          {compareIds.includes(product.id) ? "KARŞILAŞTIRMADAN ÇIKAR" : "KARŞILAŞTIR"}
        </button>
        {compareIds.length > 0 && (
          <Link href="/karsilastir" className="border border-black px-4 py-2 text-[10px] tracking-[.14em]">
            LİSTEYİ GÖR ({compareIds.length})
          </Link>
        )}
      </div>

      {!product.stock && (
        <section className="mx-auto max-w-[1500px] px-5 pb-10 lg:px-8">
          <form onSubmit={onStockAlert} className="flex flex-col gap-3 border border-black/10 bg-[#f7f1e6] p-5 sm:flex-row sm:items-end">
            <div className="flex-1">
              <p className="text-[10px] tracking-[.2em] text-[#956f42]">STOK HABER VER</p>
              <p className="mt-1 text-sm text-neutral-600">Gelince e-posta ile bilgilendirelim.</p>
              <input
                required
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="mt-3 w-full border border-black/15 bg-white px-4 py-3 text-sm"
                placeholder="E-posta"
              />
            </div>
            <button className="btn-dark !min-h-12 shrink-0">HABER VER</button>
          </form>
        </section>
      )}

      <section className="section-shell !pt-0">
        <p className="text-center text-[10px] tracking-[.28em] text-[#956f42]">MÜŞTERİ YORUMLARI</p>
        <h2 className="mt-3 text-center font-serif text-4xl md:text-5xl">
          {avg ? `${avg.toFixed(1)} / 5` : "İlk yorumu siz yazın"}
        </h2>
        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id} className="border border-black/10 bg-white/50 p-6">
              <div className="flex items-center gap-2 text-[#ad824b]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <h3 className="mt-3 font-serif text-2xl">{review.title}</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{review.body}</p>
              {"photos" in review && review.photos?.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {review.photos.map((src) => (
                    <div key={src} className="relative h-16 w-16 overflow-hidden bg-[#eee8dc]">
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized={src.includes("supabase")} />
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-4 text-[10px] tracking-[.16em] text-neutral-500">
                {review.name} · {new Date(review.date).toLocaleDateString("tr-TR")}
              </p>
            </li>
          ))}
        </ul>

        <form onSubmit={onReview} className="mx-auto mt-12 max-w-2xl space-y-4 border border-black/10 bg-white/50 p-6">
          <p className="text-[10px] tracking-[.2em] text-[#956f42]">YORUM YAZ</p>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={reviewForm.name}
              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
              placeholder="Adınız"
              className="border border-black/15 px-4 py-3 text-sm"
            />
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="border border-black/15 px-4 py-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} yıldız
                </option>
              ))}
            </select>
          </div>
          <input
            required
            value={reviewForm.title}
            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
            placeholder="Başlık"
            className="w-full border border-black/15 px-4 py-3 text-sm"
          />
          <textarea
            required
            rows={4}
            value={reviewForm.body}
            onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
            placeholder="Deneyiminizi yazın…"
            className="w-full border border-black/15 px-4 py-3 text-sm"
          />
          <ImageDropzone
            purpose="review"
            label="Yorum fotoğrafı yükle"
            onUploaded={(url) =>
              setReviewForm((f) => ({ ...f, photos: [...f.photos, url].slice(0, 3) }))
            }
          />
          {reviewForm.photos.length > 0 && (
            <div className="flex gap-2">
              {reviewForm.photos.map((src) => (
                <div key={src} className="relative h-14 w-14 overflow-hidden bg-[#eee8dc]">
                  <Image src={src} alt="" fill className="object-cover" sizes="56px" unoptimized />
                </div>
              ))}
            </div>
          )}
          <button className="btn-dark">YORUMU GÖNDER</button>
        </form>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-5 pb-20 lg:px-8">
          <h2 className="font-serif text-3xl">Son baktıklarınız</h2>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
            {recent.map((item) => (
              <ProductCard product={item} compact key={item.id} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
