import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppointmentsStatsCards } from "@/features/appointments/components/AppointmentsStatsCards";
import { BookingServiceStep } from "@/features/bio/components/booking/BookingServiceStep";
import { DASHBOARD_NAV_ITEMS } from "@/features/dashboard";

describe("Appointments UI Components Unit Tests", () => {
  it("renders AppointmentsStatsCards with accurate KPI counters", () => {
    const stats = {
      totalBookings: 12,
      upcomingConfirmed: 4,
      completedBookings: 8,
      totalRevenue: 2400,
      currency: "SAR",
    };

    const html = renderToStaticMarkup(<AppointmentsStatsCards stats={stats} />);

    expect(html).toContain("إجمالي المواعيد");
    expect(html).toContain("12");
    expect(html).toContain("المواعيد القادمة المؤكدة");
    expect(html).toContain("4");
    expect(html).toContain("الجلسات المكتملة");
    expect(html).toContain("8");
    expect(html).toContain("2,400 SAR");
  });

  it("includes 'حجز المواعيد' in dashboard sidebar navigation items", () => {
    const bookingsItem = DASHBOARD_NAV_ITEMS.find(
      (item) => item.href === "/dashboard/bookings"
    );
    expect(bookingsItem).toBeDefined();
    expect(bookingsItem?.label).toBe("حجز المواعيد");
  });

  it("renders BookingServiceStep with services and prices", () => {
    const services = [
      {
        id: "srv-1",
        title: "استشارة تسويقية 1:1",
        description: "جلسة تحليل استراتيجية متقدمة",
        durationMinutes: 45,
        price: 350,
        currency: "SAR",
        isActive: true,
      },
    ];

    const html = renderToStaticMarkup(
      <BookingServiceStep
        services={services}
        onSelectService={() => {}}
        accentColor="#4edea3"
      />
    );

    expect(html).toContain("استشارة تسويقية 1:1");
    expect(html).toContain("350 SAR");
    expect(html).toContain("45 دقيقة");
  });
});
