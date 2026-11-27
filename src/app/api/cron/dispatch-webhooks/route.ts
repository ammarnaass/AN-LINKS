import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { processPendingOutboxBatch } from "@/features/webhooks";
import { settleEscrowCommissions } from "@/features/affiliate/server/affiliate.service";

function isAuthorizedCronRequest(authHeader: string | null): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || !authHeader) return false;
  const expected = `Bearer ${cronSecret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function handleCronDispatch(req: NextRequest) {
  try {
    if (!process.env.CRON_SECRET?.trim()) {
      return NextResponse.json({ error: "CRON_NOT_CONFIGURED" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (!isAuthorizedCronRequest(authHeader)) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const [outboxResult, settledCommissions] = await Promise.all([
      processPendingOutboxBatch(50),
      settleEscrowCommissions(),
    ]);

    return NextResponse.json({
      success: true,
      ...outboxResult,
      settledCommissions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "OUTBOX_WORKER_ERROR";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleCronDispatch(req);
}

export async function POST(req: NextRequest) {
  return handleCronDispatch(req);
}

