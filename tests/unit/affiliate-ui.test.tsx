import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AffiliateReferralCard } from "@/features/settings/components/payouts/AffiliateReferralCard";
import { AffiliateSummaryDTO } from "@/features/settings/hooks/useSettingsPayouts";

describe("Affiliate Referral Card UI Suite", () => {
  const dummyAffiliate: AffiliateSummaryDTO = {
    referralCode: "an_creator_99",
    referralLink: "https://anlinks.dev/?ref=an_creator_99",
    totalReferrals: 15,
    escrowBalance: 240.5,
    clearedBalance: 560.0,
    paidBalance: 1200.0,
    commissionRate: 20.0,
  };

  it("renders referral information and stats correctly when data is provided", () => {
    const html = renderToStaticMarkup(<AffiliateReferralCard affiliate={dummyAffiliate} />);

    // Verify referral code and direct link
    expect(html).toContain("an_creator_99");
    expect(html).toContain("https://anlinks.dev/?ref=an_creator_99");

    // Verify statistics values
    expect(html).toContain("15"); // totalReferrals
    expect(html).toContain("20%"); // commissionRate
    expect(html).toContain("240.50"); // escrowBalance
    expect(html).toContain("560.00"); // clearedBalance

    // Verify essential Arabic labels
    expect(html).toContain("برنامج التسويق بالعمولة لصناع المحتوى");
    expect(html).toContain("المشتركون المحالون");
    expect(html).toContain("أرباح قيد الضمان");
    expect(html).toContain("أرباح معتمدة");
    expect(html).toContain("نسخ الرابط");
  });

  it("gracefully renders fallback values when affiliate is null", () => {
    const html = renderToStaticMarkup(<AffiliateReferralCard affiliate={null} />);

    // Check placeholder / fallbacks
    expect(html).toContain("كودك: ...");
    expect(html).toContain("https://anlinks.dev/?ref=...");
    expect(html).toContain("0.00"); // default balances
    expect(html).toContain("نسخ الرابط");
  });

  it("explains the 30-day anti-fraud escrow guarantee clearly", () => {
    const html = renderToStaticMarkup(<AffiliateReferralCard affiliate={dummyAffiliate} />);
    expect(html).toContain("30 يوماً");
    expect(html).toContain("فترة حجز أمان");
  });
});
