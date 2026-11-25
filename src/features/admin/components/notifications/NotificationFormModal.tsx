"use client";

import React, { useState } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import {
  NotificationPayload,
  NotificationType,
  SystemNotificationItem,
  NOTIFICATION_TYPE_MAP,
} from "@/features/notifications";
import { NotificationPreviewCard } from "./NotificationPreviewCard";
import { NotificationFormFields } from "./NotificationFormFields";

interface NotificationFormModalProps {
  initialData?: SystemNotificationItem | null;
  onSave: (payload: NotificationPayload) => Promise<void>;
  onClose: () => void;
}

export function NotificationFormModal({
  initialData,
  onSave,
  onClose,
}: NotificationFormModalProps) {
  const [formData, setFormData] = useState<NotificationPayload>({
    title: initialData?.title || "",
    message: initialData?.message || "",
    type: initialData?.type || "ANNOUNCEMENT",
    color: initialData?.color || "#6366f1",
    bgColor: initialData?.bgColor || null,
    icon: initialData?.icon || null,
    position: initialData?.position || "BOTTOM_LEFT",
    target: initialData?.target || "ALL",
    actionLabel: initialData?.actionLabel || "",
    actionUrl: initialData?.actionUrl || "",
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority ?? 0,
    autoDismissSeconds: initialData?.autoDismissSeconds ?? 10,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (type: NotificationType) => {
    const meta = NOTIFICATION_TYPE_MAP[type];
    setFormData((prev) => ({
      ...prev,
      type,
      color: meta.defaultColor,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("يرجى إدخال عنوان الإشعار");
      return;
    }
    if (!formData.message.trim()) {
      setError("يرجى إدخال نص الإشعار");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الإشعار");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-cairo" dir="rtl">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                {initialData ? "تعديل الإشعار" : "إنشاء إشعار تفاعلي جديد"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                يظهر الإشعار كمودل مستطيل في يسار صفحات الموقع
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body with side-by-side preview */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <NotificationFormFields
                formData={formData}
                onChange={setFormData}
                onTypeChange={handleTypeChange}
              />
            </div>

            <div className="lg:col-span-5 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/20 space-y-4 sticky top-0">
              <NotificationPreviewCard payload={formData} />
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-xs font-bold text-on-surface">تفعيل الإشعار فوراً للجمهور</span>
            </label>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "نشر الإشعار الآن"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
