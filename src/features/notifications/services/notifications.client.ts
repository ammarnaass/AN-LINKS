import { ActiveNotificationDto } from "../types/notification.types";

export async function fetchActiveNotifications(): Promise<ActiveNotificationDto[]> {
  try {
    const res = await fetch("/api/notifications/active", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.notifications) ? data.notifications : [];
  } catch (err) {
    console.error("Failed to fetch active notifications:", err);
    return [];
  }
}

export async function trackNotificationClick(id: string): Promise<void> {
  if (!id) return;
  try {
    await fetch(`/api/notifications/${id}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Ignore tracking failures gracefully
  }
}
