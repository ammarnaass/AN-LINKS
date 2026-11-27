import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { validateWebhookUrl } from "@/features/webhooks/validators/webhooks.validator";
import { resolveWebhookSigningSecret } from "@/features/webhooks/services/webhook-signer.service";
import { encryptSecret } from "@/shared/lib/crypto";
import {
  createUnsubscribeSignature,
  verifyUnsubscribeSignature,
  escapeHtml,
} from "@/lib/html-escape";
import { GET as cronGet, POST as cronPost } from "@/app/api/cron/dispatch-webhooks/route";
import { PATCH as adminPayoutPatch } from "@/app/api/admin/payouts/route";
import { POST as storeCheckoutPost } from "@/app/api/bio/[username]/checkout/route";
import { prisma } from "@/shared/db";
import { getServerSession } from "next-auth";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("P0 Security & Integration Remediation Suite", () => {
  const prevEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...prevEnv };
  });

  it("blocks extended SSRF vectors (CGNAT, IPv6 mapped, credential URLs, numeric IP)", () => {
    expect(validateWebhookUrl("http://100.64.0.1/hook")).toBe(false);
    expect(validateWebhookUrl("http://[::ffff:127.0.0.1]/hook")).toBe(false);
    expect(validateWebhookUrl("http://user:pass@hooks.zapier.com/hook")).toBe(false);
    expect(validateWebhookUrl("http://2130706433/hook")).toBe(false);
    expect(validateWebhookUrl("https://hooks.zapier.com/hooks/catch/123")).toBe(true);
  });

  it("decrypts encrypted webhook secrets while keeping legacy plaintext secrets compatible", () => {
    process.env.PAYMENT_ENCRYPTION_KEY =
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const plain = "whsec_live_test_secret_987";
    const encrypted = encryptSecret(plain);
    expect(encrypted).not.toBe(plain);
    expect(resolveWebhookSigningSecret(encrypted)).toBe(plain);
    expect(resolveWebhookSigningSecret(plain)).toBe(plain);
  });

  it("enforces fail-closed CRON_SECRET verification with timingSafeEqual on GET and POST", async () => {
    delete process.env.CRON_SECRET;
    const noSecretRes = await cronGet(new NextRequest("http://localhost/api/cron/dispatch-webhooks"));
    expect(noSecretRes.status).toBe(500);

    process.env.CRON_SECRET = "super_cron_secret_test_123";
    const badAuthRes = await cronPost(
      new NextRequest("http://localhost/api/cron/dispatch-webhooks", {
        method: "POST",
        headers: { authorization: "Bearer internal_cron_secret" },
      })
    );
    expect(badAuthRes.status).toBe(401);
  });

  it("enforces admin authorization on /api/admin/payouts", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    const unauthRes = await adminPayoutPatch(
      new NextRequest("http://localhost/api/admin/payouts", {
        method: "PATCH",
        body: JSON.stringify({ payoutId: "p1", action: "APPROVE" }),
      })
    );
    expect(unauthRes.status).toBe(401);

    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "u1", role: "USER" },
    } as never);
    const nonAdminRes = await adminPayoutPatch(
      new NextRequest("http://localhost/api/admin/payouts", {
        method: "PATCH",
        body: JSON.stringify({ payoutId: "p1", action: "APPROVE" }),
      })
    );
    expect(nonAdminRes.status).toBe(403);
  });

  it("rejects live digital product checkout when active gateway is not in test mode (HTTP 402)", async () => {
    const prod = await prisma.digitalProduct.findFirst({
      where: { isActive: true },
      select: { id: true, currency: true, creatorId: true },
    });
    if (!prod) return;
    const creator = await prisma.user.findUnique({
      where: { id: prod.creatorId },
      select: { username: true },
    });
    if (!creator) return;

    const findFirstSpy = vi.spyOn(prisma.paymentGateway, "findFirst").mockResolvedValueOnce({
      id: "gw_live",
      code: "stripe",
      nameAr: "Stripe Live",
      nameEn: "Stripe",
      category: "CARD",
      isEnabled: true,
      isTestMode: false,
      publishableKey: "pk_live_123",
      secretKeyEncrypted: null,
      webhookSecret: null,
      feePercentage: 2.9,
      feeFixed: 1,
      supportedCurrencies: ["SAR", "USD", "AED"],
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const res = await storeCheckoutPost(
      new NextRequest(`http://localhost/api/bio/${creator.username}/checkout`, {
        method: "POST",
        body: JSON.stringify({
          productId: prod.id,
          buyerEmail: "buyer@example.com",
          gatewayCode: "stripe",
        }),
      }),
      { params: Promise.resolve({ username: creator.username }) }
    );
    findFirstSpy.mockRestore();
    expect(res.status).toBe(402);
  }, 15_000);

  it("creates and verifies HMAC unsubscribe tokens and escapes HTML cleanly", () => {
    const sig = createUnsubscribeSignature("creator_1", "Sub@Example.com");
    expect(verifyUnsubscribeSignature("creator_1", "sub@example.com", sig)).toBe(true);
    expect(verifyUnsubscribeSignature("creator_2", "sub@example.com", sig)).toBe(false);
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });
});
