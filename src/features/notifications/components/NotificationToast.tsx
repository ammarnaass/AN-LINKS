"use client";

import React, { useEffect, useState } from "react";
import {
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Bell,
  X,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { ActiveNotificationDto } from "../types/notification.types";
import { NOTIFICATION_TYPE_MAP } from "../constants/notification.constants";

interface NotificationToastProps {
  notification: ActiveNotificationDto;
  onDismiss: (id: string) => void;
  onActionClick: (id: string, url?: string | null) => void;
}

export function NotificationToast({
  notification,
  onDismiss,
  onActionClick,
}: NotificationToastProps) {
  const typeConfig = NOTIFICATION_TYPE_MAP[notification.type] || NOTIFICATION_TYPE_MAP.ANNOUNCEMENT;
  const accentColor = notification.color || typeConfig.defaultColor;

  const [progress, setProgress] = useState(100);
  const autoDismissSec = notification.autoDismissSeconds ?? 0;

  useEffect(() => {
    if (!autoDismissSec || autoDismissSec <= 0) return;

    const intervalMs = 100;
    const totalMs = autoDismissSec * 1000;
    const step = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss(notification.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [notification.id, autoDismissSec, onDismiss]);

  const renderIcon = () => {
    const iconName = notification.icon || typeConfig.defaultIcon;
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
    <div
      role="alert"
      dir="rtl"
      className="relative w-80 sm:w-96 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/35 shadow-2xl p-4 overflow-hidden transition-all duration-300 pointer-events-auto group hover:border-outline-variant/60"
      style={{
        boxShadow: `0 12px 35px -8px ${accentColor}25, 0 4px 15px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40"
        style={{ backgroundColor: accentColor }}
      />

      {/* Side Accent Line */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start gap-3.5 pr-2">
        {/* Dynamic Icon with dedicated color */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105"
          style={{
            color: accentColor,
            borderColor: `${accentColor}40`,
            backgroundColor: `${accentColor}15`,
          }}
        >
          {renderIcon()}
        </div>

        {/* Content Box */}
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

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => onDismiss(notification.id)}
              aria-label="إغلاق الإشعار"
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-on-surface leading-tight mb-1 truncate">
            {notification.title}
          </h4>

          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
            {notification.message}
          </p>

          {/* Action CTA Button */}
          {notification.actionLabel && (
            <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onActionClick(notification.id, notification.actionUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:brightness-110 active:scale-95 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <span>{notification.actionLabel}</span>
                {notification.actionUrl?.startsWith("http") ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5" />
                )}
              </button>

              {autoDismissSec > 0 && (
                <span className="text-[10px] text-outline font-mono">
                  يختفي تلقائياً
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      {autoDismissSec > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-container-high overflow-hidden">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
}
