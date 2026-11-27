"use client";

import React, { useState } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import {
  ConsultationServiceItem,
  ConsultationSlot,
} from "@/features/appointments/types/appointments.types";
import { BookingServiceStep } from "./BookingServiceStep";
import { BookingDateSlotStep } from "./BookingDateSlotStep";
import { BookingClientForm } from "./BookingClientForm";
import { BookingConfirmationStep } from "./BookingConfirmationStep";

interface BioBookingCardProps {
  username: string;
  services?: ConsultationServiceItem[];
  accentColor?: string | null;
  isPreview?: boolean;
}

export function BioBookingCard({
  username,
  services,
  accentColor = "#4edea3",
  isPreview = false,
}: BioBookingCardProps) {
  const [step, setStep] = useState<"service" | "date_slot" | "client_form" | "confirmed">("service");
  const [selectedService, setSelectedService] = useState<ConsultationServiceItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<{
    booking: {
      id: string;
      clientName: string;
      startTime: string | Date;
      meetingUrl?: string | null;
    };
    calendarUrls: {
      google?: string;
      outlook?: string;
      ics?: string;
    };
  } | null>(null);

  if (!services || services.length === 0) return null;

  const effectiveAccent = accentColor || "#4edea3";

  const handleSelectService = (service: ConsultationServiceItem) => {
    setSelectedService(service);
    setError(null);
    setStep("date_slot");
  };

  const handleSelectSlot = (slot: ConsultationSlot) => {
    setSelectedSlot(slot);
    setError(null);
    setStep("client_form");
  };

  const handleSubmitBooking = async (clientData: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
  }) => {
    if (!selectedService || !selectedSlot) return;
    setError(null);

    if (isPreview) {
      setConfirmedData({
        booking: {
          id: "preview-booking",
          clientName: clientData.clientName,
          startTime: selectedSlot.startDateTime,
          meetingUrl: "https://meet.google.com/anl-preview",
        },
        calendarUrls: {
          google: "#",
          outlook: "#",
          ics: "#",
        },
      });
      setStep("confirmed");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/bio/${encodeURIComponent(username)}/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startTime: selectedSlot.startDateTime.toISOString(),
          clientName: clientData.clientName,
          clientEmail: clientData.clientEmail,
          clientPhone: clientData.clientPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "تعذر إتمام الحجز حالياً");
        return;
      }

      setConfirmedData({
        booking: data.booking,
        calendarUrls: data.calendarUrls,
      });
      setStep("confirmed");
    } catch {
      setError("حدث خطأ أثناء حجز الموعد، يرجى المحاولة لاحقاً");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("service");
    setSelectedService(null);
    setSelectedSlot(null);
    setConfirmedData(null);
    setError(null);
  };

  return (
    <div className="w-full my-3 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl text-right">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${effectiveAccent}25`, color: effectiveAccent }}
        >
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-black text-white">حجز موعد أو استشارة مباشرة</h3>
          <p className="text-[11px] text-white/60">اختر موعداً مناسباً لمكالمة واجتماع عمل افتراضي</p>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === "service" && (
        <BookingServiceStep
          services={services}
          onSelectService={handleSelectService}
          accentColor={effectiveAccent}
        />
      )}

      {step === "date_slot" && selectedService && (
        <BookingDateSlotStep
          username={username}
          service={selectedService}
          onBack={() => setStep("service")}
          onSelectSlot={handleSelectSlot}
          accentColor={effectiveAccent}
        />
      )}

      {step === "client_form" && selectedService && selectedSlot && (
        <BookingClientForm
          service={selectedService}
          slot={selectedSlot}
          onBack={() => setStep("date_slot")}
          onSubmit={handleSubmitBooking}
          isSubmitting={isSubmitting}
          accentColor={effectiveAccent}
        />
      )}

      {step === "confirmed" && confirmedData && (
        <BookingConfirmationStep
          booking={confirmedData.booking}
          calendarUrls={confirmedData.calendarUrls}
          onReset={handleReset}
          accentColor={effectiveAccent}
        />
      )}
    </div>
  );
}
