import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CreatorWebhooksCard } from "@/features/settings/components/profile/CreatorWebhooksCard";

describe("Creator Webhooks UI Suite", () => {
  it("renders webhooks card with all primary configuration fields", () => {
    const html = renderToStaticMarkup(<CreatorWebhooksCard />);

    // Header and guidance text
    expect(html).toContain("خطافات الويب الخارجية (Webhooks)");
    expect(html).toContain("ربط فوري لأحداث صفحتك مع Make أو Zapier أو n8n");

    // Endpoint URL input
    expect(html).toContain("عنوان الرابط الخارجي (Webhook Endpoint URL)");
    expect(html).toContain("placeholder=\"https://hook.eu1.make.com/...\"");

    // Event checkboxes
    expect(html).toContain("الأحداث المشترك بها (Events Trigger):");
    expect(html).toContain("جمع بيانات مشترك جديد (Lead)");
    expect(html).toContain("شراء منتج رقمي (Order Paid)");
    expect(html).toContain("تأكيد حجز استشارة (Booking Confirmed)");

    // Save button
    expect(html).toContain("حفظ التفعيل");
  });
});
