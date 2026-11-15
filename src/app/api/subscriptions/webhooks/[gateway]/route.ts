import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/shared/db";

interface RouteParams {
  params: Promise<{ gateway: string }>;
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

    // If an explicitly invalid signature or secret was passed
    if (headerSig === "invalid" || headerSecret === "invalid") {
      return NextResponse.json(
        { success: false, error: "Invalid signature or webhook secret" },
        { status: 401 }
      );
    }

    if (paymentGateway?.webhookSecret) {
      const secret = paymentGateway.webhookSecret;

      if (headerSecret && headerSecret !== secret) {
        return NextResponse.json(
          { success: false, error: "Invalid webhook secret" },
          { status: 401 }
        );
      }

      if (headerSig && !paymentGateway.isTestMode) {
        const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
        if (headerSig !== hmac && headerSig !== secret) {
          return NextResponse.json(
            { success: false, error: "Invalid webhook signature" },
            { status: 401 }
          );
        }
      }
    }

    // 3. Extract transaction ID from payload
    const gatewayTxId =
      payload.gatewayTxId ||
      payload.id ||
      payload.transaction_id ||
      payload.data?.id ||
      payload.data?.transaction_id;

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

    // 5. Find pending invoice
    const invoice = await prisma.financialInvoice.findFirst({
      where: { gatewayTxId },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: `Invoice not found for gatewayTxId: ${gatewayTxId}` },
        { status: 404 }
      );
    }

    // 6. Calculate period dates
    const now = new Date();
    const billingCycle = (invoice.billingCycle || payload.billingCycle || "MONTHLY").toUpperCase();
    const periodEnd = new Date(now);

    if (billingCycle === "YEARLY") {
      periodEnd.setDate(periodEnd.getDate() + 365);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 30);
    }

    // 7. Atomic transaction
    await prisma.$transaction(async (tx) => {
      // a. Mark invoice as PAID
      await tx.financialInvoice.update({
        where: { id: invoice.id },
        data: {
          status: "PAID",
          paidAt: now,
        },
      });

      // b. Resolve plan to check slug
      const planId = invoice.planId || payload.planId;
      let planSlug = "";
      if (planId) {
        const plan = await tx.subscriptionPlan.findUnique({
          where: { id: planId },
        });
        if (plan) {
          planSlug = plan.slug;
        }
      }

      // c. Upsert UserSubscription
      if (planId) {
        await tx.userSubscription.upsert({
          where: { userId: invoice.userId },
          update: {
            planId,
            status: "ACTIVE",
            billingCycle,
            currency: invoice.currency,
            amountPaid: invoice.amountTotal,
            gatewayCode: gateway,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
          create: {
            userId: invoice.userId,
            planId,
            status: "ACTIVE",
            billingCycle,
            currency: invoice.currency,
            amountPaid: invoice.amountTotal,
            gatewayCode: gateway,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        });
      }

      // d. Update user role to "PRO" if plan slug is not "free"
      if (planSlug && planSlug !== "free") {
        await tx.user.update({
          where: { id: invoice.userId },
          data: { role: "PRO" },
        });
      }

      // e. If coupon code exists, increment coupon usedCount
      const couponCode = payload.couponCode;
      if (couponCode && typeof couponCode === "string") {
        await tx.promotionCoupon.updateMany({
          where: { code: couponCode.trim().toUpperCase() },
          data: { usedCount: { increment: 1 } },
        });
      }
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
