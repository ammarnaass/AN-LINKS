"use client";

import React from "react";

export function PayoutsTab() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              تحصيل مبيعات روابط
            </span>
            <span className="text-xs text-on-surface-variant block">الرصيد المتاح للسحب الفوري</span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl font-extrabold text-primary font-mono">4,850.00</span>
              <span className="text-lg text-on-surface font-semibold">ر.س</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-fixed transition"
          >
            طلب سحب الأرباح فوراً إلى حسابك
          </button>
        </div>

        <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30">
          <h3 className="font-bold text-on-surface text-base">بوابات الدفع لتحصيل مبيعات المتجر</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
              <div>
                <h4 className="font-bold text-xs text-on-surface">شبكة مدى للمدفوعات السعودية (MADA)</h4>
                <p className="text-[11px] text-on-surface-variant">عمولة تشغيلية منخفضة 1.0% + 1 ريال</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                نشطة ✓
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
              <div>
                <h4 className="font-bold text-xs text-on-surface">Apple Pay بنقرة واحدة</h4>
                <p className="text-[11px] text-on-surface-variant">معدل تحويل أعلى بنسبة +43% لمستخدمي iOS</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                نشطة ✓
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
              <div>
                <h4 className="font-bold text-xs text-on-surface">بطاقات الائتمان (Visa & Mastercard)</h4>
                <p className="text-[11px] text-on-surface-variant">قبول المدفوعات من كافة دول الخليج والعالم</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                نشطة ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
