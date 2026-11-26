"use client";

import React from "react";
import {
  Users,
  Search,
  Download,
  UserPlus,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";
import { SubscriberItem } from "../types/newsletter.types";
import { AppButton } from "@/shared/ui";

interface NewsletterSubscribersTableProps {
  subscribers: SubscriberItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenAddModal: () => void;
  onToggleStatus: (sub: SubscriberItem) => void;
  onDelete: (id: string) => void;
}

export function NewsletterSubscribersTable({
  subscribers,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenAddModal,
  onToggleStatus,
  onDelete,
}: NewsletterSubscribersTableProps) {
  const handleExportCsv = () => {
    window.open("/api/settings/subscribers?format=csv", "_blank");
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-5">
      {/* Table Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span>إدارة المشتركين</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary">
                {subscribers.length}
              </span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              قائمة جهات الاتصال المسجلة وإمكانية التعديل والإضافة والحذف
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={subscribers.length === 0}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            تصدير CSV
          </AppButton>
          <AppButton
            type="button"
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            إضافة مشترك
          </AppButton>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-outline absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="البحث بالبريد الإلكتروني أو الاسم..."
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pr-10 pl-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/25 shrink-0">
          {[
            { id: "ALL", label: "الكل" },
            { id: "ACTIVE", label: "النشطون" },
            { id: "UNSUBSCRIBED", label: "ملغي الاشتراك" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? "bg-primary/15 text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      {subscribers.length === 0 ? (
        <div className="p-8 rounded-2xl bg-surface-container-lowest/50 border border-dashed border-outline-variant/30 text-center space-y-1.5">
          <Mail className="w-6 h-6 text-on-surface-variant mx-auto opacity-50" />
          <p className="text-xs font-semibold text-on-surface-variant">
            لم يتم العثور على أي مشتركين يطابقون البحث
          </p>
          <p className="text-[11px] text-outline">
            يمكنك إضافة مشترك يدوياً أو مشاركة رابط صفحتك العامة لجمع المشتركين.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/40">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container-high/60 text-on-surface-variant">
              <tr>
                <th className="py-3 px-4 font-semibold">البريد الإلكتروني</th>
                <th className="py-3 px-4 font-semibold">الاسم</th>
                <th className="py-3 px-4 font-semibold">المصدر</th>
                <th className="py-3 px-4 font-semibold">الحالة</th>
                <th className="py-3 px-4 font-semibold">تاريخ الاشتراك</th>
                <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {subscribers.map((sub) => {
                const isActive = sub.status !== "UNSUBSCRIBED";
                return (
                  <tr key={sub.id} className="hover:bg-surface-container/40 transition">
                    <td className="py-3 px-4 font-mono text-on-surface" dir="ltr">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {sub.name || "—"}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-outline">
                      {sub.source === "manual" ? "إدخال يدوي" : "صفحة البايو"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isActive ? "نشط" : "ملغي"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant text-[11px]">
                      {new Date(sub.createdAt).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(sub)}
                          title={isActive ? "تعيين كملغي الاشتراك" : "تفعيل الاشتراك"}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition"
                        >
                          {isActive ? (
                            <XCircle className="w-4 h-4 text-amber-400/80 hover:text-amber-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-400/80 hover:text-emerald-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف المشترك (${sub.email}) نهائياً؟`)) {
                              onDelete(sub.id);
                            }
                          }}
                          title="حذف المشترك نهائياً"
                          className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
