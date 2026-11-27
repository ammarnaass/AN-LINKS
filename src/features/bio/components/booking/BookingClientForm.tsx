"use client";

import React, { useState } from "react";
import { ArrowRight, User, Mail, Phone, Calendar, Clock, DollarSign, Loader2 } from "lucide-react";
import {
  ConsultationServiceItem,
  ConsultationSlot,
} from "@/features/appointments/types/appointments.types";

interface BookingClientFormProps {
  service: ConsultationServiceItem;
  slot: ConsultationSlot;
  onBack: () => void;
  onSubmit: (clientData: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  accentColor: string;
}

export function BookingClientForm({
  service,
  slot,
  onBack,
  onSubmit,
  isSubmitting,
  accentColor,
}: BookingClientFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ clientName, clientEmail, clientPhone });
  };

  const slotDateObj = new Date(`${slot.slotDate}T00:00:00.000Z`);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" /> تغيير الوقت
        </button>
        <span className="text-[11px] font-bold text-white/90">تأكيد بيانات الحجز</span>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
        <div className="font-bold text-white flex items-center justify-between">
          <span>{service.title}</span>
          <span className="text-amber-400">
            {service.price === 0 ? "مجاناً" : `${service.price} ${service.currency}`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-white/70 text-[11px]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary" />
            {slotDateObj.toLocaleDateString("ar-SA", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-amber-400" />
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-[11px] font-semibold text-white/80 mb-1">الاسم الكامل *</label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="مثال: سارة عبدالله"
              className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/80 mb-1">البريد الإلكتروني *</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="email"
              required
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/80 mb-1">رقم الهاتف (اختياري للتواصل)</label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+966 5x xxx xxxx"
              className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-black text-black transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-98"
        style={{ backgroundColor: accentColor || "#4edea3" }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" /> جاري تأكيد الحجز...
          </>
        ) : (
          <>
            تأكيد حجز الموعد 🗓️
          </>
        )}
      </button>
    </form>
  );
}
