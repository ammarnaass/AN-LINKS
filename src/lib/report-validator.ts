export const VALID_REPORT_REASONS = new Set([
  "phishing",
  "malware",
  "inappropriate",
  "impersonation",
  "spam",
  "other",
]);

export interface ReportValidationInput {
  username: string;
  reason: string;
  details?: string | null;
}

export interface ReportValidationResult {
  valid: boolean;
  username?: string;
  reason?: string;
  details?: string | null;
  error?: string;
}

export function validateReportInput(input: ReportValidationInput): ReportValidationResult {
  if (!input.username || input.username.trim().length === 0) {
    return { valid: false, error: "اسم المستخدم مطلوب" };
  }

  if (!input.reason || input.reason.trim().length === 0) {
    return { valid: false, error: "سبب البلاغ مطلوب" };
  }

  const cleanReason = input.reason.trim().toLowerCase();
  if (!VALID_REPORT_REASONS.has(cleanReason)) {
    return { valid: false, error: "فئة البلاغ غير صالحة" };
  }

  if (input.details && input.details.trim().length > 500) {
    return { valid: false, error: "يجب ألا تتجاوز تفاصيل البلاغ 500 حرف" };
  }

  return {
    valid: true,
    username: input.username.trim().toLowerCase(),
    reason: cleanReason,
    details: input.details ? input.details.trim() : null,
  };
}
