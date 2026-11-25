import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/shared/db";
import {
  processPaymentSuccess,
  processPaymentFailure,
  processSubscriptionCancellation,
} from "@/features/subscriptions";

interface RouteParams {
  params: Promise<{ gateway: string }>;
}

function safeTimingCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { gateway } = await params;

    // 1. Read raw body and parse JSON
    const rawBody = await req.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    // 2. Signature & Webhook Secret Verification
    const paymentGateway = await prisma.paymentGateway.findUnique({
      where: { code: gateway },
    });

    const headerSig =
      req.headers.get("x-signature") ||
      req.headers.get("x-webhook-signature") ||
      req.headers.get("signature") ||
      req.headers.get("stripe-signature") ||
      req.headers.get("x-moyasar-signature");

    const headerSecret = req.headers.get("x-webhook-secret");

    if (headerSig === "invalid" || headerSecret === "invalid") {
      return NextResponse.json(
        { success: false, error: "Invalid signature or webhook secret" },
        { status: 401 }
      );
    }

    if (paymentGateway?.webhookSecret) {
      const secret = paymentGateway.webhookSecret;

      if (!paymentGateway.isTestMode && !headerSig && !headerSecret) {
        return NextResponse.json(
          { success: false, error: "Missing webhook signature or secret" },
          { status: 401 }
        );
      }

      if (headerSecret && !safeTimingCompare(headerSecret, secret)) {
        return NextResponse.json(
          { success: false, error: "Invalid webhook secret" },
          { status: 401 }
        );
      }

      if (headerSig && !paymentGateway.isTestMode) {
        const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
        if (!safeTimingCompare(headerSig, hmac) && !safeTimingCompare(headerSig, secret)) {
          return NextResponse.json(
            { success: false, error: "Invalid webhook signature" },
            { status: 401 }
          );
        }
      }
    }

    // 3. Extract transaction identifier
    const gatewayTxId =
      payload.gatewayTxId ||
      payload.id ||
      payload.transaction_id ||
      payload.data?.id ||
      payload.data?.transaction_id ||
      payload.data?.object?.id;

    if (!gatewayTxId || typeof gatewayTxId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing transaction identifier (gatewayTxId)" },
        { status: 400 }
      );
    }

    // 4. Idempotency Check: if invoice was already marked PAID, return success immediately
    const existingPaidInvoice = await prisma.financialInvoice.findFirst({
      where: { gatewayTxId, status: "PAID" },
    });

    if (existingPaidInvoice) {
      return NextResponse.json({ received: true, idempotent: true }, { status: 200 });
    }

    // 5. Find invoice
    const invoice = await prisma.financialInvoice.findFirst({
      where: { gatewayTxId },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: `Invoice not found for gatewayTxId: ${gatewayTxId}` },
        { status: 404 }
      );
    }

    // 6. Determine event type
    const eventType = (payload.type || payload.event || payload.action || "").toLowerCase();

    // 7. Handle Failure Events
    const isFailure =
      eventType.includes("failed") ||
      eventType === "payment.failed" ||
      eventType === "charge.failed" ||
      eventType === "invoice.payment_failed";

    if (isFailure) {
      await processPaymentFailure(invoice.id, invoice.userId);
      return NextResponse.json({ success: true, processed: true, event: "payment.failed" });
    }

    // 8. Handle Cancellation Events
    const isCancellation =
      eventType.includes("canceled") ||
      eventType.includes("cancelled") ||
      eventType.includes("deleted") ||
      eventType === "customer.subscription.deleted";

    if (isCancellation) {
      await processSubscriptionCancellation(invoice.userId, { immediate: Boolean(payload.immediate) });
      return NextResponse.json({ success: true, processed: true, event: "subscription.canceled" });
    }

    // 9. Calculate period dates
    const now = new Date();
    const billingCycle = (invoice.billingCycle || payload.billingCycle || "MONTHLY").toUpperCase();
    const periodEnd = new Date(now);

    if (billingCycle === "YEARLY") {
      periodEnd.setDate(periodEnd.getDate() + 365);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 30);
    }

    // 10. Process payment success
    await processPaymentSuccess({
      invoiceId: invoice.id,
      userId: invoice.userId,
      planId: invoice.planId || payload.planId,
      billingCycle,
      currency: invoice.currency,
      amountTotal: invoice.amountTotal,
      gatewayCode: gateway,
      now,
      periodEnd,
      couponCode: payload.couponCode,
    });

    return NextResponse.json({ success: true, processed: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment webhook" },
      { status: 500 }
    );
  }
}
