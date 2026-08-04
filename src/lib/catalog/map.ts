import type { Category, Product, ScentFamily } from "@/types/product";

export type DbProductRow = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  category: string;
  scent_family: string;
  description: string;
  price: number | string;
  sale_price: number | string;
  images: string[] | null;
  rating: number | string;
  review_count: number;
  stock: number;
  sizes: number[] | null;
  top_notes: string[] | null;
  heart_notes: string[] | null;
  base_notes: string[] | null;
  is_new: boolean;
  is_best_seller: boolean;
  is_active?: boolean;
};

export function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    name: row.name,
    category: row.category as Category,
    scentFamily: row.scent_family as ScentFamily,
    description: row.description ?? "",
    price: Number(row.price),
    salePrice: Number(row.sale_price),
    images: row.images?.length ? row.images : ["/images/erkek-hero.jpg"],
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count ?? 0,
    stock: row.stock ?? 0,
    sizes: row.sizes?.length ? row.sizes : [30, 50, 100],
    topNotes: row.top_notes ?? [],
    heartNotes: row.heart_notes ?? [],
    baseNotes: row.base_notes ?? [],
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
  };
}

export function slugify(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function splitList(value: string) {
  return value
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
