import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPayoutBalance, requestPayout } from "@/features/settings/server/payouts.service";
import { prisma } from "@/shared/db";

vi.mock("@/shared/db", () => ({
  prisma: {
    digitalOrder: {
      aggregate: vi.fn(),
    },
    appointmentBooking: {
      findMany: vi.fn(),
    },
    userSubscription: {
      findFirst: vi.fn(),
    },
    payoutRequest: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    creatorPayoutProfile: {
      findUnique: vi.fn(),
    },
    affiliateCommissionLog: {
      aggregate: vi.fn(),
    },
  },
}));

describe("Creator Real Payout Ledger Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.affiliateCommissionLog.aggregate).mockResolvedValue({
      _sum: { commissionAmount: 0 },
    } as any);
  });

  it("should calculate real net earnings from digital orders and appointment bookings", async () => {
    // Mock digital orders total: 1000 SAR
    vi.mocked(prisma.digitalOrder.aggregate).mockResolvedValue({
      _sum: { amount: 1000.0 },
    } as any);

    // Mock appointment bookings: 2 bookings at 250 SAR each = 500 SAR
    vi.mocked(prisma.appointmentBooking.findMany).mockResolvedValue([
      { service: { price: 250.0 } },
      { service: { price: 250.0 } },
    ] as any);

    // Mock active subscription with 5% commission rate
    vi.mocked(prisma.userSubscription.findFirst).mockResolvedValue({
      plan: {
        quotas: {
          storeCommissionRate: 5.0,
        },
      },
    } as any);

    // Mock payout requests: 200 transferred, 100 pending
    vi.mocked(prisma.payoutRequest.findMany).mockResolvedValue([
      { amount: 200.0, status: "TRANSFERRED" },
      { amount: 100.0, status: "PENDING" },
    ] as any);

    // Mock cleared affiliate commissions: 200 SAR
    vi.mocked(prisma.affiliateCommissionLog.aggregate).mockResolvedValue({
      _sum: { commissionAmount: 200.0 },
    } as any);

    const balance = await getPayoutBalance("user_creator_1");

    // Gross store: 1000 + 500 = 1500 SAR
    // Commission 5%: 75 SAR -> Net store: 1425 SAR
    // Cleared affiliate earnings: 200 SAR -> Total: 1425 + 200 = 1625 SAR
    // Withdrawn: 200, Pending: 100 -> Available: 1625 - 300 = 1325 SAR
    expect(balance.grossSales).toBe(1500.0);
    expect(balance.storeNetEarnings).toBe(1425.0);
    expect(balance.affiliateEarnings).toBe(200.0);
    expect(balance.totalEarnings).toBe(1625.0);
    expect(balance.totalWithdrawn).toBe(200.0);
    expect(balance.pendingWithdrawal).toBe(100.0);
    expect(balance.availableBalance).toBe(1325.0);
    expect(balance.currency).toBe("SAR");
  });

  it("should reject payout requests exceeding available balance", async () => {
    // Mock gross: 100 SAR, Net: 95 SAR, Withdrawn: 0 -> Available: 95 SAR
    vi.mocked(prisma.digitalOrder.aggregate).mockResolvedValue({
      _sum: { amount: 100.0 },
    } as any);
    vi.mocked(prisma.appointmentBooking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.userSubscription.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.payoutRequest.findMany).mockResolvedValue([]);

    vi.mocked(prisma.creatorPayoutProfile.findUnique).mockResolvedValue({
      isVerified: true,
      iban: "SA1234567890",
    } as any);

    // Trying to withdraw 200 when available is 95
    await expect(requestPayout("user_creator_1", 200)).rejects.toThrow(
      "الرصيد المتاح غير كافٍ لإتمام عملية السحب"
    );
  });
});
