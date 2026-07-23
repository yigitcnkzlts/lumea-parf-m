import { Hero } from "@/components/home/hero";
import {
  BrandMarquee,
  Campaigns,
  CategorySection,
  CollectionBanner,
  GuideAndInstagram,
  Newsletter,
  ProductSection,
  ScentFamilies,
  TrustAndReviews,
} from "@/components/home/home-sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandMarquee />
      <CategorySection />
      <ProductSection type="best" />
      <CollectionBanner />
      <ProductSection type="new" />
      <ScentFamilies />
      <Campaigns />
      <TrustAndReviews />
      <GuideAndInstagram />
      <Newsletter />
    </main>
  );
}
