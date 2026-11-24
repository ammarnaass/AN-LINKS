"use client";

import React from "react";
import { Coins } from "lucide-react";
import { AdminPaymentsTab } from "../AdminPaymentsTab";

export function AdminCurrenciesTab() {
  return (
    <div className="w-full">
      <AdminPaymentsTab
        initialSubTab="currencies"
        hideSubNav={true}
        icon={<Coins className="w-4 h-4" />}
        title="العملات الرسمية وأسعار الصرف"
        subtitle="تحديد العملة الأساسية للمنصة وضبط أسعار الصرف للريال السعودي، الدرهم، الدولار، واليورو"
      />
    </div>
  );
}
