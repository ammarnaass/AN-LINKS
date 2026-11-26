"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LandingPricingTier, PricingBannerSectionProps } from "../types/landing.types";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";
import { useCurrentUser } from "@/features/auth";

function PricingBannerHeader() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).pricing;

  return (
    <div className="flex flex-col items-center text-center gap-3 mb-10">
      <span className="text-xs uppercase tracking-widest text-primary font-bold">
        {content.tag}
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
        {content.title}
      </h2>
      <p className="text-sm text-on-surface-variant max-w-lg">
        {content.subtitle}
      </p>
    </div>
  );
}

function BillingToggle({
  isYearly,
  onToggle,
}: {
  isYearly: boolean;
  onToggle: () => void;
}) {
  const { locale, direction } = useTranslation();
  const content = getLandingContent(locale).pricing;
  const isRtl = direction === "rtl";

  return (
    <div className="flex items-center gap-4 bg-surface-container px-4 py-2 rounded-xl mb-12 border border-white/5">
      <span className={`text-xs font-semibold ${!isYearly ? "text-on-surface" : "text-on-surface-variant"}`}>
        {content.monthly}
      </span>
      <button
        aria-label="Toggle billing cycle"
        onClick={onToggle}
        className="w-12 h-7 bg-primary-container rounded-full relative p-1 transition-colors flex items-center cursor-pointer"
        type="button"
      >
        <span
          className={`w-5 h-5 rounded-full bg-on-primary-container shadow-md transition-transform transform ${
            isYearly ? (isRtl ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
          }`}
        />
      </button>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold ${isYearly ? "text-on-surface" : "text-on-surface-variant"}`}>
          {content.yearly}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-xs font-bold">
          {content.save}
        </span>
      </div>
    </div>
  );
}

function PricingTierCard({
  tier,
  isYearly,
}: {
  tier: LandingPricingTier;
  isYearly: boolean;
  onOpenAuth?: (mode: "login" | "signup" | "claim") => void;
}) {
  const price = isYearly ? tier.priceYearlyMonthlyEquiv : tier.priceMonthly;
  const period = isYearly ? tier.periodYearly : tier.periodMonthly;

  return (
    <div
      className={`flex flex-col justify-between p-8 rounded-xl shadow-md border ${
        tier.isPopular
          ? "bg-surface-container border-primary/50 shadow-[0_0_40px_rgba(16,185,129,0.25)] relative lg:-translate-y-2"
          : "bg-surface-container-lowest border-white/5"
      }`}
    >
      {tier.popularBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold shadow-md">
          {tier.popularBadge}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-on-surface">{tier.name}</h3>
          <p className="text-xs text-on-surface-variant">{tier.subtitle}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold font-mono ${tier.isPopular ? "text-primary" : "text-on-surface"}`}>
            {price}
          </span>
          <span className="text-xs text-on-surface-variant">{period}</span>
        </div>
        <div className="flex flex-col gap-3.5 pt-4">
          {tier.features.map((feat, i) => (
            <div key={i} className={`flex items-center gap-3 text-xs ${feat.included ? "text-on-surface" : "text-outline"}`}>
              <span className={`material-symbols-outlined text-[20px] ${feat.included ? "text-primary" : "text-outline"}`}>
                {feat.included ? "check_circle" : "block"}
              </span>
              <span className={feat.bold ? "font-bold text-primary" : ""}>{feat.text}</span>
            </div>
          ))}
        </div>
      </div>

      <PricingTierButton tier={tier} isYearly={isYearly} />
    </div>
  );
}

function PricingTierButton({
  tier,
  isYearly,
}: {
  tier: LandingPricingTier;
  isYearly: boolean;
}) {
  const { isAuthenticated } = useCurrentUser();
  let router: any = null;
  try {
    router = useRouter();
  } catch {
    // SSR / test harness fallback
  }
  const isFree = tier.id === "free";

  const handleCtaClick = (e: React.MouseEvent) => {
    if (isFree) {
      if (isAuthenticated) {
        e.preventDefault();
        router?.push?.("/dashboard");
      }
      return;
    }

    e.preventDefault();
    const checkoutUrl = `/checkout?plan=${tier.id}&billing=${isYearly ? "yearly" : "monthly"}`;
    if (isAuthenticated) {
      if (router?.push) {
        router.push(checkoutUrl);
      } else {
        window.location.href = checkoutUrl;
      }
    } else {
      if (router?.push) {
        router.push(`/login?callbackUrl=${encodeURIComponent(checkoutUrl)}`);
      } else {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(checkoutUrl)}`;
      }
    }
  };

  const buttonText = isFree
    ? isAuthenticated
      ? "لوحة التحكم"
      : tier.ctaText
    : isAuthenticated
      ? "الترقية والاشتراك الآن"
      : tier.ctaText;

  return (
    <button
      type="button"
      onClick={handleCtaClick}
      className={`mt-8 block w-full py-3.5 px-4 rounded-lg font-bold text-xs text-center transition-all cursor-pointer ${
        tier.isPopular
          ? "bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
      }`}
    >
      {buttonText}
    </button>
  );
}

export function PricingBannerSection({ onOpenAuth }: PricingBannerSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const { locale } = useTranslation();
  const content = getLandingContent(locale).pricing;

  return (
    <section id="pricing" className="w-full py-24 px-6 lg:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <PricingBannerHeader />
        <BillingToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {content.tiers.map((tier) => (
            <PricingTierCard
              key={tier.id}
              tier={tier}
              isYearly={isYearly}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
