"use client";

import React from "react";
import { useActiveNotifications } from "../hooks/useActiveNotifications";
import { NotificationToast } from "./NotificationToast";

export function NotificationToastContainer() {
  const { notifications, dismiss, handleClickAction } = useActiveNotifications();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-label="تنبيهات وإشعارات المنصة"
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 pointer-events-none max-w-full sm:max-w-md animate-in slide-in-from-left duration-300 font-cairo"
    >
      {notifications.map((item) => (
        <NotificationToast
          key={item.id}
          notification={item}
          onDismiss={dismiss}
          onActionClick={handleClickAction}
        />
      ))}
    </div>
  );
}
