"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, User, Mail, Phone, Calendar, Clock, CreditCard, MessageSquare, Loader2, Globe } from "lucide-react";
import {
  ConsultationServiceItem,
  ConsultationSlot,
  PublicGatewayOption,
} from "@/features/appointments/types/appointments.types";

interface BookingClientFormProps {
  service: ConsultationServiceItem;
  slot: ConsultationSlot;
  creatorTimezone: string;
  gateways: PublicGatewayOption[];
  onBack: () => void;
  onSubmit: (clientData: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientNotes?: string;
    clientTimezone: string;
    gatewayCode?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  accentColor: string;
  isPreview?: boolean;
}

export function BookingClientForm({
  service,
  slot,
  creatorTimezone,
  gateways,
  onBack,
  onSubmit,
  isSubmitting,
  accentColor,
  isPreview = false,
}: BookingClientFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [gatewayCode, setGatewayCode] = useState(gateways[0]?.code || "");

  const clientTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || creatorTimezone;
    } catch {
      return creatorTimezone;
    }
  }, [creatorTimezone]);

  const isPaid = service.price > 0;
  const effectiveGateway = gatewayCode || gateways[0]?.code || (isPreview ? "mada" : "");
  const missingGateway = isPaid && !isPreview && !effectiveGateway;

  const slotDateObj = new Date(`${slot.slotDate}T12:00:00.000Z`);
  const clientLocalTime = new Date(slot.startDateTime).toLocaleTimeString("ar-SA", {
    timeZone: clientTimezone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      clientName,
      clientEmail,
      clientPhone,
      clientNotes: clientNotes.trim() || undefined,
      clientTimezone,
      gatewayCode: isPaid ? effectiveGateway : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/25">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" /> تغيير الوقت
        </button>
        <span className="text-[11px] font-bold text-on-surface">تأكيد بيانات الحجز</span>
      </div>

      <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 text-xs space-y-1.5">
        <div className="font-bold text-on-surface flex items-center justify-between">
          <span>{service.title}</span>
          <span className="text-amber-500">
            {service.price === 0 ? "مجاناً" : `${service.price} ${service.currency}`}
          </span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant text-[11px] flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary" />
            {slotDateObj.toLocaleDateString("ar-SA", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" })}
          </span>
          <span className="flex items-center gap-1 font-mono font-semibold text-on-surface">
            <Clock className="w-3 h-3 text-amber-500" />
            {slot.startTime} - {slot.endTime}
          </span>
          {clientTimezone !== creatorTimezone && (
            <span className="flex items-center gap-1 text-[10px] text-primary">
              <Globe className="w-3 h-3" /> بتوقيتك: {clientLocalTime}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">الاسم الكامل *</label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="مثال: سارة عبدالله"
              className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-surface-container-lowest/85 border border-outline-variant/35 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-surface-container-lowest/85 border border-outline-variant/35 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">رقم الجوال (اختياري)</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+966 5x xxx xxxx"
                className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-surface-container-lowest/85 border border-outline-variant/35 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-on-surface-variant mb-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-primary" />
            <span>{service.intakePrompt || "نبذة عن موضوع الجلسة (اختياري)"}</span>
          </label>
          <textarea
            rows={2}
            maxLength={500}
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            placeholder="شارك نقاطك أو أسئلتك المبدئية..."
            className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-lowest/85 border border-outline-variant/35 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {isPaid && (
          <div className="pt-1">
            <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-primary" /> وسيلة الدفع ({service.price} {service.currency})
            </label>
            {gateways.length === 0 ? (
              <p className="text-[11px] text-error bg-error/10 border border-error/25 rounded-xl p-2.5">
                لا توجد بوابة دفع مفعلة لعملة {service.currency} حالياً.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gateways.map((gw) => {
                  const selected = effectiveGateway === gw.code;
                  return (
                    <button
                      key={gw.code}
                      type="button"
                      onClick={() => setGatewayCode(gw.code)}
                      className={`p-2 rounded-xl border text-right text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selected
                          ? "bg-primary/15 border-primary text-on-surface shadow-xs"
                          : "bg-surface-container-lowest/60 border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60"
                      }`}
                    >
                      <span className="truncate">{gw.nameAr}</span>
                      {gw.isTestMode && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 shrink-0">تجريبي</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || missingGateway}
        className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-black text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
        style={{ backgroundColor: accentColor || "#4edea3" }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> جاري تأكيد الحجز...
          </>
        ) : isPaid ? (
          `دفع وتأكيد الموعد (${service.price} ${service.currency})`
        ) : (
          "تأكيد حجز الموعد"
        )}
      </button>
    </form>
  );
}
