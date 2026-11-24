"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { AdminPaymentsTab } from "../AdminPaymentsTab";

export function AdminGatewaysTab() {
  return (
    <div className="w-full">
      <AdminPaymentsTab
        initialSubTab="gateways"
        hideSubNav={true}
        icon={<CreditCard className="w-4 h-4" />}
        title="بوابات الدفع والتحصيل الإلكتروني"
        subtitle="إعداد وتفعيل مفاتيح API لبوابات الدفع المحلية والعالمية (Mada, Apple Pay, Stripe, Moyasar, PayPal)"
      />
    </div>
  );
}
