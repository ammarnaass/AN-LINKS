import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AiLinkSuggestButton } from "@/features/links/components/AiLinkSuggestButton";
import { AiBioSuggestButton } from "@/features/settings/components/profile/AiBioSuggestButton";

describe("AI Copilot Suggestion Buttons Suite", () => {
  describe("AiLinkSuggestButton", () => {
    it("renders nothing when url is empty or too short", () => {
      const html = renderToStaticMarkup(
        <AiLinkSuggestButton url="" onSuggest={vi.fn()} />
      );
      expect(html).toBe("");

      const shortHtml = renderToStaticMarkup(
        <AiLinkSuggestButton url="abc" onSuggest={vi.fn()} />
      );
      expect(shortHtml).toBe("");
    });

    it("renders suggestion trigger when url is valid", () => {
      const html = renderToStaticMarkup(
        <AiLinkSuggestButton
          url="https://youtube.com/watch?v=sample123"
          onSuggest={vi.fn()}
        />
      );
      expect(html).toContain("اقتراح ذكي بالـ AI ✨");
      expect(html).toContain("اقتراح عنوان ذكي للرابط بالذكاء الاصطناعي");
    });
  });

  describe("AiBioSuggestButton", () => {
    it("renders AI bio generation trigger button", () => {
      const html = renderToStaticMarkup(
        <AiBioSuggestButton
          displayName="عمار النعاس"
          currentBio="صانع محتوى تقني"
          onSuggest={vi.fn()}
        />
      );
      expect(html).toContain("صياغة بالذكاء الاصطناعي ✨");
      expect(html).toContain("توليد نبذة تعريفية احترافية مدعومة بنموذج Gemini");
    });
  });
});
