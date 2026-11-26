import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as subscribeNewsletter } from "@/app/api/newsletter/subscribe/route";
import { NextRequest } from "next/server";
import { prisma } from "@/shared/db";

vi.mock("@/shared/db", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
    creatorSubscriber: {
      upsert: vi.fn(),
    },
  },
}));

describe("Platform Newsletter API Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when email is missing or empty", async () => {
    const req = new NextRequest("http://localhost:3000/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await subscribeNewsletter(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("يرجى إدخال البريد الإلكتروني");
  });

  it("should return 400 when email format is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "invalid-email-address" }),
    });
    const res = await subscribeNewsletter(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("صيغة البريد الإلكتروني غير صالحة");
  });

  it("should successfully subscribe and persist to database with landing_footer source", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: "admin-system-id",
    } as any);

    vi.mocked(prisma.creatorSubscriber.upsert).mockResolvedValueOnce({
      id: "sub-123",
      creatorId: "admin-system-id",
      email: "subscriber@example.com",
      status: "ACTIVE",
    } as any);

    const req = new NextRequest("http://localhost:3000/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "subscriber@example.com", name: "أحمد" }),
    });

    const res = await subscribeNewsletter(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("تم انضمامك");

    expect(prisma.creatorSubscriber.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          creatorId_email: {
            creatorId: "admin-system-id",
            email: "subscriber@example.com",
          },
        },
        create: expect.objectContaining({
          creatorId: "admin-system-id",
          email: "subscriber@example.com",
          source: "landing_footer",
        }),
      })
    );
  });
});
