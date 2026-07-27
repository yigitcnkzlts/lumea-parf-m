import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Bee Kozmetik mesafeli satış sözleşmesi.",
};

export default function DistanceSalesPage() {
  return (
    <LegalPage
      eyebrow="YASAL"
      title="Mesafeli Satış Sözleşmesi"
      description="WhatsApp / site üzerinden verilen siparişler için genel bilgilendirme."
      sections={[
        {
          heading: "Konu",
          body: [
            "Bu metin, Bee Kozmetik ile alıcı arasında mesafeli satış ilişkisine dair temel bilgilendirmeyi içerir.",
          ],
        },
        {
          heading: "Ürün ve bedel",
          body: [
            "Ürün özellikleri, fiyat ve varsa kargo ücreti sipariş özetinde / WhatsApp mesajında yer alır.",
            "1.500 TL ve üzeri siparişlerde kargo ücretsizdir.",
          ],
        },
        {
          heading: "Teslimat",
          body: [
            "Siparişler genellikle 1–2 iş günü içinde yurt içi kargoya verilir. Yalnızca Türkiye içi gönderim yapılır.",
          ],
        },
        {
          heading: "Cayma / iade",
          body: [
            "Açılmamış ve mühürlü ürünlerde teslimattan itibaren 14 gün içinde iade talep edilebilir.",
            "Hijyen nedeniyle açılmış parfümlerde iade kabul edilmez. Detaylar müşteri hizmetleri sayfasındadır.",
          ],
        },
      ]}
    />
  );
}
