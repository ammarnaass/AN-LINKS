"use client";

import React from "react";
import { Clock, ArrowLeft, Video, Phone, MapPin } from "lucide-react";
import { ConsultationServiceItem } from "@/features/appointments/types/appointments.types";

interface BookingServiceStepProps {
  services: ConsultationServiceItem[];
  onSelectService: (service: ConsultationServiceItem) => void;
  accentColor: string;
}

function getMeetingTypeMeta(meetingType?: string) {
  if (meetingType === "PHONE") {
    return { label: "مكالمة هاتفية", Icon: Phone };
  }
  if (meetingType === "IN_PERSON") {
    return { label: "حضوري", Icon: MapPin };
  }
  return { label: "اجتماع أونلاين", Icon: Video };
}

export function BookingServiceStep({
  services,
  onSelectService,
  accentColor,
}: BookingServiceStepProps) {
  return (
    <div className="space-y-2.5">
      {services.map((service) => {
        const { label, Icon } = getMeetingTypeMeta(service.meetingType);
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelectService(service)}
            className="w-full text-right p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low/65 hover:bg-surface-container-high/80 hover:border-outline-variant/60 transition-all flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors">
                  {service.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {service.durationMinutes} دقيقة
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium inline-flex items-center gap-1">
                  <Icon className="w-2.5 h-2.5" /> {label}
                </span>
              </div>
              {service.description && (
                <p className="text-[11px] text-on-surface-variant line-clamp-1">
                  {service.description}
                </p>
              )}
              <div className="text-xs font-black text-amber-500">
                {service.price === 0 ? "مجاناً" : `${service.price} ${service.currency}`}
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-outline-variant/30 group-hover:scale-105 transition-all"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
