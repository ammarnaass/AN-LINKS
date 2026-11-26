import { describe, it, expect } from "vitest";
import {
  validateAiSettings,
  ALLOWED_AI_TONES,
} from "@/features/settings/validators/ai-settings.validator";

describe("AI Settings Validator Suite", () => {
  it("accepts valid AI settings input with allowed tones", () => {
    ALLOWED_AI_TONES.forEach((tone) => {
      const result = validateAiSettings({
        tone,
        niche: "تقنية وبرمجة",
        autoSuggestTitle: true,
      });
      expect(result.valid).toBe(true);
      expect(result.data?.tone).toBe(tone);
      expect(result.data?.niche).toBe("تقنية وبرمجة");
    });
  });

  it("applies robust defaults when partial input is provided", () => {
    const result = validateAiSettings({});
    expect(result.valid).toBe(true);
    expect(result.data?.tone).toBe("professional");
    expect(result.data?.niche).toBe("صانع محتوى محترف");
    expect(result.data?.autoSuggestTitle).toBe(true);
  });

  it("rejects invalid tone with descriptive error", () => {
    const result = validateAiSettings({
      tone: "unsupported_tone",
      niche: "أي مجال",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects excessively long niche exceeding 80 characters", () => {
    const longNiche = "أ".repeat(85);
    const result = validateAiSettings({
      niche: longNiche,
    });
    expect(result.valid).toBe(false);
  });
});
