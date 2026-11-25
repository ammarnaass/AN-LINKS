import { OAuthExtraConfig, OAuthProviderKey } from "../types/oauth.types";

export const PROVIDER_META: Record<
  OAuthProviderKey,
  {
    label: string;
    displayNameAr: string;
    descriptionAr: string;
    envIdKey: string;
    envSecretKey: string;
  }
> = {
  google: {
    label: "Google",
    displayNameAr: "تسجيل الدخول عبر جوجل (Google)",
    descriptionAr: "ربط حسابات Google Cloud OAuth 2.0 لتسجيل الدخول بنقرة واحدة",
    envIdKey: "GOOGLE_CLIENT_ID",
    envSecretKey: "GOOGLE_CLIENT_SECRET",
  },
  facebook: {
    label: "Facebook",
    displayNameAr: "تسجيل الدخول عبر فيسبوك (Facebook)",
    descriptionAr: "ربط تطبيق Meta for Developers (Facebook Login) للمصادقة السريعة",
    envIdKey: "FACEBOOK_CLIENT_ID",
    envSecretKey: "FACEBOOK_CLIENT_SECRET",
  },
  apple: {
    label: "Apple",
    displayNameAr: "تسجيل الدخول عبر أبل (Sign in with Apple)",
    descriptionAr: "ربط Apple Developer Services ID ومفاتيح التوقيع الخاصة لأجهزة iOS والويب",
    envIdKey: "APPLE_ID",
    envSecretKey: "APPLE_SECRET",
  },
};

export const SUPPORTED_PROVIDERS: OAuthProviderKey[] = ["google", "facebook", "apple"];

export function isValidOAuthProvider(value: string): value is OAuthProviderKey {
  return SUPPORTED_PROVIDERS.includes(value as OAuthProviderKey);
}

export function maskSecret(plainSecret: string): string {
  const trimmed = plainSecret.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 4) return "••••••••";
  return `••••••••••••${trimmed.slice(-4)}`;
}

export function getCallbackUrl(provider: OAuthProviderKey): string {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://anlinks.dev").replace(/\/$/, "");
  return `${baseUrl}/api/auth/callback/${provider}`;
}

export function getEnvCredentials(provider: OAuthProviderKey): { clientId: string; clientSecret: string } | null {
  const meta = PROVIDER_META[provider];
  const clientId = process.env[meta.envIdKey]?.trim();
  const clientSecret = process.env[meta.envSecretKey]?.trim();
  if (clientId && clientSecret) {
    return { clientId, clientSecret };
  }
  return null;
}

export function parseExtraConfig(raw: unknown): OAuthExtraConfig {
  if (!raw || typeof raw !== "object") {
    return { teamId: "", keyId: "", showWhenDisabled: true };
  }
  const obj = raw as Record<string, unknown>;
  return {
    teamId: typeof obj.teamId === "string" ? obj.teamId : "",
    keyId: typeof obj.keyId === "string" ? obj.keyId : "",
    showWhenDisabled: typeof obj.showWhenDisabled === "boolean" ? obj.showWhenDisabled : true,
  };
}
