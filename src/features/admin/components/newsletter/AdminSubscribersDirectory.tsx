"use client";

import React, { useState } from "react";
import { Download, Search, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { AppCard, AppButton, AppBadge } from "@/shared/ui";

export interface AdminSubscriberItem {
  id: string;
  email: string;
  name: string | null;
  creatorId: string;
  status: string;
  createdAt: string;
}

export function AdminSubscribersDirectory({
  subscribers,
  onDelete,
  onToggleStatus,
}: {
  subscribers: AdminSubscriberItem[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "UNSUBSCRIBED">("ALL");

  const filtered = subscribers.filter((s) => {
    const matchSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "ALL" ? true : s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCsv = () => {
    const headers = "ID,Email,Name,CreatorId,Status,CreatedAt\n";
    const rows = filtered
      .map((s) => `"${s.id}","${s.email}","${s.name || ""}","${s.creatorId}","${s.status}","${s.createdAt}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `platform_subscribers_${Date.now()}.csv`;
    link.click();
  };

  return (
    <AppCard className="p-6 space-y-4 border-outline-variant/30 bg-surface-container-low">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
        <div>
          <h3 className="text-sm font-bold text-on-surface">دليل المشتركين في المنصة</h3>
          <p className="text-xs text-on-surface-variant">استعراض كافة جهات الاتصال المسجلة عبر صفحات صناع المحتوى</p>
        </div>
        <AppButton variant="outline" size="sm" onClick={exportCsv} leftIcon={<Download className="w-3.5 h-3.5" />}>
          تصدير CSV ({filtered.length})
        </AppButton>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-on-surface-variant absolute right-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالبريد الإلكتروني أو الاسم..."
            className="w-full bg-surface-container pr-9 pl-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface outline-none"
        >
          <option value="ALL">كافة الحالات</option>
          <option value="ACTIVE">نشط فقط</option>
          <option value="UNSUBSCRIBED">ملغى الاشتراك</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-outline-variant/20 text-on-surface-variant">
              <th className="py-2.5 px-3">البريد الإلكتروني</th>
              <th className="py-2.5 px-3">الاسم</th>
              <th className="py-2.5 px-3">تاريخ الانضمام</th>
              <th className="py-2.5 px-3">الحالة</th>
              <th className="py-2.5 px-3 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-on-surface-variant">لا توجد سجلات مطابقة للبحث</td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container/50">
                  <td className="py-2 px-3 font-mono text-left" dir="ltr">{s.email}</td>
                  <td className="py-2 px-3">{s.name || "-"}</td>
                  <td className="py-2 px-3 text-on-surface-variant font-mono">
                    {new Date(s.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="py-2 px-3">
                    <AppBadge variant={s.status === "ACTIVE" ? "success" : "neutral"}>
                      {s.status === "ACTIVE" ? "نشط" : "ملغى"}
                    </AppBadge>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(s.id, s.status)}
                        className="p-1 rounded text-on-surface-variant hover:text-primary"
                        title="تغيير الحالة"
                      >
                        {s.status === "ACTIVE" ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(s.id)}
                        className="p-1 rounded text-error/80 hover:text-error"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppCard>
  );
}
