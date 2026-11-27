import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/admin/newsletter/route";
import { NextRequest } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { prisma } from "@/shared/db";

vi.mock("@/features/admin/server/admin.guard", () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/mailer", () => ({
  sendTransactionalEmail: vi.fn().mockResolvedValue({ sent: true, provider: "console" }),
}));

vi.mock("@/shared/db", () => ({
  prisma: {
    creatorSubscriber: {
      count: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    newsletterBroadcast: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    user: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("Admin Newsletter API Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks non-admin access with 403 or redirect", async () => {
    vi.mocked(requireAdminSession).mockResolvedValueOnce({
      authorized: false,
      response: new Response(JSON.stringify({ success: false, error: "غير مصرح" }), {
        status: 403,
      }) as any,
    });

    const res = await GET();
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("returns platform-wide stats, subscribers, and broadcasts for admins", async () => {
    vi.mocked(requireAdminSession).mockResolvedValueOnce({
      authorized: true,
      user: { id: "admin-1", role: "ADMIN", email: "admin@anlinks.dev" } as any,
    });

    vi.mocked(prisma.creatorSubscriber.count).mockResolvedValueOnce(150); // total
    vi.mocked(prisma.creatorSubscriber.count).mockResolvedValueOnce(142); // active
    vi.mocked(prisma.newsletterBroadcast.count).mockResolvedValueOnce(12); // broadcasts
    vi.mocked(prisma.newsletterBroadcast.count).mockResolvedValueOnce(12); // sentBroadcasts
    vi.mocked(prisma.creatorSubscriber.findMany).mockResolvedValueOnce([
      {
        id: "sub-1",
        email: "fan@example.com",
        name: "معجب المنصة",
        creatorId: "creator-99",
        status: "ACTIVE",
        source: "bio_page",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    vi.mocked(prisma.newsletterBroadcast.findMany).mockResolvedValueOnce([
      {
        id: "bc-1",
        creatorId: "admin-1",
        subject: "نشرة التحديثات الشهرية",
        content: "أهلاً بالجميع في منصة AN LINKS",
        sentCount: 142,
        status: "SENT",
        sentAt: new Date(),
        createdAt: new Date(),
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.stats.totalSubscribers).toBe(150);
    expect(data.stats.activeSubscribers).toBe(142);
    expect(data.stats.totalBroadcasts).toBe(12);
    expect(data.subscribers).toHaveLength(1);
    expect(data.broadcasts).toHaveLength(1);
  });

  it("dispatches system-wide campaign via POST action=broadcast", async () => {
    vi.mocked(requireAdminSession).mockResolvedValueOnce({
      authorized: true,
      user: { id: "admin-1", role: "ADMIN" } as any,
    });
    vi.mocked(prisma.creatorSubscriber.findMany).mockResolvedValueOnce([
      { email: "fan1@example.com" },
      { email: "fan2@example.com" },
    ] as any);
    vi.mocked(prisma.newsletterBroadcast.create).mockResolvedValueOnce({
      id: "bc-new",
      creatorId: "admin-1",
      subject: "إعلان هام للمشتركين",
      content: "محتوى الإعلان",
      sentCount: 2,
      status: "SENT",
      sentAt: new Date(),
      createdAt: new Date(),
    });

    const req = new NextRequest("http://localhost:3000/api/admin/newsletter", {
      method: "POST",
      body: JSON.stringify({
        action: "broadcast",
        subject: "إعلان هام للمشتركين",
        content: "محتوى الإعلان",
        targetAudience: "ALL_SUBSCRIBERS",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.broadcast.sentCount).toBe(2);
  });
});
