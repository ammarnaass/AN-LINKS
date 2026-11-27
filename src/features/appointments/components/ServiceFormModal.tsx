"use client";

import React, { useState } from "react";
import { AlertCircle, Video, Phone, MapPin } from "lucide-react";
import { ConsultationServiceItem, MeetingType } from "../types/appointments.types";

interface ServiceFormModalProps {
  initialService: ConsultationServiceItem | null;
  allowPaidServices: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export function ServiceFormModal({
  initialService,
  allowPaidServices,
  onClose,
  onSaved,
}: ServiceFormModalProps) {
  const isEdit = Boolean(initialService);
  const [title, setTitle] = useState(initialService?.title || "");
  const [description, setDescription] = useState(initialService?.description || "");
  const [duration, setDuration] = useState(initialService?.durationMinutes || 30);
  const [price, setPrice] = useState(initialService?.price ?? (allowPaidServices ? 150 : 0));
  const [currency, setCurrency] = useState(initialService?.currency || "SAR");
  const [meetingType, setMeetingType] = useState<MeetingType>(
    (initialService?.meetingType as MeetingType) || "ONLINE"
  );
  const [meetingLocation, setMeetingLocation] = useState(initialService?.meetingLocation || "");
  const [bufferMinutes, setBufferMinutes] = useState(initialService?.bufferMinutes ?? 10);
  const [intakePrompt, setIntakePrompt] = useState(initialService?.intakePrompt || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setIsSubmitting(true);
      const endpoint = isEdit
        ? `/api/appointments/services/${initialService!.id}`
        : "/api/appointments/services";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          durationMinutes: Number(duration),
          price: Number(price),
          currency,
          meetingType,
          meetingLocation,
          bufferMinutes: Number(bufferMinutes),
          intakePrompt,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "تعذر حفظ بيانات الخدمة");
        return;
      }
      await onSaved();
      onClose();
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-surface-container rounded-3xl p-6 border border-outline-variant/30 shadow-2xl space-y-4 my-auto">
        <h3 className="text-base font-bold text-on-surface">
          {isEdit ? "تعديل باقة الاستشارة" : "إضافة باقة استشارة أو خدمة جديدة"}
        </h3>

        {error && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-on-surface mb-1">عنوان الجلسة أو الخدمة *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استشارة استراتيجية 1:1"
              className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">وصف موجز للعميل</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ما النتائج التي سيحصل عليها العميل؟"
              className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-on-surface mb-1">المدة</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface"
              >
                <option value={15}>15 د</option>
                <option value={30}>30 د</option>
                <option value={45}>45 د</option>
                <option value={60}>60 د</option>
                <option value={90}>90 د</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">فترة الراحة</label>
              <select
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface"
              >
                <option value={0}>بدون راحة</option>
                <option value={5}>5 د</option>
                <option value={10}>10 د</option>
                <option value={15}>15 د</option>
                <option value={30}>30 د</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">السعر</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={price}
                  disabled={!allowPaidServices}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-1/2 px-2 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface disabled:opacity-60"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/2 px-1.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface"
                >
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                  <option value="KWD">KWD</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">طريقة انعقاد الجلسة</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "ONLINE", label: "عن بُعد (فيديو)", icon: Video },
                { id: "PHONE", label: "اتصال هاتفي", icon: Phone },
                { id: "IN_PERSON", label: "لقاء حضوري", icon: MapPin },
              ].map((m) => {
                const Icon = m.icon;
                const active = meetingType === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMeetingType(m.id as MeetingType)}
                    className={`p-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      active
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-surface-container-high border-outline-variant/20 text-on-surface-variant"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {meetingType !== "PHONE" && (
            <div>
              <label className="block font-semibold text-on-surface mb-1">
                {meetingType === "ONLINE"
                  ? "رابط الاجتماع الدائم (Zoom / Google Meet - اختياري)"
                  : "عنوان المقر أو العيادة *"}
              </label>
              <input
                type={meetingType === "ONLINE" ? "url" : "text"}
                required={meetingType === "IN_PERSON"}
                dir={meetingType === "ONLINE" ? "ltr" : "rtl"}
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder={
                  meetingType === "ONLINE"
                    ? "https://meet.google.com/xxx-yyyy-zzz (يولّد تلقائياً إذا تُرك فارغاً)"
                    : "مثال: حي العليا، طريق الملك فهد، الرياض"
                }
                className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-on-surface mb-1">سؤال تمهيدي للعميل (اختياري)</label>
            <input
              type="text"
              value={intakePrompt}
              onChange={(e) => setIntakePrompt(e.target.value)}
              placeholder="مثال: ما أبرز تحدٍّ تواجهه حالياً وتود مناقشته؟"
              className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-high"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90"
            >
              {isSubmitting ? "جاري الحفظ..." : isEdit ? "تحديث الباقة" : "حفظ الباقة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
