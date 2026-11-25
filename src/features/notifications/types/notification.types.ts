export type NotificationType =
  | "ANNOUNCEMENT"
  | "SUCCESS"
  | "WARNING"
  | "URGENT"
  | "PROMO"
  | "CUSTOM";

export type NotificationTarget =
  | "ALL"
  | "CREATORS_ONLY"
  | "VISITORS_ONLY"
  | "ADMINS_ONLY";

export type NotificationPosition =
  | "BOTTOM_LEFT"
  | "TOP_LEFT"
  | "BOTTOM_CENTER";

export interface SystemNotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  color: string;
  bgColor?: string | null;
  icon?: string | null;
  position: NotificationPosition;
  target: NotificationTarget;
  actionLabel?: string | null;
  actionUrl?: string | null;
  isActive: boolean;
  priority: number;
  autoDismissSeconds?: number | null;
  startsAt: string | Date;
  expiresAt?: string | Date | null;
  viewCount: number;
  clickCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ActiveNotificationDto {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  color: string;
  bgColor?: string | null;
  icon?: string | null;
  position: NotificationPosition;
  actionLabel?: string | null;
  actionUrl?: string | null;
  autoDismissSeconds?: number | null;
  priority: number;
}

export interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  color?: string;
  bgColor?: string | null;
  icon?: string | null;
  position?: NotificationPosition;
  target?: NotificationTarget;
  actionLabel?: string | null;
  actionUrl?: string | null;
  isActive?: boolean;
  priority?: number;
  autoDismissSeconds?: number | null;
  startsAt?: string | Date;
  expiresAt?: string | Date | null;
}
