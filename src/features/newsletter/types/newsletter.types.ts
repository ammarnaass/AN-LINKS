export interface SubscriberItem {
  id: string;
  email: string;
  name?: string | null;
  source?: string | null;
  status: "ACTIVE" | "UNSUBSCRIBED" | string;
  createdAt: string;
}

export interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  thisMonth: number;
}

export interface NewsletterSettings {
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterButtonText: string;
  displayName?: string;
  accentColor?: string;
  welcomeSubject?: string | null;
  welcomeBody?: string | null;
  welcomeGiftUrl?: string | null;
}

export interface NewsletterBroadcastItem {
  id: string;
  creatorId: string;
  subject: string;
  content: string;
  sentCount: number;
  status: "SENT" | "DRAFT" | "FAILED" | string;
  sentAt: string;
  createdAt: string;
}

export interface BroadcastPayload {
  subject: string;
  content: string;
  testOnly?: boolean;
}
