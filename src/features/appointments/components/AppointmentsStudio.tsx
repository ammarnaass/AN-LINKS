"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Layers, Clock, RefreshCw } from "lucide-react";
import {
  BookingOverviewStats,
  ConsultationServiceItem,
  AvailabilityRuleInput,
  AvailabilityExceptionItem,
} from "../types/appointments.types";
import { AppointmentsStatsCards } from "./AppointmentsStatsCards";
import { BookingsListTab, BookingRecord } from "./BookingsListTab";
import { ServicesCatalogTab } from "./ServicesCatalogTab";
import { AvailabilityRulesTab } from "./AvailabilityRulesTab";

export function AppointmentsStudio() {
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "availability">("bookings");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingOverviewStats>({
    totalBookings: 0,
    upcomingConfirmed: 0,
    completedBookings: 0,
    totalRevenue: 0,
    netRevenue: 0,
    currency: "SAR",
  });
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [services, setServices] = useState<ConsultationServiceItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRuleInput[]>([]);
  const [timezone, setTimezone] = useState("Asia/Riyadh");
  const [exceptions, setExceptions] = useState<AvailabilityExceptionItem[]>([]);
  const [quota, setQuota] = useState({
    allowAppointments: true,
    maxServices: 100,
    allowPaidServices: true,
    storeCommissionRate: 5.0,
  });

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments/overview");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setBookings(data.bookings || []);
          setServices(data.services || []);
          setAvailability(data.availability || []);
          if (data.timezone) setTimezone(data.timezone);
          setExceptions(data.exceptions || []);
          if (data.quota) setQuota(data.quota);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleStatusChange = async (
    id: string,
    status: "COMPLETED" | "CANCELLED",
    cancelReason?: string
  ) => {
    const res = await fetch(`/api/appointments/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, cancelReason }),
    });
    if (res.ok) {
      await fetchOverview();
    }
  };

  const handleSaveAvailability = async (
    rules: AvailabilityRuleInput[],
    nextTimezone: string
  ) => {
    const res = await fetch("/api/appointments/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules, timezone: nextTimezone }),
    });
    if (res.ok) {
      await fetchOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
            استوديو تجارة الخدمات وحجز المواعيد
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            أدر باقات الاستشارات، أوقات العمل، الإجازات الاستثنائية، والمدفوعات المباشرة من مكان واحد.
          </p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="p-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container self-start sm:self-auto transition-all"
          title="تحديث البيانات"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
        </button>
      </div>

      <AppointmentsStatsCards stats={stats} />

      <div className="border-b border-outline-variant/20 flex gap-2 overflow-x-auto">
        {[
          { id: "bookings", label: "سجل المواعيد المحجوزة", icon: Calendar },
          { id: "services", label: "باقات الخدمات والاستشارات", icon: Layers },
          { id: "availability", label: "أوقات العمل والإجازات", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {activeTab === "bookings" && (
          <BookingsListTab
            bookings={bookings}
            creatorTimezone={timezone}
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "services" && (
          <ServicesCatalogTab
            services={services}
            quota={quota}
            onRefresh={fetchOverview}
          />
        )}
        {activeTab === "availability" && (
          <AvailabilityRulesTab
            initialRules={availability}
            initialTimezone={timezone}
            exceptions={exceptions}
            onSave={handleSaveAvailability}
            onRefresh={fetchOverview}
          />
        )}
      </div>
    </div>
  );
}
