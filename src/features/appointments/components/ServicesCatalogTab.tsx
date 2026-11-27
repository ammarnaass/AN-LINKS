"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Clock, DollarSign, Sparkles, Pencil, Power, Crown, Video, Phone, MapPin } from "lucide-react";
import { ConsultationServiceItem } from "../types/appointments.types";
import { AppBadge } from "@/shared/ui/AppBadge";
import { ServiceFormModal } from "./ServiceFormModal";

interface ServicesCatalogTabProps {
  services: ConsultationServiceItem[];
  quota: {
    allowAppointments: boolean;
    maxServices: number;
    allowPaidServices: boolean;
    storeCommissionRate: number;
  };
  onRefresh: () => Promise<void>;
}

export function ServicesCatalogTab({ services, quota, onRefresh }: ServicesCatalogTabProps) {
  const [editingService, setEditingService] = useState<ConsultationServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const canCreateMore = services.length < quota.maxServices;

  const handleToggleActive = async (service: ConsultationServiceItem) => {
    const res = await fetch(`/api/appointments/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !service.isActive }),
    });
    if (res.ok) await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟ (إذا ارتبطت بحجوزات سابقة سيتم أرشفتها لحفظ السجل المالي)")) {
      return;
    }
    const res = await fetch(`/api/appointments/services/${id}`, { method: "DELETE" });
    if (res.ok) await onRefresh();
  };

  const renderMeetingIcon = (type?: string) => {
    if (type === "PHONE") return <Phone className="w-3 h-3" />;
    if (type === "IN_PERSON") return <MapPin className="w-3 h-3" />;
    return <Video className="w-3 h-3" />;
  };

  return (
    <div className="space-y-4">
      {!quota.allowAppointments && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-on-surface">
            <Crown className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold block">الباقة المجانية تتيح باقة استشارة تجريبية مجانية واحدة فقط</span>
              <span className="text-on-surface-variant">قم بالترقية لتفعيل الاستشارات المدفوعة وبوابات مدى وApple Pay وتخفيض عمولة المنصة إلى {quota.storeCommissionRate}% فأقل.</span>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-bold whitespace-nowrap self-start sm:self-auto"
          >
            ترقية الباقة
          </Link>
        </div>
      )}

      <div className="flex justify-between items-center gap-3 flex-wrap">
        <p className="text-xs text-on-surface-variant font-medium">
          باقاتك الاستشارية ({services.length} / {quota.allowAppointments ? "غير محدود" : quota.maxServices}) • عمولة المنصة الحالية: {quota.storeCommissionRate}%
        </p>
        <button
          onClick={() => setIsCreating(true)}
          disabled={!canCreateMore}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> باقة استشارة جديدة
        </button>
      </div>

      {services.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container/20">
          <Sparkles className="w-10 h-10 text-primary/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-on-surface mb-1">لا توجد باقات خدمات مفعلة حالياً</p>
          <p className="text-xs text-on-surface-variant">أنشئ أول جلسة استشارية وحدد نوع الاجتماع وفترة الراحة وسعرها</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border border-outline-variant/25 bg-surface-container/40 flex flex-col justify-between hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-on-surface truncate">{s.title}</h4>
                  <AppBadge variant={s.isActive ? "success" : "neutral"} className="text-[10px] shrink-0">
                    {s.isActive ? "نشطة" : "متوقفة"}
                  </AppBadge>
                </div>
                {s.description && (
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">{s.description}</p>
                )}
                <div className="flex items-center flex-wrap gap-2.5 text-xs text-on-surface-variant mt-2">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {s.durationMinutes} د
                  </span>
                  <span className="flex items-center gap-1 font-bold text-on-surface">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                    {s.price === 0 ? "مجاناً" : `${s.price} ${s.currency}`}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-high text-[10px] font-semibold">
                    {renderMeetingIcon(s.meetingType)}
                    {s.meetingType === "PHONE" ? "هاتفي" : s.meetingType === "IN_PERSON" ? "حضوري" : "أونلاين"}
                  </span>
                  {(s.bufferMinutes ?? 0) > 0 && (
                    <span className="text-[10px] text-on-surface-variant">راحة {s.bufferMinutes}د</span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleActive(s)}
                  className="px-2.5 py-1 rounded-lg text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition flex items-center gap-1"
                >
                  <Power className="w-3.5 h-3.5" /> {s.isActive ? "إيقاف مؤقت" : "تفعيل"}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingService(s)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition text-xs flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editingService) && (
        <ServiceFormModal
          initialService={editingService}
          allowPaidServices={quota.allowPaidServices}
          onClose={() => {
            setIsCreating(false);
            setEditingService(null);
          }}
          onSaved={onRefresh}
        />
      )}
    </div>
  );
}
