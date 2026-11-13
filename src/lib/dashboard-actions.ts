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


