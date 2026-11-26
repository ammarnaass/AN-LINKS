import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { BioOwnerBar } from "@/features/bio/components/BioOwnerBar";
import { PricingCard } from "@/features/landing/components/PricingCard";
import { SubscriptionCheckoutModal } from "@/features/landing/components/SubscriptionCheckoutModal";
import { PRICING_PLANS } from "@/features/landing/constants/pricing-plans";
import { middleware } from "@/middleware";
import { useSession } from "next-auth/react";
import { setAuthCache } from "@/features/auth/hooks/useCurrentUser";

// Mock Next.js routing and NextAuth
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/pricing",
}));

describe("Subscription Checkout Flow & Header Plan Badge Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Header Subscription Badge Placement", () => {
    it("renders DashboardPlanBadge in LandingHeader when user is authenticated", () => {
      setAuthCache({
        id: "u_creator",
        username: "sara_design",
        role: "USER",
        name: "سارة",
      });

      vi.mocked(useSession).mockReturnValue({
        data: { user: { username: "sara_design", role: "USER" } },
        status: "authenticated",
      } as any);

      const html = renderToStaticMarkup(<LandingHeader />);
      // Should contain the plan badge container and popover trigger
      expect(html).toContain('title="الاشتراك الشهري والخطة:');
      expect(html).toContain('href="/dashboard"');
    });

    it("renders DashboardPlanBadge in BioOwnerBar on creator page", () => {
      setAuthCache({
        id: "u_creator",
        username: "sara_design",
        role: "USER",
        name: "سارة",
      });

      vi.mocked(useSession).mockReturnValue({
        data: { user: { username: "sara_design", role: "USER" } },
        status: "authenticated",
      } as any);

      const html = renderToStaticMarkup(<BioOwnerBar username="sara_design" />);
      expect(html).toContain("أنت تتصفح صفحتك الشخصية كصانع محتوى");
      expect(html).toContain('title="الاشتراك الشهري والخطة:');
      expect(html).toContain('href="/dashboard"');
    });
  });

  describe("PricingCard Subscription Action", () => {
    it("displays upgrade button text when authenticated on paid plan", () => {
      setAuthCache({
        id: "u_creator",
        username: "sara_design",
        role: "USER",
        name: "سارة",
      });

      vi.mocked(useSession).mockReturnValue({
        data: { user: { username: "sara_design", role: "USER" } },
        status: "authenticated",
      } as any);

      const proPlan = PRICING_PLANS.find((p) => p.id === "pro")!;
      const html = renderToStaticMarkup(<PricingCard plan={proPlan} isYearly={false} />);
      expect(html).toContain("الترقية والاشتراك في الخطة");
    });

    it("displays guest register text when unauthenticated", () => {
      setAuthCache(null as any);
      vi.mocked(useSession).mockReturnValue({
        data: null,
        status: "unauthenticated",
      } as any);

      const proPlan = PRICING_PLANS.find((p) => p.id === "pro")!;
      const html = renderToStaticMarkup(<PricingCard plan={proPlan} isYearly={false} />);
      expect(html).toContain(proPlan.ctaText);
    });
  });

  describe("SubscriptionCheckoutModal UI", () => {
    it("renders plan details and all supported payment gateways", () => {
      const proPlan = PRICING_PLANS.find((p) => p.id === "pro")!;
      const html = renderToStaticMarkup(
        <SubscriptionCheckoutModal isOpen={true} onClose={() => {}} plan={proPlan} />
      );

      expect(html).toContain("إتمام الاشتراك والدفع");
      expect(html).toContain(proPlan.name);
      expect(html).toContain("مدى (Mada)");
      expect(html).toContain("Apple Pay");
      expect(html).toContain("STC Pay");
      expect(html).toContain("بطاقة ائتمانية");
      expect(html).toContain("تمارا");
      expect(html).toContain("تابي");
      expect(html).toContain("دفع مشفر وآمن 100%");
    });

    it("returns null when isOpen is false", () => {
      const proPlan = PRICING_PLANS.find((p) => p.id === "pro")!;
      const html = renderToStaticMarkup(
        <SubscriptionCheckoutModal isOpen={false} onClose={() => {}} plan={proPlan} />
      );
      expect(html).toBe("");
    });
  });

  describe("Middleware Checkout Routing", () => {
    it("redirects authenticated user from /register?plan=pro directly to /checkout?plan=pro", async () => {
      const { getToken } = await import("next-auth/jwt");
      vi.mocked(getToken).mockResolvedValueOnce({
        sub: "u123",
        role: "USER",
        email: "user@example.com",
      } as any);

      const req = new NextRequest("http://localhost:3000/register?plan=pro");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/checkout?plan=pro");
    });

    it("redirects unauthenticated user accessing /checkout directly to /login", async () => {
      const { getToken } = await import("next-auth/jwt");
      vi.mocked(getToken).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/checkout?plan=pro");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/login?callbackUrl=%2Fcheckout%3Fplan%3Dpro");
    });
  });
});
