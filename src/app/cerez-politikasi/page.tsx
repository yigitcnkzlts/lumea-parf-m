import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Bee Kozmetik çerez politikası.",
};

export default function CookiePage() {
  return (
    <LegalPage
      eyebrow="YASAL"
      title="Çerez Politikası"
      description="Sitemizde deneyimi iyileştirmek için sınırlı yerel depolama kullanılabilir."
      sections={[
        {
          heading: "Ne kullanıyoruz?",
          body: [
            "Sepet ve favori bilgileriniz tarayıcınızın yerel depolamasında (localStorage) tutulabilir.",
            "Bu veriler yalnızca sizin cihazınızda saklanır; alışveriş deneyimini sürdürmenize yardımcı olur.",
          ],
        },
        {
          heading: "Kontrol",
          body: [
            "Tarayıcı ayarlarından site verilerini temizleyerek sepet ve favori kayıtlarını silebilirsiniz.",
          ],
        },
      ]}
    />
  );
}
