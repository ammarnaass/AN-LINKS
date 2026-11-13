"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";

export function SubscriptionTab() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Pro Plan Bento Card */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">
                  الخطة النشطة
                </span>
                <span className="text-tertiary text-xs font-mono">سداد سنوي (خصم 20%)</span>
              </div>
              <h2 className="text-xl font-bold text-on-surface">باقة المحترفين المتكاملة Pro</h2>
              <p className="text-xs text-on-surface-variant">
                تجديد الحساب القادم في <strong className="text-on-surface">15 ديسمبر 2025</strong> مقابل{" "}
                <span className="font-mono text-primary font-bold">468.00 ر.س</span>
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-bold border border-white/5 flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <span>تغيير الخطة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Consumption Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-surface-container rounded-xl space-y-1.5 border border-outline-variant/20">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>الروابط النشطة</span>
                <span className="font-mono text-primary font-bold">28 / ∞</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "32%" }} />
              </div>
              <span className="text-[10px] text-outline block">غير محدودة في خطة Pro</span>
            </div>

            <div className="p-3 bg-surface-container rounded-xl space-y-1.5 border border-outline-variant/20">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>النطاق المخصص</span>
                <span className="font-mono text-primary font-bold">متصل</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
              </div>
              <span className="text-[10px] text-outline font-mono truncate block" dir="ltr">
                faisal-links.com
              </span>
            </div>

            <div className="p-3 bg-surface-container rounded-xl space-y-1.5 border border-outline-variant/20">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>معدل الفحص الذكي</span>
                <span className="font-mono text-tertiary font-bold">كل دقيقة</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: "85%" }} />
              </div>
              <span className="text-[10px] text-outline block">تنبيهات فورية 24/7</span>
            </div>
          </div>
        </div>

        {/* Payment Method on File */}
        <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                وسيلة الدفع المسجلة
              </span>
              <span className="text-primary text-xs font-semibold">تجديد تلقائي</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-surface-container to-surface-container-high shadow-inner space-y-3 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="font-bold text-xs text-on-surface">Al Rajhi mada Debit</span>
                </div>
                <span className="text-[11px] font-mono text-primary">mada</span>
              </div>
              <div className="font-mono text-base text-on-surface tracking-widest text-left" dir="ltr">
                •••• •••• •••• 9014
              </div>
              <div className="flex items-center justify-between text-on-surface-variant text-[10px] font-mono">
                <span>FAISAL A ALMANSOUR</span>
                <span>EXP: 09/27</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span className="text-xs text-on-surface">معاملاتك مشفّرة عبر PCI-DSS Level 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
        <h3 className="font-bold text-on-surface text-base">سجل الفواتير وعمليات السداد</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-on-surface-variant bg-surface-container/60">
                <th className="py-2.5 px-4 rounded-r-lg">رقم الفاتورة</th>
                <th className="py-2.5 px-4">تاريخ الإصدار</th>
                <th className="py-2.5 px-4">الباقة / التفاصيل</th>
                <th className="py-2.5 px-4">المبلغ شامل الضريبة</th>
                <th className="py-2.5 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr className="hover:bg-surface-container/40 transition">
                <td className="py-3 px-4 font-mono text-primary" dir="ltr">INV-2024-8891</td>
                <td className="py-3 px-4 text-on-surface">15 ديسمبر 2024</td>
                <td className="py-3 px-4 text-on-surface-variant">اشتراك سنوي في باقة Pro</td>
                <td className="py-3 px-4 font-mono text-on-surface font-bold">468.00 ر.س</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                    مدفوعة بنجاح
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container/40 transition">
                <td className="py-3 px-4 font-mono text-primary" dir="ltr">INV-2023-4410</td>
                <td className="py-3 px-4 text-on-surface">15 ديسمبر 2023</td>
                <td className="py-3 px-4 text-on-surface-variant">اشتراك سنوي في باقة Pro</td>
                <td className="py-3 px-4 font-mono text-on-surface font-bold">468.00 ر.س</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                    مدفوعة بنجاح
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

