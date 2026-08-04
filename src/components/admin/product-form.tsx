"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageDropzone, ImageUrlList } from "@/components/admin/image-dropzone";
import {
  type AdminProduct,
  type ProductFormState,
  deleteAdminProduct,
  emptyProductForm,
  parseProductPayload,
  productToForm,
} from "@/components/admin/product-types";

export function ProductForm({
  mode,
  productId,
  initialProduct,
}: {
  mode: "create" | "edit";
  productId?: number;
  initialProduct?: AdminProduct | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(
    initialProduct ? productToForm(initialProduct) : emptyProductForm,
  );
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ready, setReady] = useState(mode === "create" || Boolean(initialProduct));

  useEffect(() => {
    if (mode !== "edit" || !productId || initialProduct) return;
    let cancelled = false;
    void fetch(`/api/admin/products`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yetkisiz");
        const found = ((data.products ?? []) as AdminProduct[]).find((p) => p.id === productId);
        if (!found) throw new Error("Ürün bulunamadı.");
        if (!cancelled) {
          setForm(productToForm(found));
          setReady(true);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, productId, initialProduct]);

  const previewImages = useMemo(
    () =>
      form.imagesText
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 4),
    [form.imagesText],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = parseProductPayload(form);
    if (!payload.images.length) {
      toast.error("En az bir görsel URL’si girin.");
      return;
    }
    if (!payload.description || payload.description.length < 10) {
      toast.error("Açıklama en az 10 karakter olmalı.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "edit" ? { productId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      toast.success(mode === "edit" ? "Ürün güncellendi" : "Ürün eklendi");
      router.push("/admin/urunler");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!productId) return;
    const label = `${form.brand} ${form.name}`.trim() || `#${productId}`;
    const ok = window.confirm(
      `"${label}" silinsin mi?\n\nSiparişte geçtiyse tamamen silinmez, sadece satıştan kalkar.`,
    );
    if (!ok) return;
    setBusy(true);
    try {
      const message = await deleteAdminProduct({
        id: productId,
        brand: form.brand,
        name: form.name,
      } as AdminProduct);
      toast.success(message);
      router.push("/admin/urunler");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  if (loadError) {
    return (
      <div className="border border-black/10 bg-white/60 p-8">
        <p className="font-serif text-3xl">Ürün yüklenemedi</p>
        <p className="mt-3 text-sm text-neutral-600">{loadError}</p>
        <Link href="/admin/urunler" className="mt-6 inline-block text-xs underline">
          Listeye dön
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <p className="text-sm text-neutral-500">Form yükleniyor…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-black/10 bg-white/70 p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[.28em] text-[#956f42]">
            {mode === "edit" ? `DÜZENLE · #${productId}` : "YENİ ÜRÜN"}
          </p>
          <h2 className="mt-2 font-serif text-3xl">{mode === "edit" ? "Ürünü güncelle" : "Parfüm ekle"}</h2>
        </div>
        <Link href="/admin/urunler" className="text-xs underline">
          Listeye dön
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-[10px] tracking-widest text-neutral-500">
          MARKA
          <input
            required
            value={form.brand}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder="CHANEL"
          />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          ÜRÜN ADI
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder="Coco Mademoiselle"
          />
        </label>
      </div>

      <label className="block text-[10px] tracking-widest text-neutral-500">
        SLUG (opsiyonel — boş bırakılırsa otomatik)
        <input
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="chanel-coco-mademoiselle"
        />
      </label>

      <label className="block text-[10px] tracking-widest text-neutral-500">
        AÇIKLAMA
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="Kokunun hikâyesi, açılış, kalp ve baz notaları hakkında müşteriye anlatım…"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-[10px] tracking-widest text-neutral-500">
          KATEGORİ
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductFormState["category"] }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="Unisex">Unisex</option>
          </select>
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          KOKU AİLESİ
          <select
            value={form.scentFamily}
            onChange={(e) =>
              setForm((f) => ({ ...f, scentFamily: e.target.value as ProductFormState["scentFamily"] }))
            }
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="Çiçeksi">Çiçeksi</option>
            <option value="Odunsu">Odunsu</option>
            <option value="Oryantal">Oryantal</option>
            <option value="Meyveli">Meyveli</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-[10px] tracking-widest text-neutral-500">
          LİSTE FİYATI (TL)
          <input
            required
            type="number"
            min={0}
            step="1"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          SATIŞ FİYATI (TL)
          <input
            required
            type="number"
            min={0}
            step="1"
            value={form.salePrice}
            onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          STOK
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </label>
      </div>

      <label className="block text-[10px] tracking-widest text-neutral-500">
        GÖRSEL URL’LERİ (her satıra bir adres) veya aşağıdan yükle
        <textarea
          required
          rows={4}
          value={form.imagesText}
          onChange={(e) => setForm((f) => ({ ...f, imagesText: e.target.value }))}
          className="mt-2 w-full border border-black/15 px-4 py-3 font-mono text-xs outline-none focus:border-black"
          placeholder={"https://...\n/images/urun.jpg"}
        />
      </label>

      <ImageDropzone
        purpose="product"
        onUploaded={(url) =>
          setForm((f) => ({
            ...f,
            imagesText: f.imagesText.trim() ? `${f.imagesText.trim()}\n${url}` : url,
          }))
        }
      />

      <ImageUrlList urls={previewImages} onChange={(next) => setForm((f) => ({ ...f, imagesText: next.join("\n") }))} />

      {previewImages.length > 0 && (
        <p className="text-[11px] text-neutral-500">Önizleme yukarıda. Silmek için görsel altındaki SİL.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-[10px] tracking-widest text-neutral-500">
          BOYUTLAR (ml)
          <input
            value={form.sizesText}
            onChange={(e) => setForm((f) => ({ ...f, sizesText: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder="30, 50, 100"
          />
        </label>
        <div className="flex flex-wrap items-end gap-4 pb-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
            Yeni
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => setForm((f) => ({ ...f, isBestSeller: e.target.checked }))}
            />
            Çok satan
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Satışta
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-[10px] tracking-widest text-neutral-500">
          ÜST NOTALAR
          <input
            value={form.topNotes}
            onChange={(e) => setForm((f) => ({ ...f, topNotes: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder="Bergamot, Limon"
          />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          ORTA NOTALAR
          <input
            value={form.heartNotes}
            onChange={(e) => setForm((f) => ({ ...f, heartNotes: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder="Yasemin, Gül"
          />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          ALT NOTALAR
          <input
            value={form.baseNotes}
            onChange={(e) => setForm((f) => ({ ...f, baseNotes: e.target.value }))}
            className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder="Vanilya, Misk"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button disabled={busy} className="btn-dark">
          {busy ? "KAYDEDİLİYOR..." : mode === "edit" ? "GÜNCELLE" : "PARFÜMÜ EKLE"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onDelete()}
            className="border border-red-800/40 px-5 py-3 text-[10px] tracking-[.14em] text-red-800 hover:border-red-800"
          >
            ÜRÜNÜ SİL
          </button>
        ) : null}
      </div>
    </form>
  );
}
