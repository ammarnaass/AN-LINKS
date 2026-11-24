import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST } from "@/app/api/bio/[username]/subscribe/route";
import { NextRequest } from "next/server";
import { prisma } from "@/shared/db";

describe("Cookie Consent & Bio Newsletter Subscription Suite", () => {
  let testCreatorId: string;
  const testUsername = "newsletter_test_creator";
  const testEmail = "fan_subscriber@test.com";

  beforeAll(async () => {
    // Create test creator
    const user = await prisma.user.upsert({
      where: { username: testUsername },
      update: {},
      create: {
        email: "newsletter.creator@anlinks.dev",
        username: testUsername,
        role: "USER",
        profile: {
          create: {
            displayName: "مبدع النشرة التجريبي",
            isPublished: true,
          },
        },
      },
    });
    testCreatorId = user.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.creatorSubscriber.deleteMany({
      where: { creatorId: testCreatorId },
    });
    await prisma.profile.deleteMany({ where: { userId: testCreatorId } });
    await prisma.user.deleteMany({ where: { id: testCreatorId } });
    await prisma.$disconnect();
  });

  it("should reject subscription with empty or invalid email", async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/bio/${testUsername}/subscribe`,
      {
        method: "POST",
        body: JSON.stringify({ email: "invalid-email" }),
      }
    );

    const res = await POST(req, { params: Promise.resolve({ username: testUsername }) });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("should return 404 for non-existent creator username", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/bio/non_existent_creator_9999/subscribe",
      {
        method: "POST",
        body: JSON.stringify({ email: "subscriber@test.com" }),
      }
    );

    const res = await POST(req, {
      params: Promise.resolve({ username: "non_existent_creator_9999" }),
    });
    expect(res.status).toBe(404);
  });

  it("should successfully subscribe a user to creator newsletter", async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/bio/${testUsername}/subscribe`,
      {
        method: "POST",
        body: JSON.stringify({ email: testEmail, name: "متابع وفي" }),
      }
    );

    const res = await POST(req, { params: Promise.resolve({ username: testUsername }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.subscriberId).toBeDefined();

    // Verify record in PostgreSQL
    const record = await prisma.creatorSubscriber.findUnique({
      where: {
        creatorId_email: {
          creatorId: testCreatorId,
          email: testEmail,
        },
      },
    });
    expect(record).toBeDefined();
    expect(record?.name).toBe("متابع وفي");
  });

  it("should handle duplicate subscription gracefully without database errors (idempotent)", async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/bio/${testUsername}/subscribe`,
      {
        method: "POST",
        body: JSON.stringify({ email: testEmail, name: "اسم محدث" }),
      }
    );

    const res = await POST(req, { params: Promise.resolve({ username: testUsername }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    const record = await prisma.creatorSubscriber.findUnique({
      where: {
        creatorId_email: {
          creatorId: testCreatorId,
          email: testEmail,
        },
      },
    });
    expect(record?.name).toBe("اسم محدث");
  });
});
