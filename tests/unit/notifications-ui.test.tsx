import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  NOTIFICATION_TYPE_MAP,
  PRESET_COLOR_PALETTES,
} from "@/features/notifications/constants/notification.constants";
import {
  getDismissedNotificationIds,
  markNotificationDismissed,
  isNotificationDismissed,
  clearDismissedNotifications,
} from "@/features/notifications/services/notification-storage.utils";
import { NotificationToast } from "@/features/notifications/components/NotificationToast";
import { NotificationPreviewCard } from "@/features/admin/components/notifications/NotificationPreviewCard";
import { ActiveNotificationDto, NotificationPayload } from "@/features/notifications/types/notification.types";

describe("Notifications UI & Storage Suite", () => {
  const dummyItem: ActiveNotificationDto = {
    id: "notif-123",
    title: "ميزة التحليلات المتقدمة",
    message: "تم تفعيل لوحة التحليلات الجغرافية لروابطك الآن بكل دقة وسرعة.",
    type: "ANNOUNCEMENT",
    color: "#6366f1",
    bgColor: null,
    icon: "Megaphone",
    position: "BOTTOM_LEFT",
    actionLabel: "شاهد التحليلات",
    actionUrl: "https://anlinks.dev/analytics",
    autoDismissSeconds: 0,
    priority: 1,
  };

  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("verifies type configurations and preset colors", () => {
    expect(NOTIFICATION_TYPE_MAP.ANNOUNCEMENT.labelAr).toBe("إعلان عام");
    expect(NOTIFICATION_TYPE_MAP.URGENT.labelAr).toBe("عاجل وهام");
    expect(NOTIFICATION_TYPE_MAP.SUCCESS.labelAr).toBe("تحديث ونجاح");
    expect(NOTIFICATION_TYPE_MAP.WARNING.labelAr).toBe("تنبيه وصيانة");
    expect(NOTIFICATION_TYPE_MAP.PROMO.labelAr).toBe("عرض وميزة حصرية");
    expect(NOTIFICATION_TYPE_MAP.CUSTOM.labelAr).toBe("لون مخصص");

    expect(PRESET_COLOR_PALETTES.length).toBeGreaterThanOrEqual(6);
  });

  it("manages dismissed notification IDs in localStorage safely", () => {
    const storage: Record<string, string> = {};
    const mockStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, val: string) => {
        storage[key] = val;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((k) => delete storage[k]);
      },
    };
    vi.stubGlobal("localStorage", mockStorage);
    vi.stubGlobal("window", { localStorage: mockStorage });

    expect(getDismissedNotificationIds()).toEqual([]);
    expect(isNotificationDismissed("notif-1")).toBe(false);

    markNotificationDismissed("notif-1");
    expect(isNotificationDismissed("notif-1")).toBe(true);
    expect(getDismissedNotificationIds()).toContain("notif-1");

    // Deduplication check
    markNotificationDismissed("notif-1");
    expect(getDismissedNotificationIds().filter((id) => id === "notif-1").length).toBe(1);

    clearDismissedNotifications();
    expect(getDismissedNotificationIds()).toEqual([]);

    vi.unstubAllGlobals();
  });

  it("renders NotificationToast with rectangular design, custom color, and CTA button", () => {
    const markup = renderToStaticMarkup(
      <NotificationToast
        notification={dummyItem}
        onDismiss={() => {}}
        onActionClick={() => {}}
      />
    );

    expect(markup).toContain("ميزة التحليلات المتقدمة");
    expect(markup).toContain("شاهد التحليلات");
    expect(markup).toContain("إعلان عام");
    // Should have rectangular container styling
    expect(markup).toContain("rounded-2xl");
  });

  it("renders NotificationPreviewCard with live customization colors and badges", () => {
    const previewPayload: NotificationPayload = {
      title: "تحديث أمني طارئ",
      message: "يرجى تغيير كلمة المرور فوراً للمحافظة على أمان حسابك",
      type: "URGENT",
      color: "#ef4444",
      actionLabel: "تحديث الآن",
      actionUrl: "/settings",
      target: "ALL",
      position: "BOTTOM_LEFT",
      isActive: true,
      priority: 10,
      autoDismissSeconds: 15,
    };

    const markup = renderToStaticMarkup(
      <NotificationPreviewCard payload={previewPayload} />
    );

    expect(markup).toContain("تحديث أمني طارئ");
    expect(markup).toContain("معاينة حية للمودل المستطيل");
    expect(markup).toContain("عاجل وهام");
    expect(markup).toContain("#ef4444");
  });
});
