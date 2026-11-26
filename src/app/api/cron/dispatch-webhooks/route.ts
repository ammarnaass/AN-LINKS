import { NextRequest, NextResponse } from "next/server";
import { processPendingOutboxBatch } from "@/features/webhooks";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "internal_cron_secret";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const result = await processPendingOutboxBatch(50);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "OUTBOX_WORKER_ERROR" },
      { status: 500 }
    );
  }
}

