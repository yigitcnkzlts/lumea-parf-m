export interface ProductReview {
  id: string;
  productId: number;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export const productReviews: ProductReview[] = [
  {
    id: "r1",
    productId: 1,
    name: "Elif K.",
    rating: 5,
    title: "Güne yakışan zarafet",
    body: "Coco Mademoiselle tam beklediğim gibi — ferah açılıyor, akşama doğru sıcaklaşıyor. Bee’den hızlı geldi.",
    date: "2026-06-12",
  },
  {
    id: "r2",
    productId: 2,
    name: "Mert A.",
    rating: 5,
    title: "Kalıcı ve güçlü",
    body: "Sauvage Elixir çok karakterli. Ofiste ve akşamda rahat kullanıyorum. Paketleme özenliydi.",
    date: "2026-06-20",
  },
  {
    id: "r3",
    productId: 12,
    name: "Can Y.",
    rating: 5,
    title: "Klasik seçim",
    body: "Bleu de Chanel her ortama uyuyor. Tekirdağ’dan hızlı kargo, teşekkürler Bee.",
    date: "2026-07-02",
  },
  {
    id: "r4",
    productId: 17,
    name: "Deniz T.",
    rating: 4,
    title: "Lüks his",
    body: "Oud Wood derin ve sofistike. Fiyatına değer; orijinal ürün geldi.",
    date: "2026-07-08",
  },
  {
    id: "r5",
    productId: 6,
    name: "Selin B.",
    rating: 5,
    title: "Tatlı ve zarif",
    body: "La Vie Est Belle hediye aldım, çok beğenildi. Danışmanlık için WhatsApp’tan da yardımcı oldular.",
    date: "2026-07-15",
  },
  {
    id: "r6",
    productId: 18,
    name: "Burak S.",
    rating: 5,
    title: "Günlük favorim",
    body: "Y EDP ferah ve kalıcı. 1500 üzeri ücretsiz kargo avantajı da güzel.",
    date: "2026-07-22",
  },
];

export function reviewsForProduct(productId: number) {
  return productReviews.filter((r) => r.productId === productId);
}

export function averageRating(productId: number) {
  const list = reviewsForProduct(productId);
  if (!list.length) return null;
  return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
}
