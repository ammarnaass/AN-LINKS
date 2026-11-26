import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { prisma } from "@/shared/db";
import {
  createNotification,
  getActiveNotificationsForUser,
  updateNotification,
  deleteNotification,
  incrementNotificationClick,
  getAllAdminNotifications,
} from "@/features/notifications/server/notification.service";
import { GET as getActiveRoute } from "@/app/api/notifications/active/route";
import { POST as postClickRoute } from "@/app/api/notifications/[id]/click/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

vi.mock("next-auth", () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

describe("Notifications Service & API Suite", { timeout: 30000 }, () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await prisma.systemNotification.deleteMany({});
  });

  afterAll(async () => {
    await prisma.systemNotification.deleteMany({});
    await prisma.$disconnect();
  });

  it("creates, retrieves, updates, and deletes a notification via service", async () => {
    const created = await createNotification({
      title: "إطلاق التحديث الجديد",
      message: "مرحباً بكم في نظام الإشعارات الذكي والمميز",
      type: "ANNOUNCEMENT",
      target: "ALL",
      position: "BOTTOM_LEFT",
      isActive: true,
      color: "#6366f1",
      actionUrl: "https://anlinks.dev/updates",
      actionLabel: "استكشف الآن",
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("إطلاق التحديث الجديد");
    expect(created.color).toBe("#6366f1");

    // Retrieve active for visitor
    const activeVisitor = await getActiveNotificationsForUser({ isAuthenticated: false });
    expect(activeVisitor.some((n) => n.id === created.id)).toBe(true);

    // Update notification
    const updated = await updateNotification(created.id, {
      title: "عنوان محدث",
      isActive: false,
    });
    expect(updated.title).toBe("عنوان محدث");
    expect(updated.isActive).toBe(false);

    // After deactivating, should not be active
    const activeAfterDeactivate = await getActiveNotificationsForUser({ isAuthenticated: false });
    expect(activeAfterDeactivate.some((n) => n.id === created.id)).toBe(false);

    // Delete
    await deleteNotification(created.id);
    const all = await getAllAdminNotifications();
    expect(all.some((n) => n.id === created.id)).toBe(false);
  });

  it("filters notifications correctly by target audience", async () => {
    await createNotification({
      title: "تنبيه للمبدعين",
      message: "خاص بصناع المحتوى",
      type: "PROMO",
      target: "CREATORS_ONLY",
      isActive: true,
    });

    await createNotification({
      title: "تنبيه للإدارة",
      message: "خاص بالمسؤولين فقط",
      type: "URGENT",
      target: "ADMINS_ONLY",
      isActive: true,
    });

    await createNotification({
      title: "تنبيه للزوار",
      message: "خاص بالزوار الجدد",
      type: "SUCCESS",
      target: "VISITORS_ONLY",
      isActive: true,
    });

    // Visitor
    const forVisitor = await getActiveNotificationsForUser({ isAuthenticated: false });
    expect(forVisitor.length).toBe(1);
    expect(forVisitor[0].title).toBe("تنبيه للزوار");

    // Regular Creator User (not admin)
    const forCreator = await getActiveNotificationsForUser({ isAuthenticated: true, role: "USER" });
    expect(forCreator.length).toBe(1);
    expect(forCreator[0].title).toBe("تنبيه للمبدعين");

    // Admin
    const forAdmin = await getActiveNotificationsForUser({ isAuthenticated: true, role: "ADMIN" });
    // Admins get ADMINS_ONLY and CREATORS_ONLY
    expect(forAdmin.some((n) => n.title === "تنبيه للإدارة")).toBe(true);
    expect(forAdmin.some((n) => n.title === "تنبيه للمبدعين")).toBe(true);
    expect(forAdmin.some((n) => n.title === "تنبيه للزوار")).toBe(false);
  });

  it("increments clicks counter correctly", async () => {
    const item = await createNotification({
      title: "عرض خاص",
      message: "خصم 50% على الباقات السنوية",
      type: "PROMO",
      target: "ALL",
      isActive: true,
    });

    await incrementNotificationClick(item.id);

    const check = await prisma.systemNotification.findUnique({ where: { id: item.id } });
    expect(check?.clickCount).toBe(1);
  });

  it("handles GET /api/notifications/active route", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const item = await createNotification({
      title: "تنبيه نشط",
      message: "رسالة عبر الـ API",
      type: "SUCCESS",
      target: "ALL",
      isActive: true,
    });

    const res = await getActiveRoute();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.notifications)).toBe(true);
    expect(json.notifications.some((n: any) => n.id === item.id)).toBe(true);
  });

  it("handles POST /api/notifications/[id]/click route", async () => {
    const item = await createNotification({
      title: "إشعار تفاعلي",
      message: "اضغط هنا",
      type: "CUSTOM",
      target: "ALL",
      isActive: true,
    });

    const req = new NextRequest(`http://localhost:3002/api/notifications/${item.id}/click`, {
      method: "POST",
    });
    const res = await postClickRoute(req, { params: Promise.resolve({ id: item.id }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);

    const updated = await prisma.systemNotification.findUnique({ where: { id: item.id } });
    expect(updated?.clickCount).toBe(1);
  });
});
