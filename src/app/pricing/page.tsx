"use client";

import React, { useState } from "react";
import {
  LandingHeader,
  PricingHeader,
  PricingCard,
  PricingComparisonTable,
  PricingFaq,
  LandingFooter,
  PRICING_PLANS,
} from "@/features/landing";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div
      className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      dir="rtl"
    >
      <LandingHeader />

      <main className="flex-1 pt-12 pb-20">
        <PricingHeader isYearly={isYearly} onToggleYearly={setIsYearly} />

        {/* 3 Pricing Tiers Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <PricingComparisonTable />

        {/* FAQ Accordion */}
        <PricingFaq />
      </main>

      <LandingFooter />
    </div>
  );
}
