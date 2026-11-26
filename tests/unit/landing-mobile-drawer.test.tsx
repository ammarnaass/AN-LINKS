import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LandingMobileDrawer } from "@/features/landing/components/LandingMobileDrawer";

vi.mock("@/shared/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.features": "المميزات",
        "nav.liveDemos": "قوالب بانتو",
        "nav.pricing": "الأسعار",
        "nav.testimonials": "آراء العملاء",
        "nav.faq": "الأسئلة الشائعة",
        "nav.login": "تسجيل الدخول",
        "nav.startFree": "ابدأ مجاناً",
        "nav.dashboard": "لوحة التحكم",
      };
      return map[key] || key;
    },
    locale: "ar",
    locales: [
      { code: "ar", name: "العربية", dir: "rtl" },
      { code: "en", name: "English", dir: "ltr" },
    ],
    setLocale: vi.fn(),
  }),
}));

vi.mock("@/features/auth", () => ({
  useCurrentUser: () => ({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
  }),
}));

describe("Landing Mobile Drawer Suite", () => {
  it("renders nothing when isOpen is false", () => {
    const html = renderToStaticMarkup(
      <LandingMobileDrawer isOpen={false} onClose={vi.fn()} />
    );
    expect(html).toBe("");
  });

  it("renders complete navigation drawer with section links when isOpen is true", () => {
    const html = renderToStaticMarkup(
      <LandingMobileDrawer isOpen={true} onClose={vi.fn()} />
    );

    // Verify dialog container and accessibility
    expect(html).toContain("role=\"dialog\"");
    expect(html).toContain("قائمة التنقل الجانبية");

    // Verify jump links
    expect(html).toContain("href=\"#features\"");
    expect(html).toContain("href=\"#live-demos\"");
    expect(html).toContain("href=\"#pricing\"");
    expect(html).toContain("href=\"#testimonials\"");
    expect(html).toContain("href=\"#faq\"");

    // Verify Arabic section labels
    expect(html).toContain("المميزات");
    expect(html).toContain("قوالب بانتو");
    expect(html).toContain("الأسعار");

    // Verify unauthenticated action buttons
    expect(html).toContain("href=\"/login\"");
    expect(html).toContain("href=\"/register\"");
  });
});
