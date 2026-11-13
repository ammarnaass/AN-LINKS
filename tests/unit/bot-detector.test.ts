import { describe, it, expect } from "vitest";
import { isBotOrPrefetch, truncateIp } from "@/lib/bot-detector";

describe("Bot Detector & Privacy Helpers", () => {
  it("should detect common social media crawlers and scraping bots", () => {
    const bots = [
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "Twitterbot/1.0",
      "TelegramBot (like TwitterBot)",
      "WhatsApp/2.21.12.21 A",
      "Mozilla/5.0 (compatible; Bytespider; https://zhanzhang.toutiao.com/)",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ];

    for (const ua of bots) {
      expect(isBotOrPrefetch(ua, new Headers())).toBe(true);
    }
  });

  it("should not flag normal browser User-Agents as bots", () => {
    const regularBrowsers = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ];

    for (const ua of regularBrowsers) {
      expect(isBotOrPrefetch(ua, new Headers())).toBe(false);
    }
  });

  it("should detect Purpose: prefetch and X-Purpose: preview headers", () => {
    const headers1 = new Headers();
    headers1.set("purpose", "prefetch");
    expect(isBotOrPrefetch("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", headers1)).toBe(true);

    const headers2 = new Headers();
    headers2.set("x-purpose", "preview");
    expect(isBotOrPrefetch("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", headers2)).toBe(true);

    const headers3 = new Headers();
    headers3.set("sec-purpose", "prefetch");
    expect(isBotOrPrefetch("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", headers3)).toBe(true);
  });

  it("should truncate IPv4 to /24 subnet for privacy", () => {
    expect(truncateIp("192.168.1.50")).toBe("192.168.1.0/24");
    expect(truncateIp("10.0.45.123")).toBe("10.0.45.0/24");
  });

  it("should truncate IPv6 to /48 subnet for privacy", () => {
    expect(truncateIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:0db8:85a3::/48");
  });

  it("should handle invalid or empty IP addresses gracefully", () => {
    expect(truncateIp("")).toBe("unknown");
    expect(truncateIp("invalid-ip")).toBe("unknown");
  });
});

