export interface LinkData {
  id: string;
  userId?: string;
  title: string;
  url: string;
  icon?: string | null;
  position: number;
  isActive: boolean;
  category?: string;
  clicks?: number;
  createdAt?: string;
}

export interface SocialItem {
  id: string;
  network: string;
  url: string;
  position?: number;
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
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  icon?: string | null;
  isActive?: boolean;
  position?: number;
  category?: string;
}

export interface BatchReorderInput {
  links: { id: string; position: number; isActive?: boolean }[];
  socials?: { id?: string; network: string; url: string; position?: number }[];
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
