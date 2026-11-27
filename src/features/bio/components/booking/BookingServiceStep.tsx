"use client";

import React from "react";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { ConsultationServiceItem } from "@/features/appointments/types/appointments.types";

interface BookingServiceStepProps {
  services: ConsultationServiceItem[];
  onSelectService: (service: ConsultationServiceItem) => void;
  accentColor: string;
}

export function BookingServiceStep({
  services,
  onSelectService,
  accentColor,
}: BookingServiceStepProps) {
  return (
    <div className="space-y-2.5">
      {services.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onSelectService(service)}
          className="w-full text-right p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white group-hover:text-primary transition-colors">
                {service.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium inline-flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {service.durationMinutes} دقيقة
              </span>
            </div>
            {service.description && (
              <p className="text-[11px] text-white/60 line-clamp-1">
                {service.description}
              </p>
            )}
            <div className="text-xs font-black text-amber-400">
              {service.price === 0 ? "مجاناً" : `${service.price} ${service.currency}`}
            </div>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-all"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </div>
        </button>
      ))}
    </div>
  );
}
