"use client";

import React from "react";
import { PayoutRequestDTO } from "../../hooks/useSettingsPayouts";

interface PayoutHistoryTableProps {
  history: PayoutRequestDTO[];
}

export function PayoutHistoryTable({ history }: PayoutHistoryTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TRANSFERRED":
        return <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">تم التحويل ✓</span>;
      case "APPROVED":
        return <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold">معتمد للمصرف</span>;
      case "REJECTED":
        return <span className="px-2 py-0.5 rounded-full bg-error/20 text-error text-[10px] font-bold">مرفوض</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">قيد المراجعة</span>;
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <h3 className="font-bold text-on-surface text-base">سجل طلبات التحويل البنكي</h3>
          <p className="text-xs text-on-surface-variant">تتبع حالة الحوالات المالية والأرباح المسحوبة</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-6 text-center text-xs text-on-surface-variant">لا توجد طلبات سحب سابقة</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 text-on-surface-variant">
                <th className="pb-3 font-semibold">تاريخ الطلب</th>
                <th className="pb-3 font-semibold">المبلغ</th>
                <th className="pb-3 font-semibold">العملة</th>
                <th className="pb-3 font-semibold">حالة الطلب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {history.map((req) => (
                <tr key={req.id} className="hover:bg-surface-container/50 transition">
                  <td className="py-3 text-on-surface font-mono">{new Date(req.requestedAt).toLocaleDateString("ar-SA")}</td>
                  <td className="py-3 font-mono font-bold text-on-surface">{req.amount.toFixed(2)}</td>
                  <td className="py-3 text-on-surface-variant">{req.currency}</td>
                  <td className="py-3">{getStatusBadge(req.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
