"use client";

import React from "react";
import { AdminUserItem } from "../types/admin.types";
import { AppBadge, AppButton } from "@/shared/ui";
import { UserX, UserCheck, Shield } from "lucide-react";

export interface AdminUsersTableProps {
  users: AdminUserItem[];
  onToggleSuspend: (userId: string, currentSuspended: boolean) => void;
  isUpdatingId?: string | null;
}

export function AdminUsersTable({
  users,
  onToggleSuspend,
  isUpdatingId,
}: AdminUsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-on-surface-variant font-cairo">
        لا يوجد مستخدمين مطابقين لمعايير البحث.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full font-cairo" dir="rtl">
      <table className="w-full min-w-[640px] text-right text-xs">
        <thead className="bg-surface-container/60 text-on-surface-variant border-b border-outline-variant/30">
          <tr>
            <th className="py-3 px-4 font-bold">المستخدم</th>
            <th className="py-3 px-4 font-bold">البريد</th>
            <th className="py-3 px-4 font-bold">الصلاحية</th>
            <th className="py-3 px-4 font-bold">الروابط</th>
            <th className="py-3 px-4 font-bold">الحالة</th>
            <th className="py-3 px-4 font-bold text-left">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-surface-container/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">{u.displayName}</span>
                  <span className="text-[11px] text-primary" dir="ltr">@{u.username}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-on-surface-variant font-mono" dir="ltr">
                {u.email}
              </td>
              <td className="py-3 px-4">
                {u.role === "ADMIN" ? (
                  <AppBadge variant="primary" size="sm" className="gap-1">
                    <Shield className="w-3 h-3" />
                    <span>مشغّل</span>
                  </AppBadge>
                ) : (
                  <AppBadge variant="neutral" size="sm">عميل</AppBadge>
                )}
              </td>
              <td className="py-3 px-4 font-bold text-on-surface">
                {u.linksCount}
              </td>
              <td className="py-3 px-4">
                {u.isSuspended ? (
                  <AppBadge variant="error" size="sm" dot>موقوف</AppBadge>
                ) : (
                  <AppBadge variant="success" size="sm" dot>نشط</AppBadge>
                )}
              </td>
              <td className="py-3 px-4 text-left">
                {u.role !== "ADMIN" && (
                  <AppButton
                    variant={u.isSuspended ? "outline" : "danger"}
                    size="sm"
                    isLoading={isUpdatingId === u.id}
                    onClick={() => onToggleSuspend(u.id, u.isSuspended)}
                    leftIcon={u.isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                  >
                    {u.isSuspended ? "تنشيط" : "إيقاف"}
                  </AppButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

