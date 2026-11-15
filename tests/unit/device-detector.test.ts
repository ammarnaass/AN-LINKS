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
    expect(parseUserAgent(undefined)).toEqual({
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    });
  });

  it("should detect custom or bot agents gracefully", () => {
    expect(detectDevice("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe("UNKNOWN");
    expect(detectOS("CustomBot 1.0")).toBe("Other");
    expect(detectBrowser("CustomBot 1.0")).toBe("Other");
  });
});

