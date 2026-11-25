import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { isLinkWithinSchedule } from "@/features/bio/utils/link-schedule";
import { getPublicProfileData } from "@/features/bio/services/profile.service";
import { POST as verifyLinkPin } from "@/app/api/bio/verify-link/route";
import { POST as checkoutProduct } from "@/app/api/bio/[username]/checkout/route";
import { prisma } from "@/shared/db";

describe("Advanced Link Controls & Digital Storefront Suite", () => {
  let creatorId: string;
  let pinLinkId: string;
  let productId: string;
  const username = "adv_store_creator";

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { username },
      update: { isSuspended: false },
      create: {
        email: "adv.store@anlinks.dev",
        username,
        role: "USER",
        profile: {
          create: {
            displayName: "مبدع المتجر والروابط",
            isPublished: true,
          },
        },
      },
    });
    creatorId = user.id;

    const now = Date.now();
    const pastDate = new Date(now - 24 * 60 * 60 * 1000);
    const futureDate = new Date(now + 24 * 60 * 60 * 1000);

    await prisma.link.deleteMany({ where: { userId: creatorId } });

    const pinLink = await prisma.link.create({
      data: {
        userId: creatorId,
        title: "محتوى حصري برمز PIN",
        url: "https://example.com/vip",
        isActive: true,
        pinCode: "4321",
        isSensitive: true,
      },
    });
    pinLinkId = pinLink.id;

    // Future-scheduled link (should not appear yet)
    await prisma.link.create({
      data: {
        userId: creatorId,
        title: "رابط مستقبلي",
        url: "https://example.com/future",
        isActive: true,
        scheduledStart: futureDate,
      },
    });

    // Expired link (should not appear)
    await prisma.link.create({
      data: {
        userId: creatorId,
        title: "رابط منتهي الصلاحية",
        url: "https://example.com/expired",
        isActive: true,
        scheduledEnd: pastDate,
      },
    });

    await prisma.digitalProduct.deleteMany({ where: { creatorId } });
    const product = await prisma.digitalProduct.create({
      data: {
        creatorId,
        title: "كتاب التصميم الاحترافي PDF",
        price: 75,
        currency: "SAR",
        productType: "DIGITAL",
        fileUrl: "https://cdn.anlinks.dev/design-guide.pdf",
        isActive: true,
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.digitalOrder.deleteMany({ where: { creatorId } });
    await prisma.digitalProduct.deleteMany({ where: { creatorId } });
    await prisma.link.deleteMany({ where: { userId: creatorId } });
    await prisma.profile.deleteMany({ where: { userId: creatorId } });
    await prisma.user.deleteMany({ where: { id: creatorId } });
    await prisma.$disconnect();
  });

  it("evaluates scheduled start/end link visibility windows accurately", () => {
    const now = new Date("2026-11-25T12:00:00Z");
    expect(isLinkWithinSchedule({}, now)).toBe(true);
    expect(
      isLinkWithinSchedule({ scheduledStart: "2026-11-26T00:00:00Z" }, now)
    ).toBe(false);
    expect(
      isLinkWithinSchedule({ scheduledEnd: "2026-11-24T00:00:00Z" }, now)
    ).toBe(false);
    expect(
      isLinkWithinSchedule(
        {
          scheduledStart: "2026-11-24T00:00:00Z",
          scheduledEnd: "2026-11-26T00:00:00Z",
        },
        now
      )
    ).toBe(true);
  });

  it("omits out-of-schedule links and masks raw pinCode in getPublicProfileData", async () => {
    const data = await getPublicProfileData(username);
    expect(data).not.toBeNull();
    expect(data?.links).toHaveLength(1);
    expect(data?.links[0].id).toBe(pinLinkId);
    expect(data?.links[0].hasPin).toBe(true);
    expect(data?.links[0].isSensitive).toBe(true);
    expect((data?.links[0] as unknown as Record<string, unknown>).pinCode).toBeUndefined();
    expect(data?.products).toHaveLength(1);
  });

  it("verifies PIN protected links securely via /api/bio/verify-link", async () => {
    const badReq = new NextRequest("http://localhost:3000/api/bio/verify-link", {
      method: "POST",
      body: JSON.stringify({ linkId: pinLinkId, pin: "0000" }),
    });
    const badRes = await verifyLinkPin(badReq);
    expect(badRes.status).toBe(403);

    const goodReq = new NextRequest("http://localhost:3000/api/bio/verify-link", {
      method: "POST",
      body: JSON.stringify({ linkId: pinLinkId, pin: "4321" }),
    });
    const goodRes = await verifyLinkPin(goodReq);
    expect(goodRes.status).toBe(200);
    const json = await goodRes.json();
    expect(json.success).toBe(true);
    expect(json.redirectUrl).toContain(`/go/${pinLinkId}?pin=4321`);
  });

  it("processes digital product checkout, increments salesCount, and issues deliveryUrl", async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/bio/${username}/checkout`,
      {
        method: "POST",
        body: JSON.stringify({ productId, buyerEmail: "buyer@anlinks.dev" }),
      }
    );

    const res = await checkoutProduct(req, {
      params: Promise.resolve({ username }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.deliveryUrl).toBe("https://cdn.anlinks.dev/design-guide.pdf");

    const updated = await prisma.digitalProduct.findUnique({
      where: { id: productId },
    });
    expect(updated?.salesCount).toBe(1);
  });
});
