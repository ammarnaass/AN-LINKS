export type SettingsTab =
  | "profile"
  | "newsletter"
  | "subscription"
  | "payouts"
  | "ai-webhooks"
  | "security"
  | "danger";

export interface ProfileSettingsData {
  displayName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  seoIndexing: boolean;
}

export interface PasswordChangeResult {
  valid: boolean;
  error?: string;
}

