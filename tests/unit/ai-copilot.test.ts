import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/ai/copilot/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/shared/db";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/shared/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    userSubscription: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/rate-limiter", () => ({
  enforceRateLimit: vi.fn().mockReturnValue(null),
}));

describe("Gemini AI Copilot Endpoint (/api/ai/copilot)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "bio_suggest", niche: "تقنية وتصميم" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it("should return 403 when user plan does not have allowAiCopilot enabled", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user_free_1", role: "USER" },
    } as any);

    vi.mocked(prisma.userSubscription.findFirst).mockResolvedValue({
      plan: {
        quotas: {
          allowAiCopilot: false,
        },
      },
    } as any);

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "bio_suggest", niche: "تقنية وتصميم" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("الذكاء الاصطناعي");
  });

  it("should generate 3 bio suggestions when mode is bio_suggest and quota is allowed", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user_pro_1", role: "USER" },
    } as any);

    vi.mocked(prisma.userSubscription.findFirst).mockResolvedValue({
      plan: {
        quotas: {
          allowAiCopilot: true,
        },
      },
    } as any);

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "bio_suggest", niche: "صانع محتوى تقني وتطوير برمجيات" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.suggestions)).toBe(true);
    expect(data.suggestions.length).toBeGreaterThanOrEqual(3);
    expect(typeof data.suggestions[0]).toBe("string");
  });

  it("should generate link title and icon when mode is link_suggest", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "user_pro_1", role: "USER" },
    } as any);

    vi.mocked(prisma.userSubscription.findFirst).mockResolvedValue({
      plan: {
        quotas: {
          allowAiCopilot: true,
        },
      },
    } as any);

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "link_suggest",
        url: "https://youtube.com/@techcreator",
      }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.title).toBeDefined();
    expect(data.suggestedIcon).toBeDefined();
  });
});
