import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

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
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container" dir="rtl">
      {/* Navigation Header */}
      <LandingHeader />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Live Phone Mockup Showcase */}
        <section className="relative px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="max-w-4xl mx-auto">
            <PhoneMockup />
          </div>
        </section>

        {/* Features Grid */}
        <FeaturesSection />

        {/* 3-Step Timeline & Final CTA */}
        <HowItWorksSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}

