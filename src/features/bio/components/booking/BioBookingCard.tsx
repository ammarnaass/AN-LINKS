"use client";

import React, { useState } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import {
  ConsultationServiceItem,
  ConsultationSlot,
  PublicGatewayOption,
} from "@/features/appointments/types/appointments.types";
import { BookingServiceStep } from "./BookingServiceStep";
import { BookingDateSlotStep, SlotsLoadedMeta } from "./BookingDateSlotStep";
import { BookingClientForm } from "./BookingClientForm";
import { BookingConfirmationStep } from "./BookingConfirmationStep";

interface BioBookingCardProps {
  username: string;
  services?: ConsultationServiceItem[];
  creatorTimezone?: string;
  accentColor?: string | null;
  isPreview?: boolean;
}

export function BioBookingCard({
  username,
  services,
  creatorTimezone = "Asia/Riyadh",
  accentColor = "#4edea3",
  isPreview = false,
}: BioBookingCardProps) {
  const [step, setStep] = useState<"service" | "date_slot" | "client_form" | "confirmed">("service");
  const [selectedService, setSelectedService] = useState<ConsultationServiceItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [resolvedTimezone, setResolvedTimezone] = useState(creatorTimezone);
  const [gateways, setGateways] = useState<PublicGatewayOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<{
    booking: {
      id: string;
      clientName: string;
      startTime: string | Date;
      meetingType?: string | null;
      meetingLocation?: string | null;
      meetingUrl?: string | null;
      amountPaid?: number;
      currency?: string;
    };
    calendarUrls: { google?: string; outlook?: string; ics?: string };
    manageUrl?: string;
  } | null>(null);

  if (!services || services.length === 0) return null;

  const effectiveAccent = accentColor || "#4edea3";

  const handleSelectService = (service: ConsultationServiceItem) => {
    setSelectedService(service);
    setError(null);
    setStep("date_slot");
  };

  const handleSelectSlot = (slot: ConsultationSlot, meta: SlotsLoadedMeta) => {
    setSelectedSlot(slot);
    setResolvedTimezone(meta.creatorTimezone || creatorTimezone);
    setGateways(meta.gateways || []);
    setError(null);
    setStep("client_form");
  };

  const handleSubmitBooking = async (clientData: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientNotes?: string;
    clientTimezone: string;
    gatewayCode?: string;
  }) => {
    if (!selectedService || !selectedSlot) return;
    setError(null);

    if (isPreview) {
      setConfirmedData({
        booking: {
          id: "preview-booking",
          clientName: clientData.clientName,
          startTime: selectedSlot.startDateTime,
          meetingType: selectedService.meetingType || "ONLINE",
          meetingUrl: "https://meet.jit.si/ANLinks-Preview",
        },
        calendarUrls: { google: "#", outlook: "#", ics: "#" },
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
          startTime: new Date(selectedSlot.startDateTime).toISOString(),
          clientName: clientData.clientName,
          clientEmail: clientData.clientEmail,
          clientPhone: clientData.clientPhone,
          clientNotes: clientData.clientNotes,
          clientTimezone: clientData.clientTimezone,
          gatewayCode: clientData.gatewayCode,
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
        manageUrl: data.manageUrl,
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
    <div className="w-full my-3 p-4 sm:p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/30 backdrop-blur-md shadow-lg text-right text-on-surface">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${effectiveAccent}25`, color: effectiveAccent }}
        >
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-black text-on-surface">حجز موعد أو استشارة مباشرة</h3>
          <p className="text-[11px] text-on-surface-variant">اختر الباقة والوقت المناسب بالمنطقة الزمنية للمبدع</p>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-xl bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2">
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
          creatorTimezone={resolvedTimezone}
          onBack={() => setStep("service")}
          onSelectSlot={handleSelectSlot}
          accentColor={effectiveAccent}
          isPreview={isPreview}
        />
      )}

      {step === "client_form" && selectedService && selectedSlot && (
        <BookingClientForm
          service={selectedService}
          slot={selectedSlot}
          creatorTimezone={resolvedTimezone}
          gateways={gateways}
          onBack={() => setStep("date_slot")}
          onSubmit={handleSubmitBooking}
          isSubmitting={isSubmitting}
          accentColor={effectiveAccent}
          isPreview={isPreview}
        />
      )}

      {step === "confirmed" && confirmedData && (
        <BookingConfirmationStep
          booking={confirmedData.booking}
          calendarUrls={confirmedData.calendarUrls}
          manageUrl={confirmedData.manageUrl}
          creatorTimezone={resolvedTimezone}
          onReset={handleReset}
          accentColor={effectiveAccent}
        />
      )}
    </div>
  );
}
