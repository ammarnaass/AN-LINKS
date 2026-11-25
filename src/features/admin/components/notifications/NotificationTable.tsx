"use client";

import React from "react";
import {
  Bell,
  Edit2,
  Trash2,
  Eye,
  MousePointerClick,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  SystemNotificationItem,
  NOTIFICATION_TYPE_MAP,
  NOTIFICATION_TARGET_OPTIONS,
} from "@/features/notifications";

interface NotificationTableProps {
  notifications: SystemNotificationItem[];
  isLoading: boolean;
  onEdit: (item: SystemNotificationItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: SystemNotificationItem) => void;
}

export function NotificationTable({
  notifications,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: NotificationTableProps) {
  const getTargetLabel = (target: string) => {
    const found = NOTIFICATION_TARGET_OPTIONS.find((t) => t.value === target);
    return found ? found.labelAr : target;
  };

  return (
    <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface">سجل الإشعارات والتنبيهات المباشرة</h3>
        <span className="text-xs text-outline">{notifications.length} إشعار مسجل</span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-on-surface-variant">جاري تحميل الإشعارات...</div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container mx-auto flex items-center justify-center text-outline">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-on-surface">لا توجد إشعارات منشورة حالياً</p>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            اضغط على زر &quot;إنشاء إشعار جديد&quot; لبدء بث إعلانات وعروض وتنبيهات مباشرة للمستخدمين والزوار.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
              <tr>
                <th className="p-3.5 font-bold">النوع واللون</th>
                <th className="p-3.5 font-bold">عنوان الإشعار وتفاصيله</th>
                <th className="p-3.5 font-bold">الجمهور المستهدف</th>
                <th className="p-3.5 font-bold">الحالة</th>
                <th className="p-3.5 font-bold text-center">المشاهدات والنقر</th>
                <th className="p-3.5 font-bold text-left pl-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {notifications.map((item) => {
                const typeMeta = NOTIFICATION_TYPE_MAP[item.type] || NOTIFICATION_TYPE_MAP.ANNOUNCEMENT;
                return (
                  <tr key={item.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase"
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}15`,
                          }}
                        >
                          {typeMeta.labelAr}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="font-bold text-on-surface truncate">{item.title}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{item.message}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/30 text-[11px] font-medium">
                        {getTargetLabel(item.target)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          item.isActive
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            : "bg-surface-container text-outline border border-outline-variant/30"
                        }`}
                      >
                        {item.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{item.isActive ? "نشط" : "معطل"}</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-3 text-[11px] font-mono">
                        <span className="flex items-center gap-1 text-on-surface-variant" title="المشاهدات">
                          <Eye className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{item.viewCount}</span>
                        </span>
                        <span className="flex items-center gap-1 text-on-surface-variant" title="النقرات">
                          <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item.clickCount}</span>
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-left pl-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                          title="تعديل الإشعار"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                          title="حذف الإشعار"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
