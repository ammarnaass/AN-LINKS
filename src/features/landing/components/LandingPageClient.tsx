"use client";

import React from "react";
import { useTranslation } from "@/shared/i18n";
import {
  LandingHeader,
  HeroSection,
  PhoneMockup,
  PartnersMarqueeSection,
  FeaturesSection,
  TemplateGallerySection,
  HowItWorksSection,
  PricingBannerSection,
  TestimonialsSection,
  FaqSection,
  GiantCtaSection,
  LandingFooter,
} from "@/features/landing";

export function LandingPageClient() {
  const { direction } = useTranslation();

  return (
    <div
      className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      dir={direction}
    >
      <LandingHeader />

      <main className="w-full pt-20 bg-surface-container-lowest flex-1">
        <div className="flex flex-col w-full overflow-hidden text-on-surface">
          <HeroSection />

          <section className="relative px-4 sm:px-6 pb-20 sm:pb-28">
            <div className="max-w-4xl mx-auto">
              <PhoneMockup />
            </div>
          </section>

          <PartnersMarqueeSection />
          <FeaturesSection />
          <TemplateGallerySection />
          <HowItWorksSection />
          <PricingBannerSection />
          <TestimonialsSection />
          <FaqSection />
          <GiantCtaSection />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

