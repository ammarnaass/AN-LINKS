import { prisma } from "@/shared/db";
import { Prisma } from "@prisma/client";
import { encryptSecret } from "@/shared/lib/crypto";
import type { AdminGatewayDetails, UpdateGatewayInput } from "../../types/admin.types";
import { logFinancialAudit } from "./audit.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatGateway(gw: any): AdminGatewayDetails {
  return {
    id: gw.id,
    code: gw.code,
    nameAr: gw.nameAr,
    nameEn: gw.nameEn,
    category: gw.category as "NATIONAL" | "INTERNATIONAL" | "BNPL" | "WALLET",
    isEnabled: gw.isEnabled,
    isTestMode: gw.isTestMode,
    publishableKey: gw.publishableKey,
    hasSecretKey: !!gw.secretKeyEncrypted,
    hasWebhookSecret: !!gw.webhookSecret,
    feePercentage: gw.feePercentage,
    feeFixed: gw.feeFixed,
    supportedCurrencies: gw.supportedCurrencies,
    sortOrder: gw.sortOrder,
    updatedAt: gw.updatedAt.toISOString(),
  };
}

function buildGatewayUpdateData(input: UpdateGatewayInput): Prisma.PaymentGatewayUpdateInput {
  const data: Prisma.PaymentGatewayUpdateInput = {};
  if (input.isEnabled !== undefined) data.isEnabled = input.isEnabled;
  if (input.isTestMode !== undefined) data.isTestMode = input.isTestMode;
  if (input.publishableKey !== undefined) data.publishableKey = input.publishableKey;
  if (input.feePercentage !== undefined) data.feePercentage = input.feePercentage;
  if (input.feeFixed !== undefined) data.feeFixed = input.feeFixed;
  if (input.supportedCurrencies !== undefined) data.supportedCurrencies = input.supportedCurrencies;

  if (input.secretKey !== undefined) {
    const raw = input.secretKey.trim();
    if (raw && !raw.includes("••")) data.secretKeyEncrypted = encryptSecret(raw);
    else if (raw === "") data.secretKeyEncrypted = null;
  }

  if (input.webhookSecret !== undefined) {
    const raw = input.webhookSecret.trim();
    if (raw && !raw.includes("••")) data.webhookSecret = raw;
    else if (raw === "") data.webhookSecret = null;
  }
  return data;
}

export async function getAdminGateways(): Promise<AdminGatewayDetails[]> {
  const gateways = await prisma.paymentGateway.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return gateways.map(formatGateway);
}

export async function updateAdminGateway(
  id: string,
  input: UpdateGatewayInput,
  adminId: string
): Promise<AdminGatewayDetails> {
  const existing = await prisma.paymentGateway.findUnique({ where: { id } });
  if (!existing) throw new Error(`بوابة الدفع غير موجودة: ${id}`);

  const updated = await prisma.paymentGateway.update({
    where: { id },
    data: buildGatewayUpdateData(input),
  });

  await logFinancialAudit(adminId, "UPDATE_GATEWAY", "PaymentGateway", id, {
    changed: Object.keys(input),
    gatewayCode: existing.code,
  });

  return formatGateway(updated);
}
