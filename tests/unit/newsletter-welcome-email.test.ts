import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/bio/[username]/subscribe/route";
import { prisma } from "@/shared/db";
import { sendTransactionalEmail } from "@/lib/mailer";
import { enqueueWebhookEvent } from "@/features/webhooks";

// Mock dependencies
vi.mock("@/shared/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    creatorSubscriber: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/mailer", () => ({
  sendTransactionalEmail: vi.fn().mockResolvedValue({ sent: true, provider: "console" }),
}));

vi.mock("@/features/webhooks", () => ({
  enqueueWebhookEvent: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/rate-limiter", () => ({
  enforceRateLimit: vi.fn().mockReturnValue(null),
}));

describe("Automated Newsletter Welcome Email & Lead Webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger automated welcome email and lead webhook when creator has welcome email configured", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "creator_1",
      isSuspended: false,
      profile: {
        newsletterEnabled: true,
        displayName: "سعود العازمي",
        welcomeSubject: "أهلاً بك في النشرة الخاصة! 🎁",
        welcomeBody: "يسعدني انضمامك، إليك كود الخصم الحصري: VIP2026",
        welcomeGiftUrl: "https://anlinks.dev/gift.pdf",
      },
    } as any);

    vi.mocked(prisma.creatorSubscriber.upsert).mockResolvedValue({
      id: "sub_123",
      creatorId: "creator_1",
      email: "subscriber@example.com",
      name: "فيصل",
      source: "bio_page",
      status: "ACTIVE",
      createdAt: new Date(),
    } as any);

    const req = new Request("http://localhost:3000/api/bio/saud/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "subscriber@example.com", name: "فيصل" }),
    });

    const res = await POST(req as any, { params: Promise.resolve({ username: "saud" }) });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify welcome email was called
    expect(sendTransactionalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "subscriber@example.com",
        subject: "أهلاً بك في النشرة الخاصة! 🎁",
      })
    );

    // Verify lead webhook event was enqueued
    expect(enqueueWebhookEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        creatorId: "creator_1",
        event: "lead.collected",
      })
    );
  });

  it("should succeed without calling sendTransactionalEmail if creator has no welcome email set", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "creator_2",
      isSuspended: false,
      profile: {
        newsletterEnabled: true,
        displayName: "مريم",
        welcomeSubject: null,
        welcomeBody: null,
        welcomeGiftUrl: null,
      },
    } as any);

    vi.mocked(prisma.creatorSubscriber.upsert).mockResolvedValue({
      id: "sub_456",
      creatorId: "creator_2",
      email: "mariam_fan@example.com",
      name: null,
      source: "bio_page",
      status: "ACTIVE",
      createdAt: new Date(),
    } as any);

    const req = new Request("http://localhost:3000/api/bio/mariam/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "mariam_fan@example.com" }),
    });

    const res = await POST(req as any, { params: Promise.resolve({ username: "mariam" }) });
    expect(res.status).toBe(200);

    // Email should NOT be called
    expect(sendTransactionalEmail).not.toHaveBeenCalled();
    // But webhook should still be enqueued
    expect(enqueueWebhookEvent).toHaveBeenCalled();
  });
});
