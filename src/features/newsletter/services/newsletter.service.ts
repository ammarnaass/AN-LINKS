import {
  NewsletterSettings,
  SubscriberItem,
  NewsletterStats,
  NewsletterBroadcastItem,
  BroadcastPayload,
} from "../types/newsletter.types";

export async function fetchNewsletterSettings(): Promise<NewsletterSettings | null> {
  const res = await fetch("/api/settings/newsletter");
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.newsletter : null;
}

export async function updateNewsletterSettings(
  payload: Partial<NewsletterSettings>
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/settings/newsletter", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { success: res.ok && data.success, error: data.error };
}

export async function fetchSubscribers(
  query = "",
  status = "ALL"
): Promise<{ subscribers: SubscriberItem[]; stats: NewsletterStats }> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status && status !== "ALL") params.set("status", status);

  const res = await fetch(`/api/settings/subscribers?${params.toString()}`);
  if (!res.ok) {
    return {
      subscribers: [],
      stats: { total: 0, active: 0, unsubscribed: 0, thisMonth: 0 },
    };
  }
  const data = await res.json();
  return {
    subscribers: Array.isArray(data.subscribers) ? data.subscribers : [],
    stats: data.stats || { total: 0, active: 0, unsubscribed: 0, thisMonth: 0 },
  };
}

export async function addSubscriber(
  email: string,
  name?: string
): Promise<{ success: boolean; error?: string; subscriber?: SubscriberItem }> {
  const res = await fetch("/api/settings/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  const data = await res.json().catch(() => ({}));
  return {
    success: res.ok && data.success,
    error: data.error,
    subscriber: data.subscriber,
  };
}

export async function updateSubscriberStatus(
  id: string,
  status: "ACTIVE" | "UNSUBSCRIBED"
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`/api/settings/subscribers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  return { success: res.ok && data.success, error: data.error };
}

export async function deleteSubscriber(id: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`/api/settings/subscribers/${id}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  return { success: res.ok && data.success, error: data.error };
}

export async function fetchBroadcasts(): Promise<NewsletterBroadcastItem[]> {
  const res = await fetch("/api/settings/newsletter/broadcast");
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.broadcasts) ? data.broadcasts : [];
}

export async function sendBroadcast(
  payload: BroadcastPayload
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch("/api/settings/newsletter/broadcast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return {
    success: res.ok && data.success,
    message: data.message,
    error: data.error,
  };
}
