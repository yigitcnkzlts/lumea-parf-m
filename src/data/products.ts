import type { Product } from "@/types/product";

const images = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85",
] as const;

const make = (
  id: number,
  slug: string,
  brand: string,
  name: string,
  category: Product["category"],
  scentFamily: Product["scentFamily"],
  price: number,
  salePrice: number,
  imageIndex: number,
  extra: Partial<Product> = {},
): Product => ({
  id,
  slug,
  brand,
  name,
  category,
  scentFamily,
  description: `${name}, modern zarafeti kalıcı ve rafine notalarla buluşturan seçkin bir ${scentFamily.toLocaleLowerCase("tr-TR")} parfümdür.`,
  price,
  salePrice,
  images: [images[imageIndex % images.length], images[(imageIndex + 2) % images.length]],
  rating: 4.8,
  reviewCount: 124 + id * 9,
  stock: 12 + id,
  sizes: [30, 50, 100],
  topNotes: ["Bergamot", "Mandalina"],
  heartNotes: ["Yasemin", "Gül"],
  baseNotes: ["Vanilya", "Sandal ağacı"],
  isNew: id > 7,
  isBestSeller: id < 7,
  ...extra,
});

export const products: Product[] = [
  make(1, "chanel-coco-mademoiselle", "CHANEL", "Coco Mademoiselle", "Kadın", "Oryantal", 6850, 5790, 0),
  make(2, "dior-sauvage-elixir", "DIOR", "Sauvage Elixir", "Erkek", "Baharatlı", 7290, 6490, 1),
  make(3, "ysl-libre-intense", "YVES SAINT LAURENT", "Libre Intense", "Kadın", "Çiçeksi", 6490, 5490, 2),
  make(4, "tom-ford-ombre-leather", "TOM FORD", "Ombré Leather", "Unisex", "Odunsu", 8990, 7790, 3),
  make(5, "armani-acqua-di-gio", "GIORGIO ARMANI", "Acqua di Giò", "Erkek", "Ferah", 5990, 5190, 4),
  make(6, "lancome-la-vie-est-belle", "LANCÔME", "La Vie Est Belle", "Kadın", "Meyveli", 6250, 5350, 5),
  make(7, "prada-paradoxe", "PRADA", "Paradoxe", "Kadın", "Çiçeksi", 6790, 5990, 2, { isBestSeller: false }),
  make(8, "versace-eros", "VERSACE", "Eros", "Erkek", "Oryantal", 5390, 4690, 1, { isNew: false }),
  make(9, "gucci-guilty-elixir", "GUCCI", "Guilty Elixir", "Erkek", "Odunsu", 7590, 6890, 4),
  make(10, "burberry-goddess", "BURBERRY", "Goddess", "Kadın", "Oryantal", 6190, 5590, 0),
  make(11, "givenchy-gentleman-reserve", "GIVENCHY", "Gentleman Réserve Privée", "Erkek", "Baharatlı", 6490, 5790, 3),
  make(12, "calvin-klein-everyone", "CALVIN KLEIN", "CK Everyone", "Unisex", "Ferah", 4290, 3690, 5, { stock: 0 }),
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
