const DANGEROUS_PATTERNS = ["url(", "expression(", "javascript:", '"', "'", "@import", "<", ">", "\\"];

export function isValidImageUrl(url: string): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  const lower = trimmed.toLowerCase();
  for (const pattern of DANGEROUS_PATTERNS) {
    if (lower.includes(pattern)) return false;
  }

  // Safe local uploads
  if (/^\/uploads\/[a-zA-Z0-9_-]+\.(webp|png|jpe?g|svg|gif)$/i.test(trimmed)) {
    return true;
  }

  // Safe external HTTPS URLs
  if (/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s"';{}()<>]*)*$/i.test(trimmed)) {
    return true;
  }

  return false;
}

export function sanitizeCustomBackground(bg: string): string | null {
  if (typeof bg !== "string") return null;
  const trimmed = bg.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  for (const pattern of DANGEROUS_PATTERNS) {
    if (lower.includes(pattern)) return null;
  }

  // Valid hex color (#fff, #4edea3, #4edea3ff)
  if (/^#([0-9a-fA-F]{3,8})$/.test(trimmed)) {
    return trimmed;
  }

  // Safe gradient (linear-gradient or radial-gradient without ; or { or })
  if (/^(linear-gradient|radial-gradient)\([^;{}]+\)$/i.test(trimmed)) {
    return trimmed;
  }

  // Safe image URL or local upload
  if (isValidImageUrl(trimmed)) {
    return trimmed;
  }

  return null;
}
