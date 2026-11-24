"use client";

import React from "react";
import { Tag } from "lucide-react";
import { AdminSubscriptionsTab } from "../AdminSubscriptionsTab";

export function AdminCouponsTab() {
  return (
    <div className="w-full">
      <AdminSubscriptionsTab
        initialSubTab="coupons"
        hideSubNav={true}
        icon={<Tag className="w-4 h-4" />}
        title="أكواد وقسائم الخصم الترويجية"
        subtitle="إصدار كوبونات التخفيض، نسبة الخصم، عدد مرات الاستخدام، وتواريخ انتهاء الصلاحية"
      />
    </div>
  );
}
