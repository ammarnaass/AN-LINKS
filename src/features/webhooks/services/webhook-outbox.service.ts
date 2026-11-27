import { prisma } from "@/shared/db";
import { EnqueueWebhookInput, WebhookDispatchResult } from "../types/webhooks.types";
import { createWebhookSignature, resolveWebhookSigningSecret } from "./webhook-signer.service";
import { assertSafeWebhookUrl } from "../validators/webhooks.validator";

const RETRY_DELAYS_MS = [
  60 * 1000, // Attempt 1: 1m
  5 * 60 * 1000, // Attempt 2: 5m
  15 * 60 * 1000, // Attempt 3: 15m
  60 * 60 * 1000, // Attempt 4: 60m
];

export function calculateNextRetryDelayMs(attempts: number): number | null {
  if (attempts >= RETRY_DELAYS_MS.length) {
    return null; // Max attempts exceeded
  }
  return RETRY_DELAYS_MS[attempts];
}

export async function enqueueWebhookEvent(input: EnqueueWebhookInput) {
  const endpoints = await prisma.creatorWebhookEndpoint.findMany({
    where: {
      creatorId: input.creatorId,
      isActive: true,
      events: { has: input.event },
    },
  });

  if (endpoints.length === 0) return [];

  const createdDeliveries = await Promise.all(
    endpoints.map((ep) =>
      prisma.webhookOutbox.create({
        data: {
          endpointId: ep.id,
          event: input.event,
          payload: input.payload as any,
          status: "PENDING",
        },
      })
    )
  );

  return createdDeliveries;
}

export async function processPendingOutboxBatch(batchSize = 25): Promise<WebhookDispatchResult> {
  const now = new Date();

  const pending = await prisma.webhookOutbox.findMany({
    where: {
      status: "PENDING",
      nextRetryAt: { lte: now },
    },
    include: { endpoint: true },
    take: batchSize,
  });

  let successCount = 0;
  let failedCount = 0;

  for (const item of pending) {
    const claim = await prisma.webhookOutbox.updateMany({
      where: { id: item.id, status: "PENDING" },
      data: { status: "PROCESSING" },
    });
    if (claim.count === 0) continue;

    const ssrfCheck = await assertSafeWebhookUrl(item.endpoint.url);
    if (!ssrfCheck.ok) {
      failedCount++;
      await prisma.webhookOutbox.update({
        where: { id: item.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: ssrfCheck.error || "BLOCKED_SSRF_TARGET",
        },
      });
      continue;
    }

    const payloadStr = JSON.stringify(item.payload);
    const signingSecret = resolveWebhookSigningSecret(item.endpoint.secretEncrypted);
    const signature = createWebhookSignature(payloadStr, signingSecret);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    try {
      const res = await fetch(item.endpoint.url, {
        method: "POST",
        redirect: "manual",
        headers: {
          "Content-Type": "application/json",
          "X-AnLinks-Signature": signature,
          "User-Agent": "ANLinks-Webhook/2026",
        },
        body: payloadStr,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        successCount++;
        await prisma.webhookOutbox.update({
          where: { id: item.id },
          data: {
            status: "DELIVERED",
            responseCode: res.status,
            lastError: null,
          },
        });
      } else {
        throw new Error(`HTTP_${res.status}`);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      failedCount++;
      const nextDelay = calculateNextRetryDelayMs(item.attempts);

      if (nextDelay !== null) {
        await prisma.webhookOutbox.update({
          where: { id: item.id },
          data: {
            status: "PENDING",
            attempts: { increment: 1 },
            nextRetryAt: new Date(now.getTime() + nextDelay),
            lastError: err?.message || "DISPATCH_FAILED",
          },
        });
      } else {
        await prisma.webhookOutbox.update({
          where: { id: item.id },
          data: {
            status: "FAILED",
            attempts: { increment: 1 },
            lastError: err?.message || "MAX_RETRIES_EXCEEDED",
          },
        });
      }
    }
  }

  return {
    dispatchedCount: pending.length,
    successCount,
    failedCount,
  };
}
