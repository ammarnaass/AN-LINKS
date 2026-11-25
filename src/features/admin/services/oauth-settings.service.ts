import { prisma } from "@/shared/db";
import { encryptSecret, decryptSecret } from "@/shared/lib/crypto";
import {
  OAuthProviderKey,
  OAuthExtraConfig,
  AdminOAuthProviderDTO,
  UpdateOAuthProviderInput,
  RuntimeOAuthProviderConfig,
} from "../types/oauth.types";

const PROVIDER_META: Record<
  OAuthProviderKey,
  {
    displayNameAr: string;
    descriptionAr: string;
    envIdKey: string;
    envSecretKey: string;
  }
> = {
  google: {
    displayNameAr: "تسجيل الدخول عبر جوجل (Google)",
    descriptionAr: "ربط حسابات Google Cloud OAuth 2.0 لتسجيل الدخول بنقرة واحدة",
    envIdKey: "GOOGLE_CLIENT_ID",
    envSecretKey: "GOOGLE_CLIENT_SECRET",
  },
  facebook: {
    displayNameAr: "تسجيل الدخول عبر فيسبوك (Facebook)",
    descriptionAr: "ربط تطبيق Meta for Developers (Facebook Login) للمصادقة السريعة",
    envIdKey: "FACEBOOK_CLIENT_ID",
    envSecretKey: "FACEBOOK_CLIENT_SECRET",
  },
  apple: {
    displayNameAr: "تسجيل الدخول عبر أبل (Sign in with Apple)",
    descriptionAr: "ربط Apple Developer Services ID ومفاتيح التوقيع الخاصة لأجهزة iOS والويب",
    envIdKey: "APPLE_ID",
    envSecretKey: "APPLE_SECRET",
  },
};

const SUPPORTED_PROVIDERS: OAuthProviderKey[] = ["google", "facebook", "apple"];
const RUNTIME_CACHE_TTL_MS = 30_000;

let runtimeCache: { data: RuntimeOAuthProviderConfig[]; expiresAt: number } | null = null;

export function invalidateOAuthProviderCache() {
  runtimeCache = null;
}

export function isValidOAuthProvider(value: string): value is OAuthProviderKey {
  return SUPPORTED_PROVIDERS.includes(value as OAuthProviderKey);
}

function maskSecret(plainSecret: string): string {
  const trimmed = plainSecret.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 4) return "••••••••";
  return `••••••••••••${trimmed.slice(-4)}`;
}

function getCallbackUrl(provider: OAuthProviderKey): string {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://anlinks.dev").replace(/\/$/, "");
  return `${baseUrl}/api/auth/callback/${provider}`;
}

function getEnvCredentials(provider: OAuthProviderKey): { clientId: string; clientSecret: string } | null {
  const meta = PROVIDER_META[provider];
  const clientId = process.env[meta.envIdKey]?.trim();
  const clientSecret = process.env[meta.envSecretKey]?.trim();
  if (clientId && clientSecret) {
    return { clientId, clientSecret };
  }
  return null;
}

function parseExtraConfig(raw: unknown): OAuthExtraConfig {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  return {
    teamId: typeof obj.teamId === "string" ? obj.teamId : "",
    keyId: typeof obj.keyId === "string" ? obj.keyId : "",
  };
}

/**
 * Returns masked OAuth provider settings for the System Admin console.
 * Plaintext secrets are never returned over the API.
 */
export async function getAdminOAuthProviders(): Promise<AdminOAuthProviderDTO[]> {
  const rows = await prisma.oAuthProviderConfig.findMany();
  const rowMap = new Map(rows.map((r) => [r.provider, r]));

  return SUPPORTED_PROVIDERS.map((provider) => {
    const meta = PROVIDER_META[provider];
    const row = rowMap.get(provider);
    const envCreds = getEnvCredentials(provider);

    let secretPreview = "";
    if (row?.clientSecretEncrypted) {
      try {
        secretPreview = maskSecret(decryptSecret(row.clientSecretEncrypted));
      } catch {
        secretPreview = "••••••••••••";
      }
    }

    const hasDbSecret = Boolean(row?.clientSecretEncrypted);
    return {
      provider,
      displayNameAr: row?.displayNameAr || meta.displayNameAr,
      descriptionAr: meta.descriptionAr,
      isEnabled: row ? row.isEnabled : Boolean(envCreds),
      clientId: row?.clientId || envCreds?.clientId || "",
      hasSecret: hasDbSecret || Boolean(envCreds),
      secretPreview: hasDbSecret ? secretPreview : envCreds ? maskSecret(envCreds.clientSecret) : "",
      callbackUrl: getCallbackUrl(provider),
      configuredViaEnv: !row && Boolean(envCreds),
      extraConfig: parseExtraConfig(row?.extraConfig),
      updatedAt: row?.updatedAt?.toISOString(),
    };
  });
}

/**
 * Validates and persists OAuth provider credentials with AES-256-GCM encryption at rest.
 */
export async function updateOAuthProviderConfig(
  input: UpdateOAuthProviderInput
): Promise<AdminOAuthProviderDTO[]> {
  if (!isValidOAuthProvider(input.provider)) {
    throw new Error("مزود المصادقة غير مدعوم");
  }

  const meta = PROVIDER_META[input.provider];
  const existing = await prisma.oAuthProviderConfig.findUnique({
    where: { provider: input.provider },
  });
  const envCreds = getEnvCredentials(input.provider);

  const nextClientId = (input.clientId ?? existing?.clientId ?? envCreds?.clientId ?? "").trim();
  const incomingSecret = input.clientSecret?.trim() || "";
  const hasExistingSecret = Boolean(existing?.clientSecretEncrypted || envCreds?.clientSecret);

  if (input.isEnabled && (!nextClientId || (!incomingSecret && !hasExistingSecret))) {
    throw new Error(`يجب إدخال Client ID و Client Secret قبل تفعيل ${meta.displayNameAr}`);
  }

  let nextEncryptedSecret = existing?.clientSecretEncrypted || null;
  if (incomingSecret) {
    nextEncryptedSecret = encryptSecret(incomingSecret);
  } else if (!nextEncryptedSecret && envCreds?.clientSecret) {
    nextEncryptedSecret = encryptSecret(envCreds.clientSecret);
  }

  const extraPayload = input.extraConfig
    ? {
        teamId: input.extraConfig.teamId?.trim() || "",
        keyId: input.extraConfig.keyId?.trim() || "",
      }
    : undefined;

  await prisma.oAuthProviderConfig.upsert({
    where: { provider: input.provider },
    create: {
      provider: input.provider,
      displayNameAr: meta.displayNameAr,
      isEnabled: Boolean(input.isEnabled),
      clientId: nextClientId || null,
      clientSecretEncrypted: nextEncryptedSecret,
      extraConfig: extraPayload,
    },
    update: {
      isEnabled: Boolean(input.isEnabled),
      clientId: nextClientId || null,
      clientSecretEncrypted: nextEncryptedSecret,
      ...(extraPayload ? { extraConfig: extraPayload } : {}),
    },
  });

  invalidateOAuthProviderCache();
  return getAdminOAuthProviders();
}

/**
 * Resolves active decrypted OAuth provider credentials for NextAuth runtime.
 * Combines DB-configured providers with optional .env fallbacks.
 */
export async function getActiveRuntimeOAuthConfigs(): Promise<RuntimeOAuthProviderConfig[]> {
  const now = Date.now();
  if (runtimeCache && runtimeCache.expiresAt > now) {
    return runtimeCache.data;
  }

  try {
    const rows = await prisma.oAuthProviderConfig.findMany();
    const rowMap = new Map(rows.map((r) => [r.provider, r]));
    const active: RuntimeOAuthProviderConfig[] = [];

    for (const provider of SUPPORTED_PROVIDERS) {
      const row = rowMap.get(provider);
      const envCreds = getEnvCredentials(provider);

      if (row) {
        if (!row.isEnabled || !row.clientId || !row.clientSecretEncrypted) continue;
        try {
          const clientSecret = decryptSecret(row.clientSecretEncrypted);
          active.push({
            provider,
            clientId: row.clientId,
            clientSecret,
            extraConfig: parseExtraConfig(row.extraConfig),
          });
        } catch {
          // Skip malformed encrypted payload
        }
      } else if (envCreds) {
        active.push({
          provider,
          clientId: envCreds.clientId,
          clientSecret: envCreds.clientSecret,
        });
      }
    }

    runtimeCache = { data: active, expiresAt: now + RUNTIME_CACHE_TTL_MS };
    return active;
  } catch {
    // Fallback strictly to environment variables if DB is temporarily unreachable
    return SUPPORTED_PROVIDERS.flatMap((provider) => {
      const envCreds = getEnvCredentials(provider);
      return envCreds ? [{ provider, ...envCreds }] : [];
    });
  }
}
