"use client";

import React, { useState } from "react";
import { AdminUserItem } from "../types/admin.types";
import { AppBadge, AppButton, AppInput } from "@/shared/ui";
import { Search, Shield, UserCheck, UserX, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import { AdminEditLocationModal } from "./AdminEditLocationModal";

export interface AdminUsersTabProps {
  users: AdminUserItem[];
  onToggleSuspend: (userId: string, currentSuspended: boolean) => void;
  onToggleRole: (userId: string, currentRole: string) => void;
  onUpdateLocation?: (userId: string, location: string | null) => Promise<void> | void;
  isUpdatingId?: string | null;
}

export function AdminUsersTab({
  users,
  onToggleSuspend,
  onToggleRole,
  onUpdateLocation,
  isUpdatingId,
}: AdminUsersTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "suspended" | "admin">("all");
  const [editingLocationUser, setEditingLocationUser] = useState<AdminUserItem | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === "active") return !u.isSuspended;
    if (filter === "suspended") return u.isSuspended;
    if (filter === "admin") return u.role === "ADMIN";
    return true;
  });

  return (
    <div className="space-y-4 font-cairo" dir="rtl">
      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex-1 max-w-md">
          <AppInput
            placeholder="ابحث بالاسم، المعرّف، أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container border border-outline-variant/20 text-xs">
          {[
            { key: "all", label: "الجميع" },
            { key: "active", label: "النشطين" },
            { key: "suspended", label: "الموقوفين" },
            { key: "admin", label: "المدراء" },
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

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container-low">
        <table className="w-full text-right text-xs">
          <thead className="bg-surface-container/80 text-on-surface-variant border-b border-outline-variant/30">
            <tr>
              <th className="py-3.5 px-4 font-bold">المستخدم</th>
              <th className="py-3.5 px-4 font-bold">البريد الإلكتروني</th>
              <th className="py-3.5 px-4 font-bold">مكان الإقامة</th>
              <th className="py-3.5 px-4 font-bold">الرتبة</th>
              <th className="py-3.5 px-4 font-bold">الروابط</th>
              <th className="py-3.5 px-4 font-bold">الحالة</th>
              <th className="py-3.5 px-4 font-bold text-left">إجراءات الإدارة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filtered.map((u) => {
              const isAdmin = u.role === "ADMIN";
              const isUpdating = isUpdatingId === u.id;

              return (
                <tr key={u.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/30">
                        {u.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-on-surface">{u.displayName}</span>
                          <a
                            href={`/${u.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-on-surface-variant hover:text-primary"
                            title="معاينة الصفحة العامة"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <span className="text-[11px] text-primary font-mono" dir="ltr">@{u.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono" dir="ltr">{u.email}</td>
                  <td className="py-3 px-4">
                    {u.location ? (
                      <button
                        type="button"
                        onClick={() => onUpdateLocation && setEditingLocationUser(u)}
                        className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors text-right group cursor-pointer"
                        title="انقر لتعديل مكان الإقامة"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-xs truncate max-w-[130px] group-hover:underline">
                          {u.location}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateLocation && setEditingLocationUser(u)}
                        className="flex items-center gap-1 text-[11px] text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
                        title="انقر لإضافة مكان الإقامة"
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>إضافة</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isAdmin ? (
                      <AppBadge variant="primary" size="sm" className="gap-1 font-bold">
                        <Shield className="w-3 h-3" />
                        <span>مشغّل</span>
                      </AppBadge>
                    ) : (
                      <AppBadge variant="neutral" size="sm">عميل</AppBadge>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-on-surface">{u.linksCount}</td>
                  <td className="py-3 px-4">
                    {u.isSuspended ? (
                      <AppBadge variant="error" size="sm" dot>موقوف</AppBadge>
                    ) : (
                      <AppBadge variant="success" size="sm" dot>نشط</AppBadge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <div className="inline-flex items-center gap-2">
                      <AppButton
                        variant={isAdmin ? "outline" : "secondary"}
                        size="sm"
                        isLoading={isUpdating}
                        onClick={() => onToggleRole(u.id, u.role)}
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        title={isAdmin ? "تنزيل إلى عميل عادي" : "ترقية إلى مدير النظام"}
                      >
                        {isAdmin ? "تنزيل لعميل" : "ترقية لمدير"}
                      </AppButton>

                      <AppButton
                        variant={u.isSuspended ? "outline" : "danger"}
                        size="sm"
                        isLoading={isUpdating}
                        onClick={() => onToggleSuspend(u.id, u.isSuspended)}
                        leftIcon={u.isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      >
                        {u.isSuspended ? "تنشيط" : "إيقاف"}
                      </AppButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {onUpdateLocation && (
        <AdminEditLocationModal
          isOpen={!!editingLocationUser}
          onClose={() => setEditingLocationUser(null)}
          user={editingLocationUser}
          onSave={onUpdateLocation}
        />
      )}
    </div>
  );
}
