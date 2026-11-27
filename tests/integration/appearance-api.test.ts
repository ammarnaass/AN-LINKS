import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/shared/db";
import { GET as getProfile, PATCH as patchProfile } from "@/app/api/profile/route";
import { sanitizeCustomBackground } from "@/features/appearance/utils/sanitizer";
import { NextRequest } from "next/server";
import * as nextAuth from "next-auth";

vi.mock("next-auth", async () => {
  const actual = await vi.importActual<typeof nextAuth>("next-auth");
  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});

describe("Appearance API & CSS Sanitizer (Task 1)", () => {
  let testUser: { id: string; email: string; username: string };

  beforeAll(async () => {
    const username = `test_appear_${Date.now()}`;
    testUser = await prisma.user.create({
      data: {
        email: `${username}@anlinks.dev`,
        username,
        role: "USER",
      },
    });
  }, 20_000);

  afterAll(async () => {
    if (testUser?.id) {
      await prisma.profile.deleteMany({ where: { userId: testUser.id } });
      await prisma.user.deleteMany({ where: { id: testUser.id } });
    }
    await prisma.$disconnect();
  }, 20_000);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sanitizeCustomBackground", () => {
    it("should accept valid 3, 6, and 8 digit hex colors", () => {
      expect(sanitizeCustomBackground("#fff")).toBe("#fff");
      expect(sanitizeCustomBackground("#4edea3")).toBe("#4edea3");
      expect(sanitizeCustomBackground("#4EDEA3FF")).toBe("#4EDEA3FF");
    });

    it("should accept safe CSS linear and radial gradients", () => {
      const linear = "linear-gradient(135deg, #10b981 0%, #064e3b 100%)";
      const radial = "radial-gradient(circle at center, #3b82f6 0%, #1e1b4b 100%)";
      expect(sanitizeCustomBackground(linear)).toBe(linear);
      expect(sanitizeCustomBackground(radial)).toBe(radial);
    });

    it("should reject malicious CSS injections, url(), and scripts", () => {
      expect(sanitizeCustomBackground("url('https://evil.com/bg.png')")).toBeNull();
      expect(sanitizeCustomBackground("linear-gradient(to right, red, url(evil.png))")).toBeNull();
      expect(sanitizeCustomBackground("expression(alert(1))")).toBeNull();
      expect(sanitizeCustomBackground("javascript:alert(1)")).toBeNull();
      expect(sanitizeCustomBackground("@import url('https://evil.com')")).toBeNull();
      expect(sanitizeCustomBackground('<script>alert("xss")</script>')).toBeNull();
      expect(sanitizeCustomBackground("linear-gradient(red, blue); background: red")).toBeNull();
      expect(sanitizeCustomBackground("red")).toBeNull();
      expect(sanitizeCustomBackground("")).toBeNull();
    });
  });

  describe("GET /api/profile", () => {
    it("should return 401 when unauthenticated", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue(null);
      const res = await getProfile();
      expect(res.status).toBe(401);
    });

    it("should create profile with modern defaults when user has no existing profile", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: "مستخدم", username: testUser.username, role: "USER" },
      });

      const res = await getProfile();
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.profile.themeKey).toBe("layanDark");
      expect(data.profile.accentColor).toBe("#4edea3");
      expect(data.profile.buttonStyle).toBe("filled");
      expect(data.profile.buttonShadow).toBe("none");
      expect(data.profile.borderRadius).toBe("rounded-xl");
      expect(data.profile.font).toBe("Cairo");
      expect(data.profile.backgroundType).toBe("THEME");
      expect(data.profile.socialPosition).toBe("top");
    }, 15_000);
  });

  describe("PATCH /api/profile", () => {
    it("should return 401 when unauthenticated", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ themeKey: "layanDark" }),
      });
      const res = await patchProfile(req);
      expect(res.status).toBe(401);
    });

    it("should update appearance fields successfully with valid data", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: "مستخدم", username: testUser.username, role: "USER" },
      });

      const req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          backgroundType: "GRADIENT",
          customBackground: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)",
          buttonShadow: "glow",
          buttonStyle: "glass",
          borderRadius: "rounded-full",
          font: "Tajawal",
          socialPosition: "bottom",
          accentColor: "#38bdf8",
        }),
      });

      const res = await patchProfile(req);
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.profile.backgroundType).toBe("GRADIENT");
      expect(data.profile.customBackground).toBe("linear-gradient(135deg, #10b981 0%, #064e3b 100%)");
      expect(data.profile.buttonShadow).toBe("glow");
      expect(data.profile.buttonStyle).toBe("glass");
      expect(data.profile.borderRadius).toBe("rounded-full");
      expect(data.profile.font).toBe("Tajawal");
      expect(data.profile.socialPosition).toBe("bottom");
      expect(data.profile.accentColor).toBe("#38bdf8");
    }, 15_000);

    it("should reject malicious customBackground with HTTP 400", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: "مستخدم", username: testUser.username, role: "USER" },
      });

      const req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          customBackground: "url('https://evil.com/payload.png')",
        }),
      });

      const res = await patchProfile(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("غير صالحة أو غير آمنة");
    });

    it("should reject invalid enum values with HTTP 400", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: "مستخدم", username: testUser.username, role: "USER" },
      });

      // Invalid buttonStyle
      let req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ buttonStyle: "invalid_style" }),
      });
      let res = await patchProfile(req);
      expect(res.status).toBe(400);

      // Invalid buttonShadow
      req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ buttonShadow: "ultra-deep" }),
      });
      res = await patchProfile(req);
      expect(res.status).toBe(400);

      // Invalid backgroundType
      req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ backgroundType: "VIDEO_3D" }),
      });
      res = await patchProfile(req);
      expect(res.status).toBe(400);

      // Invalid socialPosition
      req = new NextRequest("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ socialPosition: "floating-center" }),
      });
      res = await patchProfile(req);
      expect(res.status).toBe(400);
    }, 15_000);
  });
});
