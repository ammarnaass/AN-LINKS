import { Metadata } from "next";
import {
  LandingHeader,
  FeaturesHero,
  FeaturesDetailGrid,
  AlternativeComparison,
  LandingFooter,
} from "@/features/landing";

export const metadata: Metadata = {
  title: "المميزات المتقدمة | منصة روابط (Rawabet)",
  description:
    "استكشف كافة مزايا منصة روابط: فاحص الروابط الذكي (Link Sentinel)، بيع المنتجات الرقمية، إحصاءات خالية من البوتات، وتصميم بينتو عربي متطور.",
};

export default function FeaturesPage() {
  return (
    <div
      className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      dir="rtl"
    >
      <LandingHeader />

      <main className="flex-1 pt-12 pb-20">
        <FeaturesHero />
        <FeaturesDetailGrid />
        <AlternativeComparison />
      </main>

      <LandingFooter />
    </div>
  );
}

