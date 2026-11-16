import { prisma } from "@/shared/db";
import { Prisma } from "@prisma/client";
import type {
  AdminTransactionsQuery,
  AdminTransactionsResult,
  AdminTransactionItem,
  InvoiceRefundResult,
} from "../../types/admin.types";
import { logFinancialAudit } from "./audit.service";

export async function getAdminTransactions(
  query: AdminTransactionsQuery = {}
): Promise<AdminTransactionsResult> {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.max(1, Math.min(100, query.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.FinancialInvoiceWhereInput = {};
  if (query.status && query.status !== "all") where.status = query.status;
  if (query.gateway && query.gateway !== "all") where.gatewayCode = query.gateway;

  const [invoices, total] = await Promise.all([
    prisma.financialInvoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: { select: { displayName: true } },
          },
        },
      },
    }),
    prisma.financialInvoice.count({ where }),
  ]);

  const items: AdminTransactionItem[] = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    userId: inv.userId,
    customerName: inv.user?.profile?.displayName || inv.user?.username || "Unknown",
    customerEmail: inv.user?.email || "",
    amountSubtotal: inv.amountSubtotal,
    discountAmount: inv.discountAmount,
    taxAmount: inv.taxAmount,
    amountTotal: inv.amountTotal,
    currency: inv.currency,
    gatewayCode: inv.gatewayCode,
    gatewayTxId: inv.gatewayTxId,
    status: inv.status,
    pdfUrl: inv.pdfUrl,
    createdAt: inv.createdAt.toISOString(),
  }));

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function refundAdminInvoice(
  invoiceId: string,
  reason: string,
  adminId: string
): Promise<InvoiceRefundResult> {
  const invoice = await prisma.financialInvoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new Error(`الفاتورة غير موجودة: ${invoiceId}`);
  }

  if (invoice.status === "REFUNDED") {
    throw new Error("تم استرجاع هذه الفاتورة مسبقاً");
  }

  const updated = await prisma.financialInvoice.update({
    where: { id: invoiceId },
    data: { status: "REFUNDED" },
  });

  await logFinancialAudit(adminId, "REFUND_INVOICE", "FinancialInvoice", invoiceId, {
    reason,
    amount: invoice.amountTotal,
    invoiceNumber: invoice.invoiceNumber,
  });

  return {
    success: true,
    invoiceId: updated.id,
    status: updated.status,
    refundedAmount: updated.amountTotal,
    message: "تم استرجاع الفاتورة بنجاح",
  };
}
