"use client";

import React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { AppCard, AppBadge } from "@/shared/ui";

export interface AdminBroadcastItem {
  id: string;
  subject: string;
  sentCount: number;
  status: string;
  createdAt: string;
}

export function AdminBroadcastHistoryTable({ broadcasts }: { broadcasts: AdminBroadcastItem[] }) {
  return (
    <AppCard className="p-6 space-y-4 border-outline-variant/30 bg-surface-container-low">
      <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          <span>سجل الحملات البريدية المرسلة عبر المنصة</span>
        </h3>
        <span className="text-xs text-on-surface-variant">{broadcasts.length} حملة</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-outline-variant/20 text-on-surface-variant">
              <th className="py-2.5 px-3">عنوان الحملة</th>
              <th className="py-2.5 px-3">المستلمين</th>
              <th className="py-2.5 px-3">التاريخ والوقت</th>
              <th className="py-2.5 px-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {broadcasts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-on-surface-variant">
                  لم يتم إرسال أي حملات بريدية مركزية حتى الآن
                </td>
              </tr>
            ) : (
              broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container/50">
                  <td className="py-2 px-3 font-semibold">{b.subject}</td>
                  <td className="py-2 px-3 font-mono text-primary">{b.sentCount} مستلم</td>
                  <td className="py-2 px-3 text-on-surface-variant font-mono">
                    {new Date(b.createdAt).toLocaleDateString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-3">
                    <AppBadge variant="success">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                      <span>مرسلة</span>
                    </AppBadge>
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
