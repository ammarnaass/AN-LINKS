"use client";

import React from "react";
import { AdminReportItem } from "../types/admin.types";
import { AppBadge, AppButton } from "@/shared/ui";
import { CheckCircle2, XCircle } from "lucide-react";

export interface AdminReportsTableProps {
  reports: AdminReportItem[];
  onUpdateStatus: (reportId: string, status: "RESOLVED" | "DISMISSED") => void;
  isUpdatingId?: string | null;
}

export function AdminReportsTable({
  reports,
  onUpdateStatus,
  isUpdatingId,
}: AdminReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-on-surface-variant font-cairo">
        لا توجد بلاغات مسجلة حالياً.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full font-cairo" dir="rtl">
      <table className="w-full text-right text-xs">
        <thead className="bg-surface-container/60 text-on-surface-variant border-b border-outline-variant/30">
          <tr>
            <th className="py-3 px-4 font-bold">الحساب المبلغ عنه</th>
            <th className="py-3 px-4 font-bold">السبب</th>
            <th className="py-3 px-4 font-bold">التفاصيل</th>
            <th className="py-3 px-4 font-bold">الحالة</th>
            <th className="py-3 px-4 font-bold text-left">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {reports.map((r) => (
            <tr key={r.id} className="hover:bg-surface-container/30 transition-colors">
              <td className="py-3 px-4 font-bold text-primary" dir="ltr">
                @{r.username}
              </td>
              <td className="py-3 px-4 font-semibold text-on-surface">
                {r.reason}
              </td>
              <td className="py-3 px-4 text-on-surface-variant max-w-[280px] truncate" title={r.details || ""}>
                {r.details || "—"}
              </td>
              <td className="py-3 px-4">
                {r.status === "PENDING" ? (
                  <AppBadge variant="warning" size="sm" dot>قيد الانتظار</AppBadge>
                ) : r.status === "RESOLVED" ? (
                  <AppBadge variant="success" size="sm">تم الحل</AppBadge>
                ) : (
                  <AppBadge variant="neutral" size="sm">مستبعد</AppBadge>
                )}
              </td>
              <td className="py-3 px-4 text-left">
                {r.status === "PENDING" && (
                  <div className="flex items-center gap-1.5 justify-end">
                    <AppButton
                      variant="primary"
                      size="sm"
                      isLoading={isUpdatingId === r.id}
                      onClick={() => onUpdateStatus(r.id, "RESOLVED")}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      حل
                    </AppButton>
                    <AppButton
                      variant="ghost"
                      size="sm"
                      isLoading={isUpdatingId === r.id}
                      onClick={() => onUpdateStatus(r.id, "DISMISSED")}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      تجاهل
                    </AppButton>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

