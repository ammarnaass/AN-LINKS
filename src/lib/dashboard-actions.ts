import { sanitizeUrl } from "./url-sanitizer";

export interface LinkValidationInput {
  title: string;
  url: string;
}

export interface LinkValidationResult {
  valid: boolean;
  title?: string;
  normalizedUrl?: string;
  error?: string;
}

export function validateLinkInput(input: LinkValidationInput): LinkValidationResult {
  if (!input.title || input.title.trim().length === 0) {
    return { valid: false, error: "عنوان الرابط مطلوب" };
  }

  const cleanTitle = input.title.trim();
  if (cleanTitle.length > 100) {
    return { valid: false, error: "يجب ألا يتجاوز عنوان الرابط 100 حرف" };
  }

  const urlCheck = sanitizeUrl(input.url);
  if (!urlCheck.valid || !urlCheck.normalizedUrl) {
    return { valid: false, error: urlCheck.error || "الرابط غير صالح" };
  }

  return {
    valid: true,
    title: cleanTitle,
    normalizedUrl: urlCheck.normalizedUrl,
  };
}

export function reorderLinkItems<T extends { id: string; position: number }>(
  items: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }

  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);

  return result.map((item, idx) => ({
    ...item,
    position: idx,
  }));
}

export function filterLinks<T extends { isActive: boolean }>(
  links: T[],
  filter: "all" | "active" | "draft"
): T[] {
  if (filter === "active") return links.filter((l) => l.isActive);
  if (filter === "draft") return links.filter((l) => !l.isActive);
  return links;
}

export function calculateQuickMetrics(totalViews: number, totalClicks: number) {
  const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  return {
    totalViews,
    totalClicks,
    ctrPercentage: `${ctr.toFixed(1)}%`,
  };
}

export interface ProfileSettingsInput {
  displayName: string;
  email: string;
  username: string;
  bio?: string;
  phone?: string;
}

export function validateSettingsProfile(input: ProfileSettingsInput): { valid: boolean; error?: string } {
  if (!input.displayName || input.displayName.trim().length === 0) {
    return { valid: false, error: "الاسم المعروض مطلوب" };
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { valid: false, error: "البريد الإلكتروني غير صالح" };
  }
  if (!input.username || !/^[a-zA-Z0-9_-]{3,30}$/.test(input.username)) {
    return { valid: false, error: "اسم المستخدم غير صالح" };
  }
  return { valid: true };
}

export function validatePasswordChange(currentPass: string, newPass: string, confirmPass: string) {
  if (!currentPass) return { valid: false, error: "كلمة المرور الحالية مطلوبة" };
  if (!newPass || newPass.length < 8) return { valid: false, error: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف" };
  if (newPass !== confirmPass) return { valid: false, error: "تأكيد كلمة المرور غير متطابق" };
  return { valid: true };
}



