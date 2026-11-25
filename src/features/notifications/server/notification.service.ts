import { prisma } from "@/shared/db";
import {
  ActiveNotificationDto,
  NotificationPayload,
  NotificationTarget,
  SystemNotificationItem,
} from "../types/notification.types";

interface TargetAudienceFilter {
  role?: string;
  isAuthenticated?: boolean;
}

export async function getActiveNotificationsForUser(
  userContext: TargetAudienceFilter
): Promise<ActiveNotificationDto[]> {
  const now = new Date();
  const allowedTargets: NotificationTarget[] = ["ALL"];

  if (userContext.isAuthenticated) {
    allowedTargets.push("CREATORS_ONLY");
    if (userContext.role === "ADMIN") {
      allowedTargets.push("ADMINS_ONLY");
    }
  } else {
    allowedTargets.push("VISITORS_ONLY");
  }

  const items = await prisma.systemNotification.findMany({
    where: {
      isActive: true,
      target: { in: allowedTargets },
      startsAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 5,
  });

  // Track impressions asynchronously
  if (items.length > 0) {
    const ids = items.map((i) => i.id);
    prisma.systemNotification
      .updateMany({
        where: { id: { in: ids } },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => console.error("Error incrementing view counts:", err));
  }

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    type: item.type,
    color: item.color,
    bgColor: item.bgColor,
    icon: item.icon,
    position: item.position,
    actionLabel: item.actionLabel,
    actionUrl: item.actionUrl,
    autoDismissSeconds: item.autoDismissSeconds,
    priority: item.priority,
  }));
}

export async function incrementNotificationClick(id: string): Promise<void> {
  if (!id) return;
  try {
    await prisma.systemNotification.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  } catch {
    // Ignore invalid id
  }
}

export async function getAllAdminNotifications(): Promise<SystemNotificationItem[]> {
  const items = await prisma.systemNotification.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return items as unknown as SystemNotificationItem[];
}

export async function createNotification(
  payload: NotificationPayload
): Promise<SystemNotificationItem> {
  const created = await prisma.systemNotification.create({
    data: {
      title: payload.title.trim(),
      message: payload.message.trim(),
      type: payload.type || "ANNOUNCEMENT",
      color: payload.color || "#6366f1",
      bgColor: payload.bgColor || null,
      icon: payload.icon || null,
      position: payload.position || "BOTTOM_LEFT",
      target: payload.target || "ALL",
      actionLabel: payload.actionLabel?.trim() || null,
      actionUrl: payload.actionUrl?.trim() || null,
      isActive: payload.isActive ?? true,
      priority: payload.priority ?? 0,
      autoDismissSeconds: payload.autoDismissSeconds ?? 10,
      startsAt: payload.startsAt ? new Date(payload.startsAt) : new Date(),
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    },
  });
  return created as unknown as SystemNotificationItem;
}

export async function updateNotification(
  id: string,
  payload: Partial<NotificationPayload>
): Promise<SystemNotificationItem> {
  const updateData: Record<string, unknown> = {};
  if (payload.title !== undefined) updateData.title = payload.title.trim();
  if (payload.message !== undefined) updateData.message = payload.message.trim();
  if (payload.type !== undefined) updateData.type = payload.type;
  if (payload.color !== undefined) updateData.color = payload.color;
  if (payload.bgColor !== undefined) updateData.bgColor = payload.bgColor;
  if (payload.icon !== undefined) updateData.icon = payload.icon;
  if (payload.position !== undefined) updateData.position = payload.position;
  if (payload.target !== undefined) updateData.target = payload.target;
  if (payload.actionLabel !== undefined) updateData.actionLabel = payload.actionLabel?.trim() || null;
  if (payload.actionUrl !== undefined) updateData.actionUrl = payload.actionUrl?.trim() || null;
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.priority !== undefined) updateData.priority = payload.priority;
  if (payload.autoDismissSeconds !== undefined) updateData.autoDismissSeconds = payload.autoDismissSeconds;
  if (payload.startsAt !== undefined) updateData.startsAt = new Date(payload.startsAt);
  if (payload.expiresAt !== undefined) {
    updateData.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;
  }

  const updated = await prisma.systemNotification.update({
    where: { id },
    data: updateData,
  });
  return updated as unknown as SystemNotificationItem;
}

export async function deleteNotification(id: string): Promise<void> {
  await prisma.systemNotification.delete({
    where: { id },
  });
}
