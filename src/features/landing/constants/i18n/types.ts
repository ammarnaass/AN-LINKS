import { LandingPricingTier } from "../../types/landing.types";

export interface LandingPartner {
  icon: string;
  name: string;
}

export interface LandingPhoneMockupContent {
  analyticsTitle: string;
  analyticsGrowth: string;
  sentinelTitle: string;
  sentinelDesc: string;
  saleTitle: string;
  saleTime: string;
  creatorName: string;
  creatorBio: string;
  videoBadge: string;
  videoTitle: string;
  productTitle: string;
  productDesc: string;
  productPrice: string;
  podcastTitle: string;
  podcastDesc: string;
  newsletterTitle: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
}

export interface LandingFeaturesContent {
  tag: string;
  title: string;
  subtitle: string;
  sentinel: {
    title: string;
    badge: string;
    desc: string;
    alertTitle: string;
    alertDesc: string;
    alertStatus: string;
  };
  typography: {
    title: string;
    desc: string;
    fonts: string[];
  };
  analytics: {
    title: string;
    desc: string;
    ctrLabel: string;
    sources: { ig: string; tt: string; other: string };
  };
  commerce: {
    title: string;
    desc: string;
    oneClick: string;
    oneClickDesc: string;
  };
  qr: {
    title: string;
    desc: string;
  };
}

export interface LandingHowItWorksStep {
  num: string;
  title: string;
  desc: string;
  badgeText: string;
}

export interface LandingFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LandingFooterContent {
  description: string;
  newsletterTitle: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
  productTitle: string;
  features: string;
  templates: string;
  pricing: string;
  customDomains: string;
  analytics: string;
  resourcesTitle: string;
  faq: string;
  blog: string;
  guides: string;
  api: string;
  contact: string;
  legalTitle: string;
  privacy: string;
  terms: string;
  security: string;
  rights: string;
  status: string;
}

export interface LandingI18nContent {
  partners: {
    tag: string;
    items: LandingPartner[];
  };
  phoneMockup: LandingPhoneMockupContent;
  heroProof: {
    available: string;
    creatorsCount: string;
    rating: string;
    noCard: string;
  };
  features: LandingFeaturesContent;
  howItWorks: {
    tag: string;
    title: string;
    subtitle: string;
    steps: LandingHowItWorksStep[];
  };
  pricing: {
    tag: string;
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    save: string;
    tiers: LandingPricingTier[];
  };
  testimonials: {
    tag: string;
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      avatarUrl: string;
      rating: number;
      quote: string;
    }>;
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    items: LandingFaqItem[];
  };
  giantCta: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    prefix: string;
    placeholder: string;
    button: string;
  };
  footer: LandingFooterContent;
}
