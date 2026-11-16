import { prisma } from "@/shared/db";
import type { AdminCouponItem, CreateCouponInput } from "../../types/admin.types";
import { logFinancialAudit } from "./audit.service";

function formatCoupon(c: {
  id: string;
  code: string;
  descriptionAr: string | null;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  maxUsesPerUser: number;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
  applicablePlanSlugs: string[];
  createdAt: Date;
}): AdminCouponItem {
  return {
    id: c.id,
    code: c.code,
    descriptionAr: c.descriptionAr,
    discountType: c.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: c.discountValue,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    maxUsesPerUser: c.maxUsesPerUser,
    validFrom: c.validFrom.toISOString(),
    validUntil: c.validUntil ? c.validUntil.toISOString() : null,
    isActive: c.isActive,
    applicablePlanSlugs: c.applicablePlanSlugs,
    createdAt: c.createdAt.toISOString(),
  };
}

export async function getAdminCoupons(): Promise<AdminCouponItem[]> {
  const coupons = await prisma.promotionCoupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return coupons.map(formatCoupon);
}

export async function createAdminCoupon(
  input: CreateCouponInput,
  adminId: string
): Promise<AdminCouponItem> {
  const code = input.code.trim().toUpperCase();
  if (!code) {
    throw new Error("رمز الكوبون مطلوب");
  }

  const existing = await prisma.promotionCoupon.findUnique({ where: { code } });
  if (existing) {
    throw new Error("رمز الكوبون مستخدم مسبقاً");
  }

  const coupon = await prisma.promotionCoupon.create({
    data: {
      code,
      descriptionAr: input.descriptionAr,
      discountType: input.discountType,
      discountValue: input.discountValue,
      maxUses: input.maxUses ?? null,
      maxUsesPerUser: input.maxUsesPerUser ?? 1,
      validFrom: input.validFrom ? new Date(input.validFrom) : new Date(),
      validUntil: input.validUntil ? new Date(input.validUntil) : null,
      isActive: true,
      applicablePlanSlugs: input.applicablePlanSlugs ?? [],
    },
  });

  await logFinancialAudit(adminId, "CREATE_COUPON", "PromotionCoupon", coupon.id, {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });

  return formatCoupon(coupon);
}

export async function toggleAdminCoupon(
  id: string,
  isActive: boolean,
  adminId: string
): Promise<AdminCouponItem> {
  const coupon = await prisma.promotionCoupon.update({
    where: { id },
    data: { isActive },
  });

  await logFinancialAudit(adminId, "TOGGLE_COUPON", "PromotionCoupon", id, { isActive });
  return formatCoupon(coupon);
}

export async function deleteAdminCoupon(
  id: string,
  adminId: string
): Promise<{ success: boolean; id: string }> {
  const coupon = await prisma.promotionCoupon.delete({
    where: { id },
  });

  await logFinancialAudit(adminId, "DELETE_COUPON", "PromotionCoupon", id, {
    code: coupon.code,
  });

  return { success: true, id };
}
