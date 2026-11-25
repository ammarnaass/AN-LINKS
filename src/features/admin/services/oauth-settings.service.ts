import { prisma } from "@/shared/db";
import { encryptSecret, decryptSecret } from "@/shared/lib/crypto";
import {
  AdminOAuthProviderDTO,
  UpdateOAuthProviderInput,
  RuntimeOAuthProviderConfig,
  PublicOAuthProviderStatus,
} from "../types/oauth.types";
import {
  PROVIDER_META,
  SUPPORTED_PROVIDERS,
  isValidOAuthProvider,
  maskSecret,
  getCallbackUrl,
  getEnvCredentials,
  parseExtraConfig,
} from "./oauth-provider-meta";

export { isValidOAuthProvider };

const RUNTIME_CACHE_TTL_MS = 30_000;
let runtimeCache: { data: RuntimeOAuthProviderConfig[]; expiresAt: number } | null = null;

export function invalidateOAuthProviderCache() {
  runtimeCache = null;
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
    const extraConfig = parseExtraConfig(row?.extraConfig);

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
      showWhenDisabled: extraConfig.showWhenDisabled !== false,
      clientId: row?.clientId || envCreds?.clientId || "",
      hasSecret: hasDbSecret || Boolean(envCreds),
      secretPreview: hasDbSecret ? secretPreview : envCreds ? maskSecret(envCreds.clientSecret) : "",
      callbackUrl: getCallbackUrl(provider),
      configuredViaEnv: !row && Boolean(envCreds),
      extraConfig,
      updatedAt: row?.updatedAt?.toISOString(),
    };
  });
}

/**
 * Validates and persists OAuth provider credentials & auth screen visibility.
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

  const prevExtra = parseExtraConfig(existing?.extraConfig);
  const nextShowWhenDisabled =
    typeof input.showWhenDisabled === "boolean"
      ? input.showWhenDisabled
      : typeof input.extraConfig?.showWhenDisabled === "boolean"
        ? input.extraConfig.showWhenDisabled
        : prevExtra.showWhenDisabled !== false;

  const extraPayload = {
    teamId: input.extraConfig?.teamId !== undefined ? input.extraConfig.teamId.trim() : prevExtra.teamId || "",
    keyId: input.extraConfig?.keyId !== undefined ? input.extraConfig.keyId.trim() : prevExtra.keyId || "",
    showWhenDisabled: nextShowWhenDisabled,
  };

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
      extraConfig: extraPayload,
    },
  });

  invalidateOAuthProviderCache();
  return getAdminOAuthProviders();
}

/**
 * Resolves active decrypted OAuth provider credentials for NextAuth runtime.
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
    return SUPPORTED_PROVIDERS.flatMap((provider) => {
      const envCreds = getEnvCredentials(provider);
      return envCreds ? [{ provider, ...envCreds }] : [];
    });
  }
}

/**
 * Returns public-safe activation & visibility flags for Google, Facebook, and Apple
 * without exposing any credentials or secrets.
 */
export async function getPublicOAuthStatuses(): Promise<PublicOAuthProviderStatus[]> {
  const active = await getActiveRuntimeOAuthConfigs();
  const activeSet = new Set(active.map((a) => a.provider));

  let visibilityMap = new Map<string, boolean>();
  try {
    const rows = await prisma.oAuthProviderConfig.findMany({
      select: { provider: true, extraConfig: true },
    });
    visibilityMap = new Map(
      rows.map((r) => [r.provider, parseExtraConfig(r.extraConfig).showWhenDisabled !== false])
    );
  } catch {
    // Keep default visibility true if DB query fails temporarily
  }

  return SUPPORTED_PROVIDERS.map((provider) => ({
    provider,
    label: PROVIDER_META[provider].label,
    isEnabled: activeSet.has(provider),
    showWhenDisabled: visibilityMap.get(provider) ?? true,
  }));
}
