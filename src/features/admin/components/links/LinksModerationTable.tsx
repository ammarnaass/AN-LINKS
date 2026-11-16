"use client";

import React from "react";
import { AdminLinkItem } from "@/features/admin/types/admin.types";
import { AppBadge, AppButton, SocialIcons } from "@/shared/ui";
import {
  Pin,
  Archive,
  Power,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";

export interface LinksModerationTableProps {
  links: AdminLinkItem[];
  isLoading: boolean;
  actionLoadingId: string | null;
  onUpdateLink: (
    id: string,
    patch: { isActive?: boolean; isPinned?: boolean; isArchived?: boolean }
  ) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function LinksModerationTable({
  links,
  isLoading,
  actionLoadingId,
  onUpdateLink,
  page,
  totalPages,
  onPageChange,
}: LinksModerationTableProps) {
  if (isLoading && links.length === 0) {
    return (
      <div className="py-12 text-center text-on-surface-variant font-cairo">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        <span>جارٍ تحميل الروابط...</span>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="py-12 text-center text-on-surface-variant font-cairo">
        لا توجد روابط مطابقة لمعايير البحث.
      </div>
    );
  }

  return (
    <div className="font-cairo" dir="rtl">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[760px] text-right text-xs">
          <thead className="bg-surface-container/60 text-on-surface-variant border-b border-outline-variant/30">
            <tr>
              <th className="py-3 px-4 font-bold">عنوان الرابط والوجهة</th>
              <th className="py-3 px-4 font-bold">صانع المحتوى</th>
              <th className="py-3 px-4 font-bold">المنصة</th>
              <th className="py-3 px-4 font-bold">النقرات</th>
              <th className="py-3 px-4 font-bold">الحالة</th>
              <th className="py-3 px-4 font-bold text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-surface-container/30 transition-colors">
                <td className="py-3 px-4 max-w-[240px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface truncate" title={link.title}>
                      {link.title}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-mono truncate"
                      dir="ltr"
                      title={link.url}
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">
                      {link.user?.name || link.user?.username || "مستخدم"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono" dir="ltr">
                      @{link.user?.username || link.user?.email}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {link.platform ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/20">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: link.platform.brandColor }}
                      />
                      <SocialIcons network={link.platform.slug} className="w-3 h-3 text-on-surface" />
                      <span className="text-[11px] font-semibold">{link.platform.nameAr}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-on-surface-variant">رابط مخصص</span>
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-on-surface font-mono">
                  {link.clicksCount.toLocaleString("ar-SA")}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 flex-wrap">
                    {link.isActive ? (
                      <AppBadge variant="success" size="sm" dot>نشط</AppBadge>
                    ) : (
                      <AppBadge variant="error" size="sm" dot>معطل</AppBadge>
                    )}
                    {link.isPinned && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                        مثبت
                      </span>
                    )}
                    {link.isArchived && (
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">
                        مؤرشف
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-left">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateLink(link.id, { isActive: !link.isActive })}
                      disabled={actionLoadingId === link.id}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        link.isActive
                          ? "text-emerald-400 hover:bg-emerald-500/10"
                          : "text-error hover:bg-error/10"
                      }`}
                      title={link.isActive ? "تعطيل الرابط" : "تفعيل الرابط"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateLink(link.id, { isPinned: !link.isPinned })}
                      disabled={actionLoadingId === link.id}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        link.isPinned
                          ? "text-amber-400 hover:bg-amber-500/10"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                      title={link.isPinned ? "إلغاء التثبيت" : "تثبيت الرابط"}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateLink(link.id, { isArchived: !link.isArchived })}
                      disabled={actionLoadingId === link.id}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        link.isArchived
                          ? "text-primary hover:bg-primary/10"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                      title={link.isArchived ? "إلغاء الأرشفة" : "أرشفة الرابط"}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-outline-variant/20 bg-surface-container-lowest text-xs">
          <span className="text-on-surface-variant">
            صفحة {page} من {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <AppButton
              size="sm"
              variant="ghost"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </AppButton>
            <AppButton
              size="sm"
              variant="ghost"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
}
