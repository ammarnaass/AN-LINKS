"use client";

import React from "react";
import { PlatformDTO } from "@/features/links/types/links.types";
import { AppBadge, SocialIcons } from "@/shared/ui";
import { Edit2, Trash2, Power, RefreshCw } from "lucide-react";

export interface PlatformsTableProps {
  platforms: PlatformDTO[];
  isLoading: boolean;
  actionLoadingId: string | null;
  onToggleEnable: (platform: PlatformDTO) => void;
  onEdit: (platform: PlatformDTO) => void;
  onDelete: (platform: PlatformDTO) => void;
}

export function PlatformsTable({
  platforms,
  isLoading,
  actionLoadingId,
  onToggleEnable,
  onEdit,
  onDelete,
}: PlatformsTableProps) {
  if (isLoading && platforms.length === 0) {
    return (
      <div className="py-12 text-center text-on-surface-variant font-cairo">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        <span>جارٍ تحميل دليل المنصات...</span>
      </div>
    );
  }

  if (platforms.length === 0) {
    return (
      <div className="py-12 text-center text-on-surface-variant font-cairo">
        لا توجد منصات مسجلة حالياً.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full font-cairo" dir="rtl">
      <table className="w-full min-w-[700px] text-right text-xs">
        <thead className="bg-surface-container/60 text-on-surface-variant border-b border-outline-variant/30">
          <tr>
            <th className="py-3 px-4 font-bold">المنصة</th>
            <th className="py-3 px-4 font-bold">الرمز (Slug)</th>
            <th className="py-3 px-4 font-bold">الفئة</th>
            <th className="py-3 px-4 font-bold">نمط النطاق</th>
            <th className="py-3 px-4 font-bold">الروابط</th>
            <th className="py-3 px-4 font-bold">الحالة</th>
            <th className="py-3 px-4 font-bold text-left">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {platforms.map((p) => (
            <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: p.brandColor || "#4EDEA3" }}
                  >
                    <SocialIcons network={p.slug} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{p.nameAr}</span>
                    <span className="text-[11px] text-on-surface-variant">{p.nameEn}</span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-primary" dir="ltr">
                {p.slug}
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-[11px] text-on-surface-variant font-medium">
                  {p.category}
                </span>
              </td>
              <td className="py-3 px-4 font-mono text-[11px] text-on-surface-variant max-w-[150px] truncate" dir="ltr" title={p.domainPattern}>
                {p.domainPattern || "—"}
              </td>
              <td className="py-3 px-4 font-bold text-on-surface">
                {p._count?.links ?? 0}
              </td>
              <td className="py-3 px-4">
                {p.isEnabled ? (
                  <AppBadge variant="success" size="sm" dot>نشطة</AppBadge>
                ) : (
                  <AppBadge variant="neutral" size="sm" dot>معطلة</AppBadge>
                )}
              </td>
              <td className="py-3 px-4 text-left">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleEnable(p)}
                    disabled={actionLoadingId === p.id}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      p.isEnabled
                        ? "text-emerald-400 hover:bg-emerald-500/10"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                    title={p.isEnabled ? "تعطيل المنصة" : "تفعيل المنصة"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    title="تعديل المنصة"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    disabled={actionLoadingId === p.id}
                    className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
                    title="حذف المنصة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
