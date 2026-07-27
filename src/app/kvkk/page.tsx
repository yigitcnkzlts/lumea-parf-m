import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Bee Kozmetik KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalPage
      eyebrow="YASAL"
      title="KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme."
      sections={[
        {
          heading: "Veri sorumlusu",
          body: [
            "Bee Kozmetik — Tekirdağ, Süleymanpaşa. İletişim: beekozmatik59@outlook.com · 0545 226 75 31.",
          ],
        },
        {
          heading: "İşleme amaçları",
          body: [
            "Kişisel verileriniz sipariş alma, teslimat, müşteri destek, iade/değişim süreçleri ve yasal yükümlülüklerin yerine getirilmesi için işlenir.",
          ],
        },
        {
          heading: "Haklarınız",
          body: [
            "KVKK madde 11 kapsamındaki haklarınızı (bilgi talep etme, düzeltme, silme vb.) yukarıdaki iletişim kanallarından kullanabilirsiniz.",
          ],
        },
      ]}
    />
  );
}
