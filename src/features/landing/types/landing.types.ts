export interface ClaimResult {
  username: string;
  isValid: boolean;
  targetUrl: string;
  error?: string;
}

export interface LandingPricingTier {
  id: string;
  name: string;
  subtitle: string;
  priceMonthly: number;
  priceYearlyMonthlyEquiv: number;
  periodMonthly: string;
  periodYearly: string;
  isPopular?: boolean;
  popularBadge?: string;
  features: { text: string; included: boolean; bold?: boolean }[];
  ctaText: string;
  ctaPath: string;
}

export interface LandingHeaderProps {
  onOpenAuth?: (mode: "login" | "signup" | "claim") => void;
}

export interface HeroSectionProps {
  onOpenAuth?: (mode: "login" | "signup" | "claim", handle?: string) => void;
}

export interface PricingBannerSectionProps {
  onOpenAuth?: (mode: "login" | "signup" | "claim") => void;
}

export interface GiantCtaSectionProps {
  onOpenAuth?: (mode: "login" | "signup" | "claim", handle?: string) => void;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup" | "claim";
  claimHandle?: string;
}
