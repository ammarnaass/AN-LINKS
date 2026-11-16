import { describe, it, expect } from "vitest";
import {
  parseUserAgent,
  detectDevice,
  detectOS,
  detectBrowser,
} from "@/shared/utils/device-detector";

describe("Device Detector Utility", () => {
  const IPHONE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
  const IPAD_UA =
    "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
  const ANDROID_MOBILE_UA =
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36";
  const ANDROID_TABLET_UA =
    "Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36";
  const WINDOWS_CHROME_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
  const WINDOWS_EDGE_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0";
  const MAC_SAFARI_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";
  const LINUX_FIREFOX_UA =
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0";

  it("should accurately parse iPhone mobile Safari", () => {
    const info = parseUserAgent(IPHONE_UA);
    expect(info.device).toBe("MOBILE");
    expect(info.os).toBe("iOS");
    expect(info.browser).toBe("Safari");
  });

  it("should accurately parse iPad tablet", () => {
    const info = parseUserAgent(IPAD_UA);
    expect(info.device).toBe("TABLET");
    expect(info.os).toBe("iOS");
    expect(info.browser).toBe("Safari");
  });

  it("should accurately parse Android mobile Chrome", () => {
    const info = parseUserAgent(ANDROID_MOBILE_UA);
    expect(info.device).toBe("MOBILE");
    expect(info.os).toBe("Android");
    expect(info.browser).toBe("Chrome");
  });

  it("should accurately parse Android tablet without Mobile token", () => {
    const info = parseUserAgent(ANDROID_TABLET_UA);
    expect(info.device).toBe("TABLET");
    expect(info.os).toBe("Android");
    expect(info.browser).toBe("Chrome");
  });

  it("should accurately parse Windows Edge", () => {
    const info = parseUserAgent(WINDOWS_EDGE_UA);
    expect(info.device).toBe("DESKTOP");
    expect(info.os).toBe("Windows");
    expect(info.browser).toBe("Edge");
  });

  it("should accurately parse macOS Safari", () => {
    const info = parseUserAgent(MAC_SAFARI_UA);
    expect(info.device).toBe("DESKTOP");
    expect(info.os).toBe("macOS");
    expect(info.browser).toBe("Safari");
  });

  it("should accurately parse Linux Firefox", () => {
    const info = parseUserAgent(LINUX_FIREFOX_UA);
    expect(info.device).toBe("DESKTOP");
    expect(info.os).toBe("Linux");
    expect(info.browser).toBe("Firefox");
  });

  it("should return safe fallback values for missing, empty or null user agents", () => {
    expect(parseUserAgent(null)).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
    expect(parseUserAgent("")).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
    expect(parseUserAgent("   ")).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
    expect(parseUserAgent("\t\n\r  ")).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
    expect(parseUserAgent(undefined)).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
    expect(parseUserAgent("unknown-raw-token-123")).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
  });

  it("should distinguish tablets vs mobile phones accurately", () => {
    // Amazon Kindle Silk tablet
    const silkTabletUA =
      "Mozilla/5.0 (Linux; U; Android 9; en-us; KFMAWI Build/PS7312) AppleWebKit/537.36 (KHTML, like Gecko) Silk/95.2.1 like Chrome/95.0.4638.74 Safari/537.36";
    const silkInfo = parseUserAgent(silkTabletUA);
    expect(silkInfo.device).toBe("TABLET");
    expect(silkInfo.os).toBe("Android");

    // BlackBerry Playbook tablet
    const playbookUA =
      "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML, like Gecko) Version/7.2.1.0 Safari/536.2+";
    expect(detectDevice(playbookUA)).toBe("TABLET");

    // Generic tablet token
    const genericTabletUA = "Mozilla/5.0 (Tablet; rv:26.0) Gecko/26.0 Firefox/26.0";
    expect(detectDevice(genericTabletUA)).toBe("TABLET");

    // Windows Phone / IEMobile should be MOBILE
    const winPhoneUA =
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch)";
    const winPhoneInfo = parseUserAgent(winPhoneUA);
    expect(winPhoneInfo.device).toBe("MOBILE");
    expect(winPhoneInfo.os).toBe("Windows");

    // Opera Mini on mobile should be MOBILE
    const operaMiniUA =
      "Opera/9.80 (Android; Opera Mini/36.2.2254/119.132; U; id) Presto/2.12.423 Version/12.16";
    expect(detectDevice(operaMiniUA)).toBe("MOBILE");
    expect(detectOS(operaMiniUA)).toBe("Android");
  });

  it("should detect bot and crawler user agents gracefully as UNKNOWN device", () => {
    const bots = [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Twitterbot/1.0",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
      "curl/8.4.0",
      "python-requests/2.31.0",
      "Wget/1.21.3",
      "PostmanRuntime/7.36.0",
    ];

    for (const bot of bots) {
      const parsed = parseUserAgent(bot);
      expect(parsed.device).toBe("UNKNOWN");
      expect(parsed.os).toBe("Other");
      expect(parsed.browser).toBe("Other");
    }
  });
});

