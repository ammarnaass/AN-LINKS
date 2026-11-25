"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  NotificationPayload,
  NotificationType,
  NotificationTarget,
  NOTIFICATION_TYPE_MAP,
  NOTIFICATION_TARGET_OPTIONS,
  PRESET_COLOR_PALETTES,
} from "@/features/notifications";

interface NotificationFormFieldsProps {
  formData: NotificationPayload;
  onChange: (data: NotificationPayload) => void;
  onTypeChange: (type: NotificationType) => void;
}

export function NotificationFormFields({
  formData,
  onChange,
  onTypeChange,
}: NotificationFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-on-surface mb-1">
          نوع الإشعار والتصنيف
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(NOTIFICATION_TYPE_MAP) as NotificationType[]).map((t) => {
            const meta = NOTIFICATION_TYPE_MAP[t];
            const isSelected = formData.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onTypeChange(t)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface-container border-primary shadow-sm"
                    : "border-outline-variant/20 hover:border-outline-variant/40 bg-surface-container-low"
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.defaultColor }} />
                <span className="truncate">{meta.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-on-surface mb-1">
          اللون المخصص للإشعار (Accent Color)
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {PRESET_COLOR_PALETTES.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => onChange({ ...formData, color: p.color })}
              title={p.label}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: p.color,
                borderColor: formData.color === p.color ? "#ffffff" : "transparent",
              }}
            >
              {formData.color === p.color && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
          <input
            type="color"
            value={formData.color || "#6366f1"}
            onChange={(e) => onChange({ ...formData, color: e.target.value })}
            className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0"
            title="اختر لوناً حراً"
          />
          <span className="text-xs font-mono text-outline pr-1" dir="ltr">{formData.color}</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-on-surface mb-1">عنوان الإشعار *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="مثال: خصم 40% على اشتراكات Pro السنوية"
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-on-surface mb-1">نص رسالة الإشعار *</label>
        <textarea
          required
          rows={3}
          value={formData.message}
          onChange={(e) => onChange({ ...formData, message: e.target.value })}
          placeholder="اكتب تفاصيل الإشعار هنا..."
          className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">الجمهور المستهدف</label>
          <select
            value={formData.target}
            onChange={(e) => onChange({ ...formData, target: e.target.value as NotificationTarget })}
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
          >
            {NOTIFICATION_TARGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.labelAr}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">مؤقت الاختفاء (ثواني)</label>
          <input
            type="number"
            min={0}
            max={60}
            value={formData.autoDismissSeconds ?? 10}
            onChange={(e) => onChange({ ...formData, autoDismissSeconds: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">نص زر الإجراء (اختياري)</label>
          <input
            type="text"
            value={formData.actionLabel || ""}
            onChange={(e) => onChange({ ...formData, actionLabel: e.target.value })}
            placeholder="مثال: ترقية الحساب"
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">رابط زر الإجراء (URL)</label>
          <input
            type="text"
            value={formData.actionUrl || ""}
            onChange={(e) => onChange({ ...formData, actionUrl: e.target.value })}
            placeholder="/pricing أو https://..."
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}
