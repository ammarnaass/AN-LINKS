import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TermsPage from "@/app/terms/page";
import PrivacyPage from "@/app/privacy/page";
import SecurityPage from "@/app/security/page";
import GlobalErrorPage from "@/app/error";
import robots from "@/app/robots";

describe("Phase 1 Production Readiness Suite", () => {
  it("renders Terms of Service page with legal headings and contact email", () => {
    const html = renderToStaticMarkup(React.createElement(TermsPage));
    expect(html).toContain("شروط وأحكام استخدام AN LINKS");
    expect(html).toContain("المحتوى المحظور");
    expect(html).toContain("legal@anlinks.dev");
  });

  it("renders Privacy Policy page with PDPL compliance and data security", () => {
    const html = renderToStaticMarkup(React.createElement(PrivacyPage));
    expect(html).toContain("سياسة الخصوصية وحماية البيانات");
    expect(html).toContain("حماية البيانات الشخصية");
    expect(html).toContain("privacy@anlinks.dev");
  });

  it("renders Security page with encryption pillars and compliance info", () => {
    const html = renderToStaticMarkup(React.createElement(SecurityPage));
    expect(html).toContain("الأمان والموثوقية في AN LINKS");
    expect(html).toContain("AES-256-GCM");
    expect(html).toContain("2FA");
  });

  it("renders Global Error boundary component with retry button and home link", () => {
    const html = renderToStaticMarkup(
      React.createElement(GlobalErrorPage, {
        error: new Error("Test error") as Error & { digest?: string },
        reset: () => {},
      })
    );
    expect(html).toContain("حدث خطأ غير متوقع");
    expect(html).toContain("إعادة المحاولة");
    expect(html).toContain("الرئيسية");
  });

  it("generates correct robots.txt rules and disallow paths", () => {
    const robotsConfig = robots();
    expect(robotsConfig).toHaveProperty("rules");
    expect(robotsConfig).toHaveProperty("sitemap");
    expect(robotsConfig.sitemap).toContain("/sitemap.xml");
  });
});
