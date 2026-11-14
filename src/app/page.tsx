import { Metadata } from "next";
import {
  LandingHeader,
  HeroSection,
  PhoneMockup,
  FeaturesSection,
  TemplateGallerySection,
  HowItWorksSection,
  PricingBannerSection,
  TestimonialsSection,
  FaqSection,
  GiantCtaSection,
  LandingFooter,
} from "@/features/landing";

export const metadata: Metadata = {
  title: "AN LINKS | المنصة العربية الأولى لصفحات الروابط والـ Bio",
  description:
    "اجمع كل روابطك وقنواتك ومتجرك في صفحة واحدة احترافية وسريعة، وضعها في خانة النبذة على شبكات التواصل.",
  openGraph: {
    title: "AN LINKS | المنصة العربية الأولى لصفحات الروابط والـ Bio",
    description:
      "اجمع كل روابطك وقنواتك ومتجرك في صفحة واحدة احترافية وسريعة، وضعها في خانة النبذة على شبكات التواصل.",
    siteName: "AN LINKS",
    locale: "ar_AR",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      dir="rtl"
    >
      {/* Navigation Header */}
      <LandingHeader />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Live Phone Mockup Showcase */}
        <section className="relative px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="max-w-4xl mx-auto">
            <PhoneMockup />
          </div>
        </section>

        {/* 3. Core Features Grid */}
        <FeaturesSection />

        {/* 4. Template Gallery Showcase */}
        <TemplateGallerySection />

        {/* 5. 3-Step Setup Timeline */}
        <HowItWorksSection />

        {/* 6. Pricing Banner Preview */}
        <PricingBannerSection />

        {/* 7. Creator Testimonials */}
        <TestimonialsSection />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />

        {/* 9. Giant Closing CTA */}
        <GiantCtaSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
