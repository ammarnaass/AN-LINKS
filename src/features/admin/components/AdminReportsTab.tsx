"use client";

import React, { useState } from "react";
import { AdminReportItem } from "../types/admin.types";
import { AdminReportsTable } from "./AdminReportsTable";
import { AlertTriangle } from "lucide-react";

export interface AdminReportsTabProps {
  reports: AdminReportItem[];
  onUpdateStatus: (reportId: string, status: "RESOLVED" | "DISMISSED") => void;
  isUpdatingId?: string | null;
}

export function AdminReportsTab({
  reports,
  onUpdateStatus,
  isUpdatingId,
}: AdminReportsTabProps) {
  const [filter, setFilter] = useState<"all" | "PENDING" | "RESOLVED" | "DISMISSED">("all");

  const filtered = reports.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-4 font-cairo" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-base font-bold text-on-surface">إدارة البلاغات ومكافحة الانتهاكات</h3>
            <p className="text-xs text-on-surface-variant">مراجعة تقارير المجتمع واتخاذ إجراءات الحظر أو الإعفاء</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container border border-outline-variant/20 text-xs">
          {[
            { key: "all", label: "الجميع" },
            { key: "PENDING", label: `قيد الانتظار (${pendingCount})` },
            { key: "RESOLVED", label: "تم المعالجة" },
            { key: "DISMISSED", label: "مستبعدة" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === f.key
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <AdminReportsTable
        reports={filtered}
        onUpdateStatus={onUpdateStatus}
        isUpdatingId={isUpdatingId}
      />
    </div>
  );
}
