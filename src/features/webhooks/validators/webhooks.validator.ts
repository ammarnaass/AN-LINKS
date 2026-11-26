const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // AWS/GCP link-local metadata
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export function isPrivateOrLocalIp(hostname: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
}

export function validateWebhookUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }
    if (isPrivateOrLocalIp(url.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export interface WebhookEndpointValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateWebhookEndpointInput(input: {
  url: string;
  events: string[];
}): WebhookEndpointValidationResult {
  if (!input.url || !validateWebhookUrl(input.url)) {
    return {
      isValid: false,
      error: "يجب تقديم رابط ويب صالح وآمن (غير محلي أو خاص)",
    };
  }

  if (!Array.isArray(input.events) || input.events.length === 0) {
    return {
      isValid: false,
      error: "يجب تحديد حدث واحد على الأقل",
    };
  }

  return { isValid: true };
}
