import { describe, it, expect } from "vitest";
import { isUsernameReserved, RESERVED_USERNAMES } from "@/lib/reserved-usernames";

describe("Reserved Usernames Utility", () => {
  it("should block system, auth, and dashboard routes as usernames", () => {
    const reserved = [
      "api",
      "dashboard",
      "admin",
      "login",
      "register",
      "go",
      "settings",
      "profile",
      "analytics",
      "help",
      "terms",
      "privacy",
      "robots.txt",
      "favicon.ico",
      "sitemap.xml",
      "healthz",
    ];

    for (const name of reserved) {
      expect(isUsernameReserved(name)).toBe(true);
      expect(isUsernameReserved(name.toUpperCase())).toBe(true);
    }
  });

  it("should allow valid non-reserved user names", () => {
    expect(isUsernameReserved("ammar")).toBe(false);
    expect(isUsernameReserved("designer_sa")).toBe(false);
    expect(isUsernameReserved("coffee-shop")).toBe(false);
    expect(isUsernameReserved("developer123")).toBe(false);
  });

  it("should export the list of reserved usernames", () => {
    expect(Array.isArray(RESERVED_USERNAMES)).toBe(true);
    expect(RESERVED_USERNAMES.length).toBeGreaterThan(15);
  });
});
