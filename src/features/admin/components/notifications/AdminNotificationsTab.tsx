"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Plus, RefreshCw } from "lucide-react";
import {
  SystemNotificationItem,
  NotificationPayload,
} from "@/features/notifications";
import { NotificationStatsCards } from "./NotificationStatsCards";
import { NotificationFormModal } from "./NotificationFormModal";
import { NotificationTable } from "./NotificationTable";

export function AdminNotificationsTab() {
  const [notifications, setNotifications] = useState<SystemNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SystemNotificationItem | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSave = async (payload: NotificationPayload) => {
    if (editingItem) {
      const res = await fetch(`/api/admin/notifications/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("تعذر تحديث الإشعار");
    } else {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("تعذر إنشاء الإشعار");
    }
    await fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإشعار نهائياً؟")) return;
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleToggleActive = async (item: SystemNotificationItem) => {
    const nextState = !item.isActive;
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isActive: nextState } : n))
    );
    try {
      await fetch(`/api/admin/notifications/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
    } catch {
      await fetchNotifications();
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black text-on-surface">
              نظام الإشعارات المباشرة والتنبيهات المستطيلة
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            إدارة المودل العائم في يسار الموقع وتخصيص الألوان لكل نوع إشعار والجمهور المستهدف
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchNotifications}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء إشعار جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <NotificationStatsCards notifications={notifications} />

      {/* Notifications Table */}
      <NotificationTable
        notifications={notifications}
        isLoading={isLoading}
        onEdit={(item) => {
          setEditingItem(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Modal */}
      {isModalOpen && (
        <NotificationFormModal
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
