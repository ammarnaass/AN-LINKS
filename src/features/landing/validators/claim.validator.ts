import { ClaimResult } from "../types/landing.types";

export function sanitizeClaimUsername(rawInput: string): ClaimResult {
  if (!rawInput || typeof rawInput !== "string") {
    return {
      username: "",
      isValid: false,
      targetUrl: "/register",
      error: "يرجى إدخال اسم مستخدم",
    };
  }

  let cleaned = rawInput.trim();
  if (cleaned.startsWith("@")) {
    cleaned = cleaned.slice(1);
  }
  cleaned = cleaned.toLowerCase();

  if (!cleaned) {
    return {
      username: "",
      isValid: false,
      targetUrl: "/register",
      error: "يرجى إدخال اسم مستخدم",
    };
  }

  // Username must be 3-30 chars, latin letters, numbers, hyphens
  if (!/^[a-z0-9-]+$/.test(cleaned)) {
    return {
      username: cleaned,
      isValid: false,
      targetUrl: `/register?username=${encodeURIComponent(cleaned)}`,
      error: "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة فقط",
    };
  }

  if (cleaned.length < 3 || cleaned.length > 30) {
    return {
      username: cleaned,
      isValid: false,
      targetUrl: `/register?username=${encodeURIComponent(cleaned)}`,
      error: "يجب أن يتراوح طول اسم المستخدم بين 3 و 30 حرفاً",
    };
  }

  return {
    username: cleaned,
    isValid: true,
    targetUrl: `/register?username=${encodeURIComponent(cleaned)}`,
  };
}

