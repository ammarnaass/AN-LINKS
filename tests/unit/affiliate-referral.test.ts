import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  recordReferralAttribution,
  processSubscriptionCommission,
  settleEscrowCommissions,
} from "@/features/affiliate/server/affiliate.service";
import { prisma } from "@/shared/db";

vi.mock("@/shared/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    affiliateCommissionLog: {
      create: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

describe("Affiliate & Referral Attribution Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("recordReferralAttribution", () => {
    it("should attribute new user to referrer successfully", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: "referrer_100",
        username: "supercreator",
        referralCode: "supercreator",
      } as any);

      vi.mocked(prisma.user.update).mockResolvedValue({
        id: "new_buyer_200",
        referredById: "referrer_100",
      } as any);

      const result = await recordReferralAttribution("new_buyer_200", "supercreator");
      expect(result.attributed).toBe(true);
      expect(result.referrerId).toBe("referrer_100");
    });

    it("should block self-referrals when user refers themselves", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: "user_same_id",
        username: "cleveruser",
        referralCode: "cleveruser",
      } as any);

      const result = await recordReferralAttribution("user_same_id", "cleveruser");
      expect(result.attributed).toBe(false);
      expect(result.reason).toBe("SELF_REFERRAL_BLOCKED");
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("processSubscriptionCommission", () => {
    it("should record 20% commission in 30-day ESCROW for referred subscriber", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "buyer_200",
        referredById: "referrer_100",
      } as any);

      vi.mocked(prisma.affiliateCommissionLog.create).mockImplementation(({ data }) =>
        Promise.resolve({ id: "log_1", ...data }) as any
      );

      const result = await processSubscriptionCommission({
        invoiceId: "inv_999",
        subscriptionId: "sub_999",
        buyerUserId: "buyer_200",
        invoiceAmount: 200.0,
        planSlug: "pro",
      });

      expect(result).not.toBeNull();
      expect(result?.commissionAmount).toBe(40.0); // 20% of 200
      expect(result?.status).toBe("ESCROW");
      expect(result?.escrowUntil.getTime()).toBeGreaterThan(Date.now() + 29 * 24 * 60 * 60 * 1000);
    });

    it("should skip commission if buyer was not referred by anyone", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "organic_buyer",
        referredById: null,
      } as any);

      const result = await processSubscriptionCommission({
        invoiceId: "inv_888",
        subscriptionId: "sub_888",
        buyerUserId: "organic_buyer",
        invoiceAmount: 100.0,
        planSlug: "pro",
      });

      expect(result).toBeNull();
      expect(prisma.affiliateCommissionLog.create).not.toHaveBeenCalled();
    });
  });

  describe("settleEscrowCommissions", () => {
    it("should transition mature escrow commissions to CLEARED", async () => {
      vi.mocked(prisma.affiliateCommissionLog.updateMany).mockResolvedValue({
        count: 5,
      });

      const settledCount = await settleEscrowCommissions();
      expect(settledCount).toBe(5);
      expect(prisma.affiliateCommissionLog.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: "ESCROW" }),
          data: expect.objectContaining({ status: "CLEARED" }),
        })
      );
    });
  });
});
