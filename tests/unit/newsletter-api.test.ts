import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/shared/db";
import { getServerSession } from "next-auth";
import { GET as getSettings, PATCH as patchSettings } from "@/app/api/settings/newsletter/route";
import { GET as getSubscribers, POST as postSubscriber } from "@/app/api/settings/subscribers/route";
import { PATCH as patchSubscriber, DELETE as deleteSubscriber } from "@/app/api/settings/subscribers/[id]/route";
import { POST as postBroadcast } from "@/app/api/settings/newsletter/broadcast/route";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("Newsletter Settings & Subscribers API Suite", () => {
  let testUserId: string;
  const testUsername = "api_test_newsletter_user";

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { username: testUsername },
      update: {},
      create: {
        email: "newsletter_api_test@anlinks.dev",
        username: testUsername,
        role: "USER",
        profile: {
          create: {
            displayName: "منظم النشرة",
            newsletterEnabled: true,
            newsletterTitle: "النشرة الأولى",
            newsletterSubtitle: "وصف النشرة",
            newsletterButtonText: "سجل الآن",
          },
        },
      },
      include: { profile: true },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.creatorSubscriber.deleteMany({ where: { creatorId: testUserId } });
    await prisma.newsletterBroadcast.deleteMany({ where: { creatorId: testUserId } });
    await prisma.profile.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    const res = await getSettings();
    expect(res.status).toBe(401);
  });

  it("fetches newsletter settings for authenticated creator", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: testUserId, email: "newsletter_api_test@anlinks.dev" },
    } as any);

    const res = await getSettings();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.newsletter.newsletterTitle).toBe("النشرة الأولى");
  });

  it("updates newsletter settings via PATCH /api/settings/newsletter", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: testUserId, email: "newsletter_api_test@anlinks.dev" },
    } as any);

    const req = new NextRequest("http://localhost:3000/api/settings/newsletter", {
      method: "PATCH",
      body: JSON.stringify({
        newsletterTitle: "نشرة تقنية محدثة",
        newsletterSubtitle: "وصف تقني محدث",
        newsletterButtonText: "انضمام فوري",
      }),
    });

    const res = await patchSettings(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.newsletter.newsletterTitle).toBe("نشرة تقنية محدثة");
  });

  it("adds and lists subscribers via /api/settings/subscribers", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: testUserId, email: "newsletter_api_test@anlinks.dev" },
    } as any);

    // Add subscriber
    const addReq = new NextRequest("http://localhost:3000/api/settings/subscribers", {
      method: "POST",
      body: JSON.stringify({ email: "subscriber_one@test.com", name: "مشترك 1" }),
    });
    const addRes = await postSubscriber(addReq);
    expect(addRes.status).toBe(200);
    const addData = await addRes.json();
    expect(addData.success).toBe(true);
    expect(addData.subscriber.email).toBe("subscriber_one@test.com");
    const subId = addData.subscriber.id;

    // List subscribers
    const listReq = new NextRequest("http://localhost:3000/api/settings/subscribers");
    const listRes = await getSubscribers(listReq);
    expect(listRes.status).toBe(200);
    const listData = await listRes.json();
    expect(listData.success).toBe(true);
    expect(listData.subscribers.length).toBeGreaterThanOrEqual(1);
    expect(listData.stats.total).toBeGreaterThanOrEqual(1);

    // Update status to UNSUBSCRIBED
    const patchReq = new NextRequest(`http://localhost:3000/api/settings/subscribers/${subId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "UNSUBSCRIBED" }),
    });
    const patchRes = await patchSubscriber(patchReq, { params: Promise.resolve({ id: subId }) });
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.subscriber.status).toBe("UNSUBSCRIBED");

    // Delete subscriber
    const delReq = new NextRequest(`http://localhost:3000/api/settings/subscribers/${subId}`, {
      method: "DELETE",
    });
    const delRes = await deleteSubscriber(delReq, { params: Promise.resolve({ id: subId }) });
    expect(delRes.status).toBe(200);
  });

  it("handles test-only newsletter broadcast dispatch", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: testUserId, email: "newsletter_api_test@anlinks.dev" },
    } as any);

    const req = new NextRequest("http://localhost:3000/api/settings/newsletter/broadcast", {
      method: "POST",
      body: JSON.stringify({
        subject: "عنوان الحملة التجريبية",
        content: "محتوى الرسالة التجريبية لنظام النشرة",
        testOnly: true,
      }),
    });

    const res = await postBroadcast(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("تم إرسال نسخة تجريبية");
  });
});
