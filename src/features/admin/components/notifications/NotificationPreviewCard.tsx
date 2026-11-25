"use client";

import React from "react";
import {
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Bell,
  X,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import {
  NotificationPayload,
  NotificationType,
} from "@/features/notifications";
import { NOTIFICATION_TYPE_MAP } from "@/features/notifications";

interface NotificationPreviewCardProps {
  payload: NotificationPayload;
}

export function NotificationPreviewCard({ payload }: NotificationPreviewCardProps) {
  const typeConfig = NOTIFICATION_TYPE_MAP[payload.type || "ANNOUNCEMENT"] || NOTIFICATION_TYPE_MAP.ANNOUNCEMENT;
  const accentColor = payload.color || typeConfig.defaultColor;

  const renderIcon = () => {
    const iconName = payload.icon || typeConfig.defaultIcon;
    const props = { className: "w-5 h-5 shrink-0" };

    switch (iconName) {
      case "CheckCircle2":
        return <CheckCircle2 {...props} />;
      case "AlertTriangle":
        return <AlertTriangle {...props} />;
      case "AlertCircle":
        return <AlertCircle {...props} />;
      case "Sparkles":
        return <Sparkles {...props} />;
      case "Bell":
        return <Bell {...props} />;
      case "Megaphone":
      default:
        return <Megaphone {...props} />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
        <span>معاينة حية للمودل المستطيل (يسار الموقع)</span>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/30">
          Live Preview
        </span>
      </div>

      <div
        role="region"
        aria-label="معاينة الإشعار"
        dir="rtl"
        className="relative w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/35 shadow-2xl p-4 overflow-hidden transition-all duration-300"
        style={{
          boxShadow: `0 12px 35px -8px ${accentColor}30, 0 4px 15px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ backgroundColor: accentColor }}
        />

        {/* Side Accent Line */}
        <div
          className="absolute top-0 right-0 bottom-0 w-1.5"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-start gap-3.5 pr-2">
          {/* Dynamic Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm"
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}15`,
            }}
          >
            {renderIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full uppercase"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}18`,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {typeConfig.labelAr}
              </span>

              <button
                type="button"
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-default opacity-60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-on-surface leading-tight mb-1 truncate">
              {payload.title || "عنوان الإشعار يظهر هنا"}
            </h4>

            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
              {payload.message || "نص رسالة الإشعار التوضيحية تظهر هنا للمستخدم أو الزائر في يسار الموقع..."}
            </p>

            {payload.actionLabel && (
              <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>{payload.actionLabel}</span>
                  {payload.actionUrl?.startsWith("http") ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                </button>

                {payload.autoDismissSeconds && payload.autoDismissSeconds > 0 ? (
                  <span className="text-[10px] text-outline font-mono">
                    يختفي بعد {payload.autoDismissSeconds} ث
                  </span>
                ) : (
                  <span className="text-[10px] text-outline font-mono">
                    ثابت حتى الإغلاق
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mock progress bar */}
        {payload.autoDismissSeconds && payload.autoDismissSeconds > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-container-high overflow-hidden">
            <div
              className="h-full w-2/3"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
