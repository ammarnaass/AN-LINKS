"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock, DollarSign, Sparkles } from "lucide-react";
import { ConsultationServiceItem } from "../types/appointments.types";
import { AppBadge } from "@/shared/ui/AppBadge";

interface ServicesCatalogTabProps {
  services: ConsultationServiceItem[];
  onRefresh: () => Promise<void>;
}

export function ServicesCatalogTab({ services, onRefresh }: ServicesCatalogTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(150);
  const [currency, setCurrency] = useState("SAR");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/appointments/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          durationMinutes: duration,
          price,
          currency,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        await onRefresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف باقة الخدمة هذه؟")) return;
    const res = await fetch(`/api/appointments/services/${id}`, { method: "DELETE" });
    if (res.ok) await onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-on-surface-variant font-medium">
          حدد باقات الاستشارات والخدمات التي تقدمها لجمهورك بأسعار ومدد محددة.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> باقة استشارة جديدة
        </button>
      </div>

      {services.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container/20">
          <Sparkles className="w-10 h-10 text-primary/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-on-surface mb-1">لا توجد باقات خدمات مفعلة حالياً</p>
          <p className="text-xs text-on-surface-variant mb-4">أنشئ أول جلسة استشارية وحدد سعرها ومدتها لتبدأ في استقبال الحجوزات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border border-outline-variant/20 bg-surface-container/40 flex flex-col justify-between hover:border-primary/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-on-surface">{s.title}</h4>
                  <AppBadge variant={s.isActive ? "success" : "neutral"} className="text-[10px]">
                    {s.isActive ? "نشطة" : "معطلة"}
                  </AppBadge>
                </div>
                {s.description && (
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                    {s.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {s.durationMinutes} دقيقة
                  </span>
                  <span className="flex items-center gap-1 font-bold text-on-surface">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" /> {s.price} {s.currency}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex justify-end">
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container rounded-3xl p-6 border border-outline-variant/30 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-on-surface">إضافة باقة استشارة جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">عنوان الجلسة أو الخدمة</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: استشارة تسويقية 1:1"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">وصف موجز</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ما الذي سيحصل عليه العميل خلال هذه الجلسة؟"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">المدة (بالدقائق)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface"
                  >
                    <option value={15}>15 دقيقة</option>
                    <option value={30}>30 دقيقة</option>
                    <option value={45}>45 دقيقة</option>
                    <option value={60}>60 دقيقة (ساعة)</option>
                    <option value={90}>90 دقيقة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">السعر والعملة</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-2/3 px-3 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-1/3 px-2 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface"
                    >
                      <option value="SAR">SAR</option>
                      <option value="AED">AED</option>
                      <option value="KWD">KWD</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ الباقة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
