const STORAGE_KEY = "an_dismissed_notifications";

function getStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== "undefined") {
    return localStorage;
  }
  return null;
}

export function getDismissedNotificationIds(): string[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isNotificationDismissed(id: string): boolean {
  const dismissed = getDismissedNotificationIds();
  return dismissed.includes(id);
}

export function markNotificationDismissed(id: string): void {
  const storage = getStorage();
  if (!storage || !id) return;
  try {
    const dismissed = getDismissedNotificationIds();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      storage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
    }
  } catch {
    // Ignore storage quota or access errors
  }
}

export function clearDismissedNotifications(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
