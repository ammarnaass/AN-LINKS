const KNOWN_BOT_PATTERNS = [
  /facebookexternalhit/i,
  /twitterbot/i,
  /telegrambot/i,
  /whatsapp/i,
  /bytespider/i,
  /googlebot/i,
  /bingbot/i,
  /slackbot/i,
  /discordbot/i,
  /applebot/i,
  /linkedinbot/i,
  /pinterest/i,
  /yandexbot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /crawler/i,
  /spider/i,
  /bot\b/i,
];

export function isBotOrPrefetch(userAgent: string | null, headers: Headers): boolean {
  if (!userAgent) return true;

  // Check prefetch / preview headers
  const purpose = headers.get("purpose")?.toLowerCase();
  const xPurpose = headers.get("x-purpose")?.toLowerCase();
  const secPurpose = headers.get("sec-purpose")?.toLowerCase();

  if (
    purpose === "prefetch" ||
    xPurpose === "preview" ||
    secPurpose === "prefetch" ||
    purpose === "preview"
  ) {
    return true;
  }

  // Check User-Agent against known crawler patterns
  for (const pattern of KNOWN_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

export function truncateIp(ip: string): string {
  if (!ip || typeof ip !== "string") return "unknown";

  const trimmed = ip.trim();

  // IPv4 check: e.g. 192.168.1.50 -> 192.168.1.0/24
  const ipv4Parts = trimmed.split(".");
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => /^\d{1,3}$/.test(p))) {
    return `${ipv4Parts[0]}.${ipv4Parts[1]}.${ipv4Parts[2]}.0/24`;
  }

  // IPv6 check: e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334 -> 2001:0db8:85a3::/48
  if (trimmed.includes(":")) {
    const segments = trimmed.split(":");
    if (segments.length >= 3) {
      return `${segments[0]}:${segments[1]}:${segments[2]}::/48`;
    }
  }

  return "unknown";
}
