import { sendTransactionalEmail } from "@/lib/mailer";
import { processPendingOutboxBatch } from "@/features/webhooks/services/webhook-outbox.service";
import { WebhookEventType } from "@/features/webhooks/types/webhooks.types";
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
} from "../services/calendar-export.service";

export function escapeHtml(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Persists WebhookOutbox rows inside the caller's Prisma transaction for durability.
 */
export async function enqueueBookingWebhookTx(
  tx: any,
  creatorId: string,
  event: WebhookEventType,
  payload: Record<string, unknown>
) {
  if (!tx?.creatorWebhookEndpoint?.findMany || !tx?.webhookOutbox?.create) {
    return;
  }

  const endpoints = await tx.creatorWebhookEndpoint.findMany({
    where: {
      creatorId,
      isActive: true,
      events: { has: event },
    },
    select: { id: true },
  });

  if (!endpoints || endpoints.length === 0) return;

  await Promise.all(
    endpoints.map((ep: { id: string }) =>
      tx.webhookOutbox.create({
        data: {
          endpointId: ep.id,
          event,
          payload: payload as any,
          status: "PENDING",
        },
      })
    )
  );
}

export interface BookingEmailDispatchParams {
  kind: "confirmed" | "rescheduled" | "cancelled";
  bookingId: string;
  manageToken?: string | null;
  clientName: string;
  clientEmail: string;
  creatorEmail?: string | null;
  creatorName: string;
  serviceTitle: string;
  meetingType?: string;
  meetingUrl?: string | null;
  meetingLocation?: string | null;
  startTime: Date;
  endTime: Date;
  creatorTimezone: string;
  cancelReason?: string | null;
}

export async function dispatchBookingSideEffects(params: BookingEmailDispatchParams) {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://anlinks.dev").replace(/\/$/, "");
  const manageUrl = params.manageToken
    ? `${baseUrl}/bookings/${encodeURIComponent(params.bookingId)}?token=${encodeURIComponent(params.manageToken)}`
    : null;

  const formattedDate = params.startTime.toLocaleString("ar-SA", {
    timeZone: params.creatorTimezone,
    dateStyle: "full",
    timeStyle: "short",
  });

  const calEvent = {
    bookingId: params.bookingId,
    title: `${params.serviceTitle} | AN LINKS`,
    startTime: params.startTime,
    endTime: params.endTime,
    meetingUrl: params.meetingUrl,
    meetingType: params.meetingType,
    location: params.meetingLocation,
    creatorName: params.creatorName,
    clientName: params.clientName,
  };

  const titles = {
    confirmed: `تأكيد حجزك: ${params.serviceTitle}`,
    rescheduled: `تحديث موعد الجلسة: ${params.serviceTitle}`,
    cancelled: `إلغاء حجز: ${params.serviceTitle}`,
  };

  const clientHtml = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 540px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
      <h2 style="color: #4edea3; margin-top: 0;">${escapeHtml(titles[params.kind])}</h2>
      <p>أهلاً <strong>${escapeHtml(params.clientName)}</strong>،</p>
      <p>الموعد مع <strong>${escapeHtml(params.creatorName)}</strong> بتاريخ: <strong>${escapeHtml(formattedDate)}</strong></p>
      ${params.cancelReason ? `<p style="color:#fda4af;">سبب الإلغاء: ${escapeHtml(params.cancelReason)}</p>` : ""}
      ${params.kind !== "cancelled" && params.meetingUrl ? `<p><a href="${escapeHtml(params.meetingUrl)}" style="background:#4edea3;color:#052e16;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">الدخول إلى الاجتماع</a></p>` : ""}
      ${params.kind !== "cancelled" ? `<p style="font-size:12px;"><a href="${escapeHtml(generateGoogleCalendarUrl(calEvent))}" style="color:#93c5fd;">Google Calendar</a> • <a href="${escapeHtml(generateOutlookCalendarUrl(calEvent))}" style="color:#93c5fd;">Outlook</a></p>` : ""}
      ${manageUrl ? `<p style="margin-top:20px;font-size:12px;color:#94a3b8;">لإدارة الموعد أو تغييره: <a href="${escapeHtml(manageUrl)}" style="color:#4edea3;">بوابة إدارة الحجز</a></p>` : ""}
    </div>
  `;

  const creatorHtml = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 540px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
      <h2 style="color: #4edea3; margin-top: 0;">إشعار حجز جديد (${params.kind}) | AN LINKS</h2>
      <p>الخدمة: <strong>${escapeHtml(params.serviceTitle)}</strong></p>
      <p>العميل: ${escapeHtml(params.clientName)} (${escapeHtml(params.clientEmail)})</p>
      <p>الموعد: <strong>${escapeHtml(formattedDate)}</strong></p>
    </div>
  `;

  const tasks: Promise<unknown>[] = [
    processPendingOutboxBatch(5),
    sendTransactionalEmail({
      to: params.clientEmail,
      subject: `${titles[params.kind]} | AN LINKS`,
      html: clientHtml,
    }),
  ];

  if (params.creatorEmail) {
    tasks.push(
      sendTransactionalEmail({
        to: params.creatorEmail,
        subject: `${titles[params.kind]} - ${params.clientName}`,
        html: creatorHtml,
      })
    );
  }

  await Promise.allSettled(tasks);
}
