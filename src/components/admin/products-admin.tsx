"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ImageDropzone, ImageUrlList } from "@/components/admin/image-dropzone";
import { formatPrice } from "@/data/products";
import { splitList } from "@/lib/catalog/map";

interface AdminProduct {
  id: number;
  brand: string;
  name: string;
  slug: string;
  category: string;
  scent_family: string;
  description: string;
  price: number;
  sale_price: number;
  stock: number;
  images: string[];
  sizes: number[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
}

const emptyForm = {
  brand: "",
  name: "",
  slug: "",
  category: "Kadın" as "Kadın" | "Erkek" | "Unisex",
  scentFamily: "Çiçeksi" as "Odunsu" | "Çiçeksi" | "Oryantal" | "Meyveli",
  description: "",
  price: "",
  salePrice: "",
  stock: "10",
  imagesText: "",
  sizesText: "30, 50, 100",
  topNotes: "",
  heartNotes: "",
  baseNotes: "",
  isNew: true,
  isBestSeller: false,
  isActive: true,
};

function toForm(product: AdminProduct) {
  return {
    brand: product.brand,
    name: product.name,
    slug: product.slug,
    category: product.category as typeof emptyForm.category,
    scentFamily: product.scent_family as typeof emptyForm.scentFamily,
    description: product.description ?? "",
    price: String(product.price),
    salePrice: String(product.sale_price),
    stock: String(product.stock),
    imagesText: (product.images ?? []).join("\n"),
    sizesText: (product.sizes ?? [30, 50, 100]).join(", "),
    topNotes: (product.top_notes ?? []).join(", "),
    heartNotes: (product.heart_notes ?? []).join(", "),
    baseNotes: (product.base_notes ?? []).join(", "),
    isNew: product.is_new,
    isBestSeller: product.is_best_seller,
    isActive: product.is_active,
  };
}

function parsePayload(form: typeof emptyForm) {
  const images = form.imagesText
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const sizes = splitList(form.sizesText)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n > 0);

  return {
    brand: form.brand.trim(),
    name: form.name.trim(),
    slug: form.slug.trim() || undefined,
    category: form.category,
    scentFamily: form.scentFamily,
    description: form.description.trim(),
    price: Number(form.price),
    salePrice: Number(form.salePrice),
    stock: Number(form.stock),
    images,
    sizes: sizes.length ? sizes : [30, 50, 100],
    topNotes: splitList(form.topNotes),
    heartNotes: splitList(form.heartNotes),
    baseNotes: splitList(form.baseNotes),
    isNew: form.isNew,
    isBestSeller: form.isBestSeller,
    isActive: form.isActive,
  };
}

export function ProductsAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/products")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yetkisiz");
        setProducts(data.products ?? []);
      })
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    void load();
  }, []);

  const previewImages = useMemo(
    () =>
      form.imagesText
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 4),
    [form.imagesText],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setForm(toForm(product));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = parsePayload(form);
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
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { productId: editingId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      toast.success(editingId ? "Ürün güncellendi" : "Ürün eklendi");
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const quickStock = async (productId: number, stock: number) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Stok kaydı başarısız");
      setProducts((current) => current.map((p) => (p.id === productId ? { ...p, stock } : p)));
      toast.success("Stok güncellendi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    }
  };

  if (error) {
    return (
      <div className="border border-black/10 bg-white/60 p-8">
        <p className="font-serif text-3xl">Admin erişimi</p>
        <p className="mt-3 text-sm text-neutral-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">
          Yeni parfüm ekleyin: sürükle-bırak görsel, açıklama, notalar, fiyat ve stok.
        </p>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer border border-black/15 px-4 py-3 text-[10px] tracking-[.14em] hover:border-black">
            CSV STOK İÇE AKTAR
            <input
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const res = await fetch("/api/admin/products/import", {
                    method: "POST",
                    headers: { "Content-Type": "text/csv" },
                    body: text,
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);
                  toast.success(`${data.updated}/${data.total} stok güncellendi`);
                  await load();
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Import hatası");
                }
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" onClick={openCreate} className="btn-dark !min-h-10">
            + YENİ PARFÜM
          </button>
        </div>
      </div>
      <p className="text-[11px] text-neutral-500">
        CSV formatı: her satır <code>id,stock</code> (örn. <code>12,40</code>). İlk satır başlık olabilir.
      </p>

      {showForm && (
        <form onSubmit={onSubmit} className="space-y-5 border border-black/10 bg-white/70 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[.28em] text-[#956f42]">
                {editingId ? `DÜZENLE · #${editingId}` : "YENİ ÜRÜN"}
              </p>
              <h2 className="mt-2 font-serif text-3xl">
                {editingId ? "Ürünü güncelle" : "Parfüm ekle"}
              </h2>
            </div>
            <button
              type="button"
              className="text-xs underline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Kapat
            </button>
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
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as typeof form.category }))}
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
                onChange={(e) => setForm((f) => ({ ...f, scentFamily: e.target.value as typeof form.scentFamily }))}
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

          <ImageUrlList
            urls={previewImages}
            onChange={(next) => setForm((f) => ({ ...f, imagesText: next.join("\n") }))}
          />

          {previewImages.length === 0 ? null : (
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
                <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm((f) => ({ ...f, isBestSeller: e.target.checked }))} />
                Çok satan
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
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

          <button disabled={busy} className="btn-dark">
            {busy ? "KAYDEDİLİYOR..." : editingId ? "GÜNCELLE" : "PARFÜMÜ EKLE"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto border border-black/10 bg-white/50">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 text-[10px] tracking-[.18em] text-neutral-500">
            <tr>
              <th className="px-4 py-3">ÜRÜN</th>
              <th className="px-4 py-3">FİYAT</th>
              <th className="px-4 py-3">STOK</th>
              <th className="px-4 py-3">DURUM</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5">
                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-[#eee8dc]">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt="" fill className="object-cover" sizes="44px" unoptimized={product.images[0].startsWith("http")} />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[.16em] text-neutral-500">{product.brand}</p>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-[11px] text-neutral-400">{product.category} · {product.scent_family}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{formatPrice(Number(product.sale_price))}</td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min={0}
                    defaultValue={product.stock}
                    key={`${product.id}-${product.stock}`}
                    onBlur={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isFinite(next) && next !== product.stock) void quickStock(product.id, next);
                    }}
                    className="w-24 border border-black/15 px-3 py-2 text-sm"
                  />
                </td>
                <td className="px-4 py-4 text-xs">
                  {product.is_active ? (
                    <span className="text-emerald-700">Satışta</span>
                  ) : (
                    <span className="text-neutral-400">Pasif</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <button type="button" onClick={() => openEdit(product)} className="border border-black/15 px-3 py-2 text-[10px] tracking-[.14em] hover:border-black">
                    DÜZENLE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
