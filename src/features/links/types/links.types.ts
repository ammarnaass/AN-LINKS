export interface LinkData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
  category?: string;
  clicks?: number;
}

export interface SocialItem {
  id: string;
  network: string;
  url: string;
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
