"use client";

import React, { useState } from "react";
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
  AuthModal,
} from "@/features/landing";

export function LandingPageClient() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "claim">("signup");
  const [authHandle, setAuthHandle] = useState<string | undefined>("faisal");

  const openAuth = (mode: "login" | "signup" | "claim", handle?: string) => {
    setAuthMode(mode);
    setAuthHandle(handle || "faisal");
    setAuthOpen(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      dir="rtl"
    >
      <LandingHeader onOpenAuth={(mode) => openAuth(mode)} />

      <main className="w-full pt-20 bg-surface-container-lowest flex-1">
        <div className="flex flex-col w-full overflow-hidden text-on-surface">
          <HeroSection onOpenAuth={openAuth} />

          <section className="relative px-4 sm:px-6 pb-20 sm:pb-28">
            <div className="max-w-4xl mx-auto">
              <PhoneMockup />
            </div>
          </section>

          <PartnersMarqueeSection />
          <FeaturesSection />
          <TemplateGallerySection />
          <HowItWorksSection />
          <PricingBannerSection onOpenAuth={(mode) => openAuth(mode)} />
          <TestimonialsSection />
          <FaqSection />
          <GiantCtaSection onOpenAuth={openAuth} />
        </div>
      </main>

      <LandingFooter />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        claimHandle={authHandle}
      />
    </div>
  );
}

