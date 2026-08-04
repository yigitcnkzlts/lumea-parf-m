import { splitList } from "@/lib/catalog/map";

export interface AdminProduct {
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

export const emptyProductForm = {
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

export type ProductFormState = typeof emptyProductForm;

export function productToForm(product: AdminProduct): ProductFormState {
  return {
    brand: product.brand,
    name: product.name,
    slug: product.slug,
    category: product.category as ProductFormState["category"],
    scentFamily: product.scent_family as ProductFormState["scentFamily"],
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

export function parseProductPayload(form: ProductFormState) {
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

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const res = await fetch("/api/admin/products");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Yetkisiz");
  return (data.products ?? []) as AdminProduct[];
}

export async function deleteAdminProduct(product: AdminProduct): Promise<string> {
  const res = await fetch("/api/admin/products", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Silinemedi");
  return data.message || "Ürün silindi";
}
