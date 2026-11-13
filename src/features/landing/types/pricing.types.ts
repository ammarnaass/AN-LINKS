export interface PricingPlan {
  id: string;
  name: string;
  tag: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
}

export interface PricingComparisonRow {
  category: string;
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  agency: boolean | string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
