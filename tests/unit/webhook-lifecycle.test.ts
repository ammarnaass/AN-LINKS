import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import * as webhookRoute from "@/app/api/subscriptions/webhooks/[gateway]/route";
import {
  processPaymentSuccess,
  processPaymentFailure,
  processSubscriptionCancellation,
} from "@/features/subscriptions/services/webhook-lifecycle.service";

vi.mock("@/shared/db", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockPrisma: any = {
    paymentGateway: { findUnique: vi.fn() },
    financialInvoice: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    userSubscription: {
      upsert: vi.fn(),
      updateMany: vi.fn(),
    },
    user: { update: vi.fn() },
    subscriptionPlan: { findUnique: vi.fn() },
    promotionCoupon: { updateMany: vi.fn() },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction: vi.fn(async (cb: (tx: any) => Promise<any>) => {
      return await cb(mockPrisma);
    }),
  };

  return { prisma: mockPrisma };
});

import { prisma } from "@/shared/db";

describe("Webhook Subscription Lifecycle Hardening", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Service Layer", () => {
    it("processPaymentFailure marks invoice as FAILED and subscription as PAST_DUE", async () => {
      await processPaymentFailure("inv_fail_1", "user_1");

      expect(prisma.financialInvoice.update).toHaveBeenCalledWith({
        where: { id: "inv_fail_1" },
        data: { status: "FAILED" },
      });

      expect(prisma.userSubscription.updateMany).toHaveBeenCalledWith({
        where: { userId: "user_1" },
        data: { status: "PAST_DUE" },
      });
    });

    it("processSubscriptionCancellation marks subscription as CANCELED and downgrades role if immediate", async () => {
      await processSubscriptionCancellation("user_2", { immediate: true });

      expect(prisma.userSubscription.updateMany).toHaveBeenCalledWith({
        where: { userId: "user_2" },
        data: { status: "CANCELED", cancelAtPeriodEnd: true },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user_2" },
        data: { role: "USER" },
      });
    });
  });

  describe("Webhook Route Integration for Failure & Cancellation", () => {
    it("handles invoice.payment_failed event cleanly", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "stripe",
        webhookSecret: null,
      } as any);

      vi.mocked(prisma.financialInvoice.findFirst)
        .mockResolvedValueOnce(null) // idempotency check
        .mockResolvedValueOnce({
          id: "inv_stripe_fail",
          userId: "user_subscriber_9",
          status: "PENDING",
        } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({
          type: "invoice.payment_failed",
          gatewayTxId: "in_stripe_fail_123",
        }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "stripe" }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.event).toBe("payment.failed");

      expect(prisma.financialInvoice.update).toHaveBeenCalledWith({
        where: { id: "inv_stripe_fail" },
        data: { status: "FAILED" },
      });

      expect(prisma.userSubscription.updateMany).toHaveBeenCalledWith({
        where: { userId: "user_subscriber_9" },
        data: { status: "PAST_DUE" },
      });
    });

    it("handles customer.subscription.deleted event cleanly with immediate role downgrade", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "moyasar",
        webhookSecret: null,
      } as any);

      vi.mocked(prisma.financialInvoice.findFirst)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "inv_moyasar_sub",
          userId: "user_creator_sa",
          status: "PAID",
        } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/moyasar", {
        method: "POST",
        body: JSON.stringify({
          type: "customer.subscription.deleted",
          gatewayTxId: "sub_moyasar_del_789",
          immediate: true,
        }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "moyasar" }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.event).toBe("subscription.canceled");

      expect(prisma.userSubscription.updateMany).toHaveBeenCalledWith({
        where: { userId: "user_creator_sa" },
        data: { status: "CANCELED", cancelAtPeriodEnd: true },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user_creator_sa" },
        data: { role: "USER" },
      });
    });
  });
});
