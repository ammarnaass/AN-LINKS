"use client";

import React from "react";
import { Package } from "lucide-react";
import { AdminSubscriptionsTab } from "../AdminSubscriptionsTab";

export function AdminPlansTab() {
  return (
    <div className="w-full">
      <AdminSubscriptionsTab
        initialSubTab="plans"
        hideSubNav={true}
        icon={<Package className="w-4 h-4" />}
        title="خطط وباقات اشتراكات المنصة"
        subtitle="إنشاء وإدارة باقات الاشتراك (Free, Pro, Business) والأسعار الشهرية والسنوية ومميزاتها"
      />
    </div>
  );
}
