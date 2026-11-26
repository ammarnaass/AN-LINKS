import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WebhookDeliveryStats } from "@/features/settings/components/webhooks/WebhookDeliveryStats";
import { AiCopilotSettingsCard } from "@/features/settings/components/ai/AiCopilotSettingsCard";
import { AiWebhooksQuickCard } from "@/features/dashboard/components/AiWebhooksQuickCard";

describe("AI & Webhooks Dashboard UI Components Suite", () => {
  describe("WebhookDeliveryStats", () => {
    it("renders formatted delivery statistics and KPI cards", () => {
      const html = renderToStaticMarkup(
        <WebhookDeliveryStats
          totalDispatched={42}
          deliveredCount={40}
          failedCount={2}
          successRate={95}
        />
      );

      expect(html).toContain("إجمالي الأحداث");
      expect(html).toContain("42");
      expect(html).toContain("نسبة النجاح");
      expect(html).toContain("95%");
      expect(html).toContain("فشل الاستجابة");
      expect(html).toContain("2");
    });
  });

  describe("AiCopilotSettingsCard", () => {
    it("renders AI model indicators, tones, and interactive tester", () => {
      const html = renderToStaticMarkup(<AiCopilotSettingsCard />);

      expect(html).toContain("مساعد الذكاء الاصطناعي (AI Copilot)");
      expect(html).toContain("Gemini 1.5 Flash");
      expect(html).toContain("نبرة صياغة المحتوى المفضلة (Tone):");
      expect(html).toContain("احترافي ومحفز");
      expect(html).toContain("إبداعي وجريء");
      expect(html).toContain("مختبر الذكاء الاصطناعي التجريبي (Live Tester)");
      expect(html).toContain("حفظ تفضيلات الـ AI");
    });
  });

  describe("AiWebhooksQuickCard", () => {
    it("renders quick dashboard card with direct link to settings tab", () => {
      const html = renderToStaticMarkup(<AiWebhooksQuickCard />);

      expect(html).toContain("أدوات الذكاء الاصطناعي والأتمتة");
      expect(html).toContain("2026 Ready");
      expect(html).toContain("الإعدادات والعدادات");
      expect(html).toContain("href=\"/dashboard/settings?tab=ai-webhooks\"");
    });
  });
});
