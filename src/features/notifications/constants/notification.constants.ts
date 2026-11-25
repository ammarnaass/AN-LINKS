import { NotificationType, NotificationTarget, NotificationPosition } from "../types/notification.types";

export interface NotificationTypeMeta {
  type: NotificationType;
  labelAr: string;
  defaultColor: string;
  defaultBg: string;
  defaultIcon: string;
}

export const NOTIFICATION_TYPE_MAP: Record<NotificationType, NotificationTypeMeta> = {
  ANNOUNCEMENT: {
    type: "ANNOUNCEMENT",
    labelAr: "إعلان عام",
    defaultColor: "#6366f1",
    defaultBg: "rgba(99, 102, 241, 0.12)",
    defaultIcon: "Megaphone",
  },
  SUCCESS: {
    type: "SUCCESS",
    labelAr: "تحديث ونجاح",
    defaultColor: "#10b981",
    defaultBg: "rgba(16, 185, 129, 0.12)",
    defaultIcon: "CheckCircle2",
  },
  WARNING: {
    type: "WARNING",
    labelAr: "تنبيه وصيانة",
    defaultColor: "#f59e0b",
    defaultBg: "rgba(245, 158, 11, 0.12)",
    defaultIcon: "AlertTriangle",
  },
  URGENT: {
    type: "URGENT",
    labelAr: "عاجل وهام",
    defaultColor: "#ef4444",
    defaultBg: "rgba(239, 68, 68, 0.15)",
    defaultIcon: "AlertCircle",
  },
  PROMO: {
    type: "PROMO",
    labelAr: "عرض وميزة حصرية",
    defaultColor: "#06b6d4",
    defaultBg: "rgba(6, 182, 212, 0.12)",
    defaultIcon: "Sparkles",
  },
  CUSTOM: {
    type: "CUSTOM",
    labelAr: "لون مخصص",
    defaultColor: "#ec4899",
    defaultBg: "rgba(236, 72, 153, 0.12)",
    defaultIcon: "Bell",
  },
};

export const NOTIFICATION_TARGET_OPTIONS: { value: NotificationTarget; labelAr: string; descriptionAr: string }[] = [
  { value: "ALL", labelAr: "الجميع", descriptionAr: "يظهر لجميع زوار المنصة والمستخدمين المسجلين" },
  { value: "CREATORS_ONLY", labelAr: "صناع المحتوى فقط", descriptionAr: "يظهر فقط للمستخدمين المسجلين في لوحة التحكم" },
  { value: "VISITORS_ONLY", labelAr: "الزوار غير المسجلين فقط", descriptionAr: "يظهر للزوار في الصفحة الرئيسية والصفحات العامة" },
  { value: "ADMINS_ONLY", labelAr: "فريق الإدارة فقط", descriptionAr: "يظهر لمدراء النظام في لوحة الإدارة المركزية" },
];

export const NOTIFICATION_POSITION_OPTIONS: { value: NotificationPosition; labelAr: string }[] = [
  { value: "BOTTOM_LEFT", labelAr: "يسار أسفل الشاشة (الافتراضي الأنسب)" },
  { value: "TOP_LEFT", labelAr: "يسار أعلى الشاشة" },
  { value: "BOTTOM_CENTER", labelAr: "أسفل وسط الشاشة" },
];

export const PRESET_COLOR_PALETTES = [
  { color: "#6366f1", label: "إنديجو ملكي" },
  { color: "#10b981", label: "أخضر زمردي" },
  { color: "#f59e0b", label: "كهرماني دافئ" },
  { color: "#ef4444", label: "قرمزي ساطع" },
  { color: "#06b6d4", label: "تركواز سماوي" },
  { color: "#8b5cf6", label: "أرجواني نابض" },
  { color: "#ec4899", label: "وردي نيون" },
  { color: "#3b82f6", label: "أزرق كلاسيكي" },
];
