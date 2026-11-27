import React from "react";
import { CalendarCheck } from "lucide-react";

interface PhoneBookingsBadgeProps {
  servicesCount?: number;
}

export function PhoneBookingsBadge({ servicesCount = 0 }: PhoneBookingsBadgeProps) {
  if (!servicesCount || servicesCount <= 0) return null;

  return (
    <div className="w-full my-2 px-3 py-2.5 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-between gap-2 text-right">
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-4 h-4 text-primary shrink-0" />
        <span className="text-[11px] font-bold text-on-surface">
          {servicesCount} باقة استشارة متاحة للحجز
        </span>
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold shrink-0">
        احجز الآن
      </span>
    </div>
  );
}
