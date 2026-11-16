"use client";

import React from "react";
import { AppInput } from "@/shared/ui";

export interface CouponDiscountData {
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxUses: string;
  maxUsesPerUser: number;
  validFrom: string;
  validUntil: string;
}

export const INITIAL_COUPON_DISCOUNT: CouponDiscountData = {
  discountType: "PERCENTAGE",
  discountValue: 10,
  maxUses: "",
  maxUsesPerUser: 1,
  validFrom: new Date().toISOString().split("T")[0],
  validUntil: "",
};

export interface CouponDiscountFieldsProps {
  data: CouponDiscountData;
  onChange: <K extends keyof CouponDiscountData>(key: K, value: CouponDiscountData[K]) => void;
}

export function CouponDiscountFields({ data, onChange }: CouponDiscountFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">نوع الخصم</label>
          <select
            value={data.discountType}
            onChange={(e) => onChange("discountType", e.target.value as "PERCENTAGE" | "FIXED_AMOUNT")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="PERCENTAGE">نسبة مئوية (%)</option>
            <option value="FIXED_AMOUNT">مبلغ ثابت (SAR)</option>
          </select>
        </div>
        <AppInput
          label={data.discountType === "PERCENTAGE" ? "نسبة الخصم (%)" : "المبلغ المخصوم (SAR)"}
          type="number" step="0.01" value={data.discountValue}
          onChange={(e) => onChange("discountValue", Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label="أقصى عدد استخدام كلي (اتركه فارغاً لغير محدود)" type="number" placeholder="غير محدود"
          value={data.maxUses} onChange={(e) => onChange("maxUses", e.target.value)}
        />
        <AppInput
          label="أقصى استخدام لكل عميل" type="number"
          value={data.maxUsesPerUser} onChange={(e) => onChange("maxUsesPerUser", Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppInput label="صالح من تاريخ" type="date" value={data.validFrom} onChange={(e) => onChange("validFrom", e.target.value)} />
        <AppInput label="صالح حتى تاريخ (اختياري)" type="date" value={data.validUntil} onChange={(e) => onChange("validUntil", e.target.value)} />
      </div>
    </>
  );
}

export default CouponDiscountFields;
