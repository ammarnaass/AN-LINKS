export type WebhookEventType =
  | "order.completed"
  | "lead.collected"
  | "booking.confirmed"
  | "booking.cancelled"
  | "booking.rescheduled"
  | "subscription.created";

export interface CreatorWebhookConfig {
  id: string;
  creatorId: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
}

export interface EnqueueWebhookInput {
  creatorId: string;
  event: WebhookEventType;
  payload: Record<string, unknown>;
}

export interface WebhookDispatchResult {
  dispatchedCount: number;
  successCount: number;
  failedCount: number;
}
