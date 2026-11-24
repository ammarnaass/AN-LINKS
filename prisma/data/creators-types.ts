export interface CreatorLinkSeed {
  title: string;
  url: string;
  type?: string;
  description?: string;
  icon?: string;
  isPinned?: boolean;
  clicksCount?: number;
}

export interface CreatorSocialSeed {
  network: string;
  url: string;
}

export interface CreatorSeedData {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  themeKey: string;
  accentColor: string;
  buttonStyle: string;
  borderRadius: string;
  font: string;
  backgroundType: string;
  customBackground?: string;
  bgOverlayOpacity?: number;
  cardStyle: string;
  buttonShadow: string;
  socialPosition: string;
  phone?: string;
  links: CreatorLinkSeed[];
  socials: CreatorSocialSeed[];
}
