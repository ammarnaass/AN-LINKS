export type DeviceType = "MOBILE" | "DESKTOP" | "TABLET" | "UNKNOWN";
export type OSType = "iOS" | "Android" | "Windows" | "macOS" | "Linux" | "Other";
export type BrowserType = "Chrome" | "Safari" | "Firefox" | "Edge" | "Other";

export interface DeviceInfo {
  device: DeviceType;
  os: OSType;
  browser: BrowserType;
}

export function detectDevice(ua: string): DeviceType {
  if (/(ipad|tablet|(android(?!.*mobile))|playbook|silk)/i.test(ua)) {
    return "TABLET";
  }
  if (/(mobi|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop)/i.test(ua)) {
    return "MOBILE";
  }
  if (/android/i.test(ua)) {
    return "MOBILE";
  }
  if (/(windows|macintosh|mac os x|linux|cros)/i.test(ua)) {
    return "DESKTOP";
  }
  return "UNKNOWN";
}

export function detectOS(ua: string): OSType {
  if (/(iphone|ipad|ipod)/i.test(ua)) {
    return "iOS";
  }
  if (/android/i.test(ua)) {
    return "Android";
  }
  if (/(windows nt|win32|win64)/i.test(ua)) {
    return "Windows";
  }
  if (/(macintosh|mac os x)/i.test(ua)) {
    return "macOS";
  }
  if (/(linux|x11)/i.test(ua)) {
    return "Linux";
  }
  return "Other";
}

export function detectBrowser(ua: string): BrowserType {
  if (/(edg\/|edge\/|edgios\/|edga\/)/i.test(ua)) {
    return "Edge";
  }
  if (/(firefox\/|fxios\/)/i.test(ua)) {
    return "Firefox";
  }
  if (/(chrome\/|crios\/)/i.test(ua)) {
    return "Chrome";
  }
  if (/safari\//i.test(ua)) {
    return "Safari";
  }
  return "Other";
}

export function parseUserAgent(userAgent?: string | null): DeviceInfo {
  if (!userAgent || typeof userAgent !== "string" || !userAgent.trim()) {
    return {
      device: "UNKNOWN",
      os: "Other",
      browser: "Other",
    };
  }

  const ua = userAgent.trim();
  return {
    device: detectDevice(ua),
    os: detectOS(ua),
    browser: detectBrowser(ua),
  };
}

