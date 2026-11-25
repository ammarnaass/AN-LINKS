export type OAuthProviderKey = "google" | "facebook" | "apple";

export interface OAuthExtraConfig {
  teamId?: string;
  keyId?: string;
}

export interface AdminOAuthProviderDTO {
  provider: OAuthProviderKey;
  displayNameAr: string;
  descriptionAr: string;
  isEnabled: boolean;
  clientId: string;
  hasSecret: boolean;
  secretPreview: string;
  callbackUrl: string;
  configuredViaEnv: boolean;
  extraConfig: OAuthExtraConfig;
  updatedAt?: string;
}

export interface UpdateOAuthProviderInput {
  provider: OAuthProviderKey;
  isEnabled: boolean;
  clientId?: string;
  clientSecret?: string;
  extraConfig?: OAuthExtraConfig;
}

export interface RuntimeOAuthProviderConfig {
  provider: OAuthProviderKey;
  clientId: string;
  clientSecret: string;
  extraConfig?: OAuthExtraConfig;
}

export interface PublicOAuthProviderStatus {
  provider: OAuthProviderKey;
  label: string;
  isEnabled: boolean;
}
