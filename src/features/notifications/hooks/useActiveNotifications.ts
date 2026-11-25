"use client";

import { useState, useEffect, useCallback } from "react";
import { ActiveNotificationDto } from "../types/notification.types";
import { fetchActiveNotifications, trackNotificationClick } from "../services/notifications.client";
import {
  isNotificationDismissed,
  markNotificationDismissed,
} from "../services/notification-storage.utils";

export function useActiveNotifications() {
  const [notifications, setNotifications] = useState<ActiveNotificationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const items = await fetchActiveNotifications();
      const visible = items.filter((item) => !isNotificationDismissed(item.id));
      setNotifications(visible);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const dismiss = useCallback((id: string) => {
    markNotificationDismissed(id);
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClickAction = useCallback(
    (id: string, url?: string | null) => {
      trackNotificationClick(id);
      if (url && typeof window !== "undefined") {
        if (url.startsWith("http://") || url.startsWith("https://")) {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = url;
        }
      }
      dismiss(id);
    },
    [dismiss]
  );

  return {
    notifications,
    isLoading,
    dismiss,
    handleClickAction,
    reload: loadNotifications,
  };
}
