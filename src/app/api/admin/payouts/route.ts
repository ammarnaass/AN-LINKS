import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { requireAdminSession } from "@/features/admin/server/admin.guard";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const requests = await prisma.payoutRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          payoutProfile: { select: { bankName: true, iban: true, beneficiaryName: true } },
        },
      },
    },
    orderBy: { requestedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, requests });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json().catch(() => ({}));
    const { payoutId, action, transferReference, rejectionReason } = body;

    if (!payoutId || !["APPROVE", "TRANSFERRED", "REJECT"].includes(action)) {
      return NextResponse.json({ success: false, error: "بيانات طلب السحب غير صالحة" }, { status: 400 });
    }

    const existing = await prisma.payoutRequest.findUnique({ where: { id: payoutId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }
    if (existing.status === "TRANSFERRED" || existing.status === "REJECTED") {
      return NextResponse.json({ success: false, error: "تم إغلاق هذا الطلب مسبقاً" }, { status: 409 });
    }

    const nextStatus =
      action === "APPROVE" ? "APPROVED" : action === "TRANSFERRED" ? "TRANSFERRED" : "REJECTED";

    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: nextStatus,
          processedAt: nextStatus !== "APPROVED" ? new Date() : existing.processedAt,
          transferReference: transferReference?.trim() || existing.transferReference,
          rejectionReason: nextStatus === "REJECTED" ? rejectionReason?.trim() || "مرفوض إدارياً" : null,
        },
      });

      if (nextStatus === "TRANSFERRED") {
        await tx.affiliateCommissionLog.updateMany({
          where: { referrerId: existing.userId, status: "CLEARED" },
          data: { status: "PAID", paidAt: new Date() },
        });
      }

      await tx.financialAuditLog.create({
        data: {
          adminId: guard.user.id,
          action: `PAYOUT_${nextStatus}`,
          entity: "PayoutRequest",
          entityId: payoutId,
          details: { amount: existing.amount, transferReference: row.transferReference },
        },
      });

      return row;
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تحديث طلب الصرف";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
