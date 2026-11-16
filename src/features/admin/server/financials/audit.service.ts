import { prisma } from "@/shared/db";
import { Prisma } from "@prisma/client";

/**
 * Financial Audit Logger
 * Writes administrative actions affecting financial entities to FinancialAuditLog.
 */
export async function logFinancialAudit(
  adminId: string,
  action: string,
  targetType: string,
  targetId?: string | null,
  details?: Record<string, unknown> | Prisma.InputJsonValue | unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  txClient: Prisma.TransactionClient | typeof prisma | any = prisma
) {
  try {
    return await txClient.financialAuditLog.create({
      data: {
        adminId,
        action,
        entity: targetType,
        entityId: targetId ?? null,
        details: (details ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("Failed to write FinancialAuditLog:", error);
    throw error;
  }
}
