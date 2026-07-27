import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Bee Kozmetik gizlilik politikası.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="YASAL"
      title="Gizlilik Politikası"
      description="Bee Kozmetik olarak kişisel verilerinizin güvenliğine özen gösteririz."
      sections={[
        {
          heading: "Toplanan bilgiler",
          body: [
            "Sipariş ve iletişim süreçlerinde ad-soyad, telefon, e-posta ve teslimat adresi gibi bilgiler alınabilir.",
            "Bu bilgiler yalnızca siparişinizin hazırlanması, kargolanması ve size dönüş yapılması amacıyla kullanılır.",
          ],
        },
        {
          heading: "Paylaşım",
          body: [
            "Bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla ticari amaçla paylaşılmaz.",
            "Kargo sürecinde teslimat için gerekli bilgiler yurt içi kargo firmasıyla paylaşılabilir.",
          ],
        },
        {
          heading: "İletişim",
          body: [
            "Gizlilik ile ilgili talepleriniz için beekozmatik59@outlook.com adresine yazabilir veya 0545 226 75 31 numarasından ulaşabilirsiniz.",
          ],
        },
      ]}
    />
  );
}
