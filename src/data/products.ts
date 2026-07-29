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
  make(2, "dior-sauvage-elixir", "DIOR", "Sauvage Elixir", "Erkek", "Oryantal", 7290, 6490, 1),
  make(3, "ysl-libre-intense", "YVES SAINT LAURENT", "Libre Intense", "Kadın", "Çiçeksi", 6490, 5490, 2),
  make(4, "tom-ford-ombre-leather", "TOM FORD", "Ombré Leather", "Unisex", "Odunsu", 8990, 7790, 3),
  make(5, "armani-acqua-di-gio", "GIORGIO ARMANI", "Acqua di Giò", "Erkek", "Meyveli", 5990, 5190, 4),
  make(6, "lancome-la-vie-est-belle", "LANCÔME", "La Vie Est Belle", "Kadın", "Meyveli", 6250, 5350, 5),
  make(7, "prada-paradoxe", "PRADA", "Paradoxe", "Kadın", "Çiçeksi", 6790, 5990, 2, { isBestSeller: false }),
  make(8, "gucci-guilty-elixir", "GUCCI", "Guilty Elixir", "Erkek", "Odunsu", 7590, 6890, 4),
  make(9, "burberry-goddess", "BURBERRY", "Goddess", "Kadın", "Oryantal", 6190, 5590, 0),
  make(10, "givenchy-gentleman-reserve", "GIVENCHY", "Gentleman Réserve Privée", "Erkek", "Oryantal", 6490, 5790, 3),
  make(11, "calvin-klein-everyone", "CALVIN KLEIN", "CK Everyone", "Unisex", "Meyveli", 4290, 3690, 5, { stock: 0 }),

  // Erkek koleksiyonu — sitedeki markalar
  make(12, "chanel-bleu-de-chanel", "CHANEL", "Bleu de Chanel", "Erkek", "Odunsu", 7450, 6690, 4, { isBestSeller: true, isNew: false }),
  make(13, "burberry-hero", "BURBERRY", "Hero", "Erkek", "Odunsu", 5890, 5290, 1, { isNew: false }),
  make(14, "calvin-klein-eternity-men", "CALVIN KLEIN", "Eternity for Men", "Erkek", "Çiçeksi", 3990, 3490, 5, { isNew: false }),
  make(15, "paco-rabanne-1-million", "PACO RABANNE", "1 Million", "Erkek", "Oryantal", 5690, 4990, 0, { isBestSeller: true, isNew: false }),
  make(16, "prada-luna-rossa", "PRADA", "Luna Rossa", "Erkek", "Meyveli", 6290, 5590, 2, { isNew: false }),
  make(17, "tom-ford-oud-wood", "TOM FORD", "Oud Wood", "Erkek", "Odunsu", 9490, 8490, 3, { isBestSeller: true, isNew: false }),
  make(18, "ysl-y-edp", "YVES SAINT LAURENT", "Y Eau de Parfum", "Erkek", "Odunsu", 6790, 5990, 1, { isBestSeller: true, isNew: false }),
  make(19, "valentino-uomo-born-in-roma", "VALENTINO", "Uomo Born in Roma", "Erkek", "Oryantal", 6590, 5890, 4, { isNew: false }),
  make(20, "trussardi-uomo", "TRUSSARDI", "Uomo", "Erkek", "Odunsu", 4890, 4290, 5, { isNew: false }),
  make(21, "philipp-plein-no-limits", "PHILIPP PLEIN", "No Limits", "Erkek", "Oryantal", 7190, 6490, 0, { isNew: true }),
  make(22, "clive-christian-no1-men", "CLIVE CHRISTIAN", "No.1 Men", "Erkek", "Oryantal", 12990, 11490, 3, { isNew: false, isBestSeller: false }),
  make(23, "kilian-black-phantom", "KILIAN", "Black Phantom", "Erkek", "Oryantal", 10990, 9790, 1, { isNew: false }),
  make(24, "mfk-gentle-fluidity-silver", "MAISON FRANCIS KURKDJIAN", "Gentle Fluidity Silver", "Erkek", "Odunsu", 9890, 8890, 2, { isNew: false }),
  make(25, "marfa-memoir", "MARFA", "Memoir", "Erkek", "Odunsu", 8290, 7490, 4, { isNew: true }),
  make(26, "opulent-shaik-gold", "OPULENT SHAIK", "Gold Edition", "Erkek", "Oryantal", 8790, 7890, 0, { isNew: true }),
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
