"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Layers, Clock, RefreshCw } from "lucide-react";
import {
  BookingOverviewStats,
  ConsultationServiceItem,
  AvailabilityRuleInput,
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
    currency: "SAR",
  });
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [services, setServices] = useState<ConsultationServiceItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRuleInput[]>([]);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments/overview");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setBookings(data.bookings);
          setServices(data.services);
          setAvailability(data.availability);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleStatusChange = async (id: string, status: "CONFIRMED" | "CANCELLED") => {
    const res = await fetch(`/api/appointments/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchOverview();
    }
  };

  const handleSaveAvailability = async (rules: AvailabilityRuleInput[]) => {
    const res = await fetch("/api/appointments/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
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
            استوديو حجز المواعيد والخدمات
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            إدارة جلساتك الاستشارية، أوقات العمل، والاجتماعات الافتراضية مع العملاء.
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
          { id: "availability", label: "أوقات وتوفر العمل", icon: Clock },
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
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "services" && (
          <ServicesCatalogTab
            services={services}
            onRefresh={fetchOverview}
          />
        )}
        {activeTab === "availability" && (
          <AvailabilityRulesTab
            initialRules={availability}
            onSave={handleSaveAvailability}
          />
        )}
      </div>
    </div>
  );
}
