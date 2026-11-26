export const ALLOWED_AI_TONES = [
  "professional",
  "creative",
  "direct",
  "technical",
] as const;

export type AiTone = (typeof ALLOWED_AI_TONES)[number];

export interface AiSettingsInput {
  tone: AiTone;
  niche: string;
  autoSuggestTitle: boolean;
}

export function validateAiSettings(input: any): {
  valid: boolean;
  data?: AiSettingsInput;
  error?: string;
} {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "البيانات المدخلة غير صحيحة" };
  }

  const tone: AiTone = ALLOWED_AI_TONES.includes(input.tone)
    ? input.tone
    : input.tone === undefined
    ? "professional"
    : ("" as any);

  if (!tone) {
    return { valid: false, error: "نبرة الذكاء الاصطناعي المحددة غير مدعومة" };
  }

  const rawNiche = typeof input.niche === "string" ? input.niche.trim() : "";
  const niche = rawNiche || "صانع محتوى محترف";

  if (niche.length > 80) {
    return { valid: false, error: "المجال أو التخصص يجب ألا يتجاوز 80 حرفاً" };
  }

  const autoSuggestTitle =
    typeof input.autoSuggestTitle === "boolean" ? input.autoSuggestTitle : true;

  return {
    valid: true,
    data: {
      tone,
      niche,
      autoSuggestTitle,
    },
  };
}
