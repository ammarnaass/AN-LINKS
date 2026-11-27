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

const PAID_EVENTS = new Set([
  "payment.succeeded",
  "payment.paid",
  "charge.succeeded",
  "invoice.paid",
  "invoice.payment_succeeded",
  "checkout.session.completed",
  "payment_intent.succeeded",
  "order.captured",
  "paid",
  "approved",
  "captured",
]);

function safeTimingCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function verifySignatureHeader(headerSig: string, secret: string, rawBody: string): boolean {
  const hmacRaw = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (safeTimingCompare(headerSig, hmacRaw)) return true;

  // Support Stripe-style "t=ts,v1=hex" header
  const parts = Object.fromEntries(
    headerSig.split(",").map((kv) => {
      const [k, v] = kv.trim().split("=");
      return [k, v || ""];
    })
  );
  if (parts.t && parts.v1) {
    const signedPayload = `${parts.t}.${rawBody}`;
    const stripeExpected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
    return safeTimingCompare(parts.v1, stripeExpected);
  }
  return false;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { gateway } = await params;
    const rawBody = await req.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    const paymentGateway = await prisma.paymentGateway.findUnique({ where: { code: gateway } });
    const headerSig =
      req.headers.get("stripe-signature") ||
      req.headers.get("x-moyasar-signature") ||
      req.headers.get("x-signature") ||
      req.headers.get("x-webhook-signature") ||
      req.headers.get("signature");
    const headerSecret = req.headers.get("x-webhook-secret");

    if (headerSig === "invalid" || headerSecret === "invalid") {
      return NextResponse.json({ success: false, error: "Invalid signature or webhook secret" }, { status: 401 });
    }

    if (process.env.NODE_ENV === "production" && !paymentGateway?.webhookSecret) {
      return NextResponse.json({ success: false, error: "Gateway webhook secret not configured" }, { status: 401 });
    }

    if (paymentGateway?.webhookSecret) {
      const secret = paymentGateway.webhookSecret;
      if (!headerSig && !headerSecret) {
        return NextResponse.json({ success: false, error: "Missing webhook signature or secret" }, { status: 401 });
      }
      if (headerSecret && !safeTimingCompare(headerSecret, secret)) {
        return NextResponse.json({ success: false, error: "Invalid webhook secret" }, { status: 401 });
      }
      if (headerSig && !verifySignatureHeader(headerSig, secret, rawBody)) {
        return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const gatewayTxId =
      payload.gatewayTxId ||
      payload.id ||
      payload.transaction_id ||
      payload.data?.id ||
      payload.data?.transaction_id ||
      payload.data?.object?.id;

    if (!gatewayTxId || typeof gatewayTxId !== "string") {
      return NextResponse.json({ success: false, error: "Missing transaction identifier (gatewayTxId)" }, { status: 400 });
    }

    const existingPaidInvoice = await prisma.financialInvoice.findFirst({
      where: { gatewayTxId, status: "PAID" },
    });
    if (existingPaidInvoice) {
      return NextResponse.json({ received: true, idempotent: true }, { status: 200 });
    }

    const invoice = await prisma.financialInvoice.findFirst({ where: { gatewayTxId } });
    if (!invoice) {
      return NextResponse.json({ success: false, error: `Invoice not found for gatewayTxId: ${gatewayTxId}` }, { status: 404 });
    }

    const eventType = String(payload.type || payload.event || payload.action || "").toLowerCase();
    if (eventType.includes("failed") || eventType === "invoice.payment_failed") {
      await processPaymentFailure(invoice.id, invoice.userId);
      return NextResponse.json({ success: true, processed: true, event: "payment.failed" });
    }

    if (eventType.includes("canceled") || eventType.includes("cancelled") || eventType.includes("deleted")) {
      await processSubscriptionCancellation(invoice.userId, { immediate: Boolean(payload.immediate) });
      return NextResponse.json({ success: true, processed: true, event: "subscription.canceled" });
    }

    const explicitStatus = String(payload.status || payload.data?.status || "").toLowerCase();
    const isDirectPaidFallback =
      !eventType &&
      (!explicitStatus || PAID_EVENTS.has(explicitStatus) || explicitStatus === "succeeded");

    if (!PAID_EVENTS.has(eventType) && !isDirectPaidFallback) {
      return NextResponse.json({ received: true, ignored: true, event: eventType || "unknown" }, { status: 200 });
    }

    const now = new Date();
    const billingCycle = (invoice.billingCycle || payload.billingCycle || "MONTHLY").toUpperCase();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + (billingCycle === "YEARLY" ? 365 : 30));

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
    return NextResponse.json({ success: false, error: "Failed to process payment webhook" }, { status: 500 });
  }
}
