"use client";

import React, { useState, useEffect } from "react";
import { Mail, Send, RefreshCw } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { AdminNewsletterStatsCards, AdminNewsletterStats } from "./AdminNewsletterStatsCards";
import { AdminSubscribersDirectory, AdminSubscriberItem } from "./AdminSubscribersDirectory";
import { AdminSystemBroadcastModal } from "./AdminSystemBroadcastModal";
import { AdminBroadcastHistoryTable, AdminBroadcastItem } from "./AdminBroadcastHistoryTable";

export function AdminNewsletterTab() {
  const [stats, setStats] = useState<AdminNewsletterStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalBroadcasts: 0,
    deliveryRate: 100,
  });
  const [subscribers, setSubscribers] = useState<AdminSubscriberItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<AdminBroadcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter");
      const json = await res.json();
      if (json.success) {
        if (json.stats) setStats(json.stats);
        if (json.subscribers) setSubscribers(json.subscribers);
        if (json.broadcasts) setBroadcasts(json.broadcasts);
      }
    } catch {
      // ignore network errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendBroadcast = async (data: { subject: string; content: string; targetAudience: string }) => {
    setIsSending(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "broadcast", ...data }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage(json.message);
        setTimeout(() => setMessage(null), 4000);
        fetchData();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشترك نهائياً؟")) return;
    const res = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-subscriber", subscriberId }),
    });
    if (res.ok) fetchData();
  };

  const handleToggleStatus = async (subscriberId: string, currentStatus: string) => {
    const res = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-status", subscriberId, currentStatus }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-on-surface">نظام إدارة النشرة البريدية وحملات المنصة</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              مراقبة وإدارة مشتركي كافة صناع المحتوى وإرسال حملات مركزية للمنصة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AppButton variant="outline" size="sm" onClick={fetchData} disabled={isLoading} leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}>
            تحديث
          </AppButton>
          <AppButton variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Send className="w-3.5 h-3.5" />}>
            إرسال حملة مركزية
          </AppButton>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
          {message}
        </div>
      )}

      <AdminNewsletterStatsCards stats={stats} />
      <AdminSubscribersDirectory subscribers={subscribers} onDelete={handleDeleteSubscriber} onToggleStatus={handleToggleStatus} />
      <AdminBroadcastHistoryTable broadcasts={broadcasts} />

      <AdminSystemBroadcastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={handleSendBroadcast} isSending={isSending} />
    </div>
  );
}
