"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { AdminSubscriptionsTab } from "../AdminSubscriptionsTab";

export function AdminQuotasTab() {
  return (
    <div className="w-full">
      <AdminSubscriptionsTab
        initialSubTab="quotas"
        hideSubNav={true}
        icon={<Sliders className="w-4 h-4" />}
        title="محددات وصلاحيات الباقات (Quotas)"
        subtitle="ضبط القيود الرقمية لعدد الروابط، النطاقات المخصصة، إزالة العلامة المائية، وبكسل التتبع"
      />
    </div>
  );
}
