export type Category = "Kadın" | "Erkek" | "Unisex";
export type ScentFamily = "Çiçeksi" | "Odunsu" | "Oryantal" | "Ferah" | "Meyveli" | "Baharatlı" | "Narenciye";

export interface Product {
  id: number;
  slug: string;
  brand: string;
  name: string;
  category: Category;
  scentFamily: ScentFamily;
  description: string;
  price: number;
  salePrice: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sizes: number[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  isNew: boolean;
  isBestSeller: boolean;
}

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}
