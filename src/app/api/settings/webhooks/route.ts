import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import {
  validateWebhookEndpointInput,
} from "@/features/webhooks/validators/webhooks.validator";
import { createWebhookSignature } from "@/features/webhooks/services/webhook-signer.service";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const endpoint = await prisma.creatorWebhookEndpoint.findFirst({
      where: { creatorId: session.user.id },
      include: {
        deliveries: {
          orderBy: { nextRetryAt: "desc" },
          take: 5,
        },
      },
    });

    let stats = {
      totalDispatched: 0,
      deliveredCount: 0,
      failedCount: 0,
      successRate: 100,
    };

    if (endpoint) {
      const [totalDispatched, deliveredCount, failedCount] = await Promise.all([
        prisma.webhookOutbox.count({ where: { endpointId: endpoint.id } }),
        prisma.webhookOutbox.count({ where: { endpointId: endpoint.id, status: "DELIVERED" } }),
        prisma.webhookOutbox.count({ where: { endpointId: endpoint.id, status: "FAILED" } }),
      ]);
      stats = {
        totalDispatched,
        deliveredCount,
        failedCount,
        successRate: totalDispatched > 0 ? Math.round((deliveredCount / totalDispatched) * 100) : 100,
      };
    }

    return NextResponse.json({
      success: true,
      data: endpoint,
      stats,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل جلب بيانات خطافات الويب";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, url, events } = body;

    if (action === "delete") {
      await prisma.creatorWebhookEndpoint.deleteMany({
        where: { creatorId: session.user.id },
      });
      return NextResponse.json({ success: true, message: "تم حذف رابط الويب بنجاح" });
    }

    if (action === "ping") {
      const endpoint = await prisma.creatorWebhookEndpoint.findFirst({
        where: { creatorId: session.user.id },
      });
      if (!endpoint || !endpoint.url) {
        return NextResponse.json(
          { success: false, error: "لم يتم تكوين رابط خطاف الويب بعد" },
          { status: 400 }
        );
      }

      const pingPayload = JSON.stringify({
        event: "test.ping",
        timestamp: new Date().toISOString(),
        message: "تجربة ربط خطاف الويب مع منصة AN LINKS بنجاح!",
      });

      const signature = createWebhookSignature(pingPayload, endpoint.secretEncrypted);

      const startTime = Date.now();
      let responseCode = 0;
      let status = "FAILED";

      try {
        const pingRes = await fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-AnLinks-Signature": signature,
            "User-Agent": "AnLinks-Webhook-Delivery/2026",
          },
          body: pingPayload,
        });
        responseCode = pingRes.status;
        status = pingRes.ok ? "DELIVERED" : "FAILED";
      } catch (err: unknown) {
        responseCode = 500;
        status = "FAILED";
      }

      const durationMs = Date.now() - startTime;

      // Record test delivery in outbox log
      await prisma.webhookOutbox.create({
        data: {
          endpointId: endpoint.id,
          event: "test.ping",
          payload: JSON.parse(pingPayload),
          status,
          responseCode,
          attempts: 1,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          statusCode: responseCode,
          durationMs,
          status,
        },
        message:
          status === "DELIVERED"
            ? `تم إرسال التجربة بنجاح (كود ${responseCode} خلال ${durationMs}ms)`
            : `فشلت استجابة الرابط الخارجي (كود ${responseCode})`,
      });
    }

    // Default action: save / update
    const validation = validateWebhookEndpointInput({ url, events });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const existing = await prisma.creatorWebhookEndpoint.findFirst({
      where: { creatorId: session.user.id },
    });

    const secret =
      existing?.secretEncrypted ||
      `whsec_${crypto.randomBytes(24).toString("hex")}`;

    const saved = await prisma.creatorWebhookEndpoint.upsert({
      where: { id: existing?.id || "new" },
      create: {
        creatorId: session.user.id,
        url: url.trim(),
        secretEncrypted: secret,
        events,
        isActive: true,
      },
      update: {
        url: url.trim(),
        events,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: saved,
      message: "تم حفظ وتفعيل خطاف الويب بنجاح",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل حفظ خطاف الويب";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
