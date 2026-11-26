"use client";

import { useState, useEffect, useCallback } from "react";
import {
  NewsletterSettings,
  SubscriberItem,
  NewsletterStats,
  NewsletterBroadcastItem,
  BroadcastPayload,
} from "../types/newsletter.types";
import * as service from "../services/newsletter.service";

export function useNewsletterManagement() {
  const [settings, setSettings] = useState<NewsletterSettings>({
    newsletterEnabled: true,
    newsletterTitle: "",
    newsletterSubtitle: "",
    newsletterButtonText: "",
    displayName: "",
    accentColor: "#3B82F6",
  });
  const [stats, setStats] = useState<NewsletterStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    thisMonth: 0,
  });
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<NewsletterBroadcastItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const clearFeedback = () => setFeedback(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const loadSubscribers = useCallback(async () => {
    const res = await service.fetchSubscribers(searchQuery, statusFilter);
    setSubscribers(res.subscribers);
    setStats(res.stats);
  }, [searchQuery, statusFilter]);

  const loadBroadcasts = useCallback(async () => {
    const data = await service.fetchBroadcasts();
    setBroadcasts(data);
  }, []);

  const loadSettings = useCallback(async () => {
    const data = await service.fetchNewsletterSettings();
    if (data) setSettings(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadSettings(), loadSubscribers(), loadBroadcasts()]);
    setIsLoading(false);
  }, [loadSettings, loadSubscribers, loadBroadcasts]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleSaveSettings = async (overrides?: Partial<NewsletterSettings>) => {
    setIsSavingSettings(true);
    const toSave = overrides ? { ...settings, ...overrides } : settings;
    const res = await service.updateNewsletterSettings(toSave);
    if (res.success) {
      if (overrides) setSettings(toSave);
      showNotification("success", "تم حفظ إعدادات النشرة بنجاح");
    } else {
      showNotification("error", res.error || "فشل حفظ إعدادات النشرة");
    }
    setIsSavingSettings(false);
  };

  const handleAddSubscriber = async (email: string, name?: string) => {
    const res = await service.addSubscriber(email, name);
    if (res.success) {
      showNotification("success", "تمت إضافة المشترك بنجاح");
      setIsAddModalOpen(false);
      await loadSubscribers();
      return true;
    }
    showNotification("error", res.error || "فشل إضافة المشترك");
    return false;
  };

  const handleToggleSubscriberStatus = async (sub: SubscriberItem) => {
    const nextStatus = sub.status === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE";
    const res = await service.updateSubscriberStatus(sub.id, nextStatus);
    if (res.success) {
      showNotification("success", `تم تحديث حالة ${sub.email}`);
      await loadSubscribers();
    } else {
      showNotification("error", res.error || "فشل تحديث الحالة");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    const res = await service.deleteSubscriber(id);
    if (res.success) {
      showNotification("success", "تم حذف المشترك بنجاح");
      await loadSubscribers();
    } else {
      showNotification("error", res.error || "فشل حذف المشترك");
    }
  };

  const handleSendBroadcast = async (payload: BroadcastPayload) => {
    setIsSendingBroadcast(true);
    const res = await service.sendBroadcast(payload);
    if (res.success) {
      showNotification("success", res.message || "تم إرسال الحملة بنجاح");
      if (!payload.testOnly) {
        setIsBroadcastModalOpen(false);
        await loadBroadcasts();
      }
      setIsSendingBroadcast(false);
      return true;
    }
    showNotification("error", res.error || "فشل إرسال الحملة");
    setIsSendingBroadcast(false);
    return false;
  };

  return {
    settings,
    setSettings,
    stats,
    subscribers,
    broadcasts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isLoading,
    isSavingSettings,
    isSendingBroadcast,
    feedback,
    clearFeedback,
    isAddModalOpen,
    setIsAddModalOpen,
    isBroadcastModalOpen,
    setIsBroadcastModalOpen,
    handleSaveSettings,
    handleAddSubscriber,
    handleToggleSubscriberStatus,
    handleDeleteSubscriber,
    handleSendBroadcast,
    refreshAll,
  };
}
