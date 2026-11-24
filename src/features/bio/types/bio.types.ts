export type ButtonStyle = "filled" | "glass" | "soft" | "outline";
export type ButtonShadow = "none" | "soft" | "strong" | "glow";
export type BorderRadius = "rounded-none" | "rounded-md" | "rounded-xl" | "rounded-full";
export type FontFamily = "Cairo" | "Tajawal" | "IBMPlex" | "Almarai" | "ReadexPro";
export type BackgroundType = "THEME" | "SOLID" | "GRADIENT" | "IMAGE";
export type SocialPosition = "top" | "bottom";
export type CardStyle = "glass" | "solid" | "glow" | "outline";

export interface ProfileData {
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  themeKey?: string | null;
  accentColor?: string | null;
  buttonStyle?: string | null;
  borderRadius?: string | null;
  font?: string | null;
  backgroundType?: string | null;
  customBackground?: string | null;
  buttonShadow?: string | null;
  socialPosition?: string | null;
  cardStyle?: string | null;
  bgOverlayOpacity?: number | null;
  isPublished?: boolean | null;
}

export interface SocialItem {
  id: string;
  network: string;
  url: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
  category?: string;
  icon?: string | null;
  thumbnailUrl?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customBorderColor?: string | null;
  customShadow?: string | null;
}

export interface ProfileMetadataInput {
  displayName: string;
  bio?: string | null;
  username: string;
  avatarUrl?: string | null;
}

export interface ReportValidationInput {
  username: string;
  reason: string;
  details?: string | null;
}

export interface ReportValidationResult {
  valid: boolean;
  username?: string;
  reason?: string;
  details?: string | null;
  error?: string;
}

