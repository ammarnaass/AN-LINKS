export interface PlatformDTO {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  category: string;
  defaultIcon: string;
  brandColor: string;
  domainPattern: string;
  urlPlaceholder: string;
  isEnabled: boolean;
  isVerified: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    links?: number;
    clicks?: number;
  };
}

export interface LinkData {
  id: string;
  userId?: string;
  title: string;
  url: string;
  icon?: string | null;
  position: number;
  isActive: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  platformId?: string | null;
  platform?: PlatformDTO | null;
  category?: string;
  clicks?: number;
  clicksCount?: number;
  createdAt?: string;
  thumbnailUrl?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customBorderColor?: string | null;
  customShadow?: string | null;
}

export interface SocialItem {
  id: string;
  network: string;
  url: string;
  position?: number;
  platformId?: string | null;
}

export interface LinksPayload {
  links: LinkData[];
  socials: SocialItem[];
}

export interface CreateLinkInput {
  title: string;
  url: string;
  icon?: string;
  category?: string;
  platformId?: string | null;
  isPinned?: boolean;
  isArchived?: boolean;
  thumbnailUrl?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customBorderColor?: string | null;
  customShadow?: string | null;
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  icon?: string | null;
  isActive?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  platformId?: string | null;
  position?: number;
  category?: string;
  thumbnailUrl?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customBorderColor?: string | null;
  customShadow?: string | null;
}

export interface BatchReorderInput {
  links: {
    id: string;
    position: number;
    isActive?: boolean;
    isPinned?: boolean;
    isArchived?: boolean;
    platformId?: string | null;
    thumbnailUrl?: string | null;
    customBgColor?: string | null;
    customTextColor?: string | null;
    customBorderColor?: string | null;
    customShadow?: string | null;
  }[];
  socials?: {
    id?: string;
    network: string;
    url: string;
    position?: number;
    platformId?: string | null;
  }[];
}

export interface UserProfileDTO {
  id: string;
  userId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  seoIndexing: boolean;
  themeKey: string;
  accentColor: string;
  buttonStyle: string;
  borderRadius: string;
  font: string;
  isPublished: boolean;
}

export interface LinkValidationInput {
  title: string;
  url: string;
}

export interface LinkValidationResult {
  valid: boolean;
  title?: string;
  normalizedUrl?: string;
  error?: string;
}
