import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminNewsletterStatsCards } from "@/features/admin/components/newsletter/AdminNewsletterStatsCards";
import { AdminBroadcastHistoryTable } from "@/features/admin/components/newsletter/AdminBroadcastHistoryTable";

describe("Admin Newsletter UI Components Suite", () => {
  it("renders AdminNewsletterStatsCards with platform KPI figures", () => {
    const html = renderToStaticMarkup(
      <AdminNewsletterStatsCards
        stats={{
          totalSubscribers: 1540,
          activeSubscribers: 1490,
          totalBroadcasts: 28,
          deliveryRate: 100,
        }}
      />
    );

    expect(html).toContain("إجمالي المشتركين");
    expect(html).toContain("1540");
    expect(html).toContain("المشتركون النشطون");
    expect(html).toContain("1490");
    expect(html).toContain("حملات المنصة المرسلة");
    expect(html).toContain("28");
    expect(html).toContain("نسبة تسليم الرسائل");
    expect(html).toContain("100%");
  });

  it("renders AdminBroadcastHistoryTable with empty state and rows", () => {
    const emptyHtml = renderToStaticMarkup(
      <AdminBroadcastHistoryTable broadcasts={[]} />
    );
    expect(emptyHtml).toContain("لم يتم إرسال أي حملات بريدية مركزية حتى الآن");

    const filledHtml = renderToStaticMarkup(
      <AdminBroadcastHistoryTable
        broadcasts={[
          {
            id: "bc-1",
            subject: "إطلاق الميزات الجديدة لعام 2026",
            sentCount: 1200,
            status: "SENT",
            createdAt: new Date().toISOString(),
          },
        ]}
      />
    );
    expect(filledHtml).toContain("إطلاق الميزات الجديدة لعام 2026");
    expect(filledHtml).toContain("1200 مستلم");
    expect(filledHtml).toContain("مرسلة");
  });
});
