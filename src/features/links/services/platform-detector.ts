export interface PlatformPattern {
  slug: string;
  nameAr: string;
  nameEn: string;
  category: string;
  defaultIcon: string;
  brandColor: string;
  domainPattern: string;
  urlPlaceholder?: string;
}

export const DEFAULT_PLATFORM_PATTERNS: PlatformPattern[] = [
  {
    slug: "youtube", nameAr: "يوتيوب", nameEn: "YouTube", category: "VIDEO",
    defaultIcon: "youtube", brandColor: "#FF0000", domainPattern: "youtube.com|youtu.be",
    urlPlaceholder: "https://youtube.com/@channel",
  },
  {
    slug: "tiktok", nameAr: "تيك توك", nameEn: "TikTok", category: "SOCIAL",
    defaultIcon: "music-2", brandColor: "#000000", domainPattern: "tiktok.com",
    urlPlaceholder: "https://tiktok.com/@username",
  },
  {
    slug: "instagram", nameAr: "انستغرام", nameEn: "Instagram", category: "SOCIAL",
    defaultIcon: "instagram", brandColor: "#E1306C", domainPattern: "instagram.com",
    urlPlaceholder: "https://instagram.com/username",
  },
  {
    slug: "x", nameAr: "إكس (تويتر)", nameEn: "X (Twitter)", category: "SOCIAL",
    defaultIcon: "twitter", brandColor: "#000000", domainPattern: "x.com|twitter.com",
    urlPlaceholder: "https://x.com/username",
  },
  {
    slug: "snapchat", nameAr: "سناب شات", nameEn: "Snapchat", category: "SOCIAL",
    defaultIcon: "ghost", brandColor: "#FFFC00", domainPattern: "snapchat.com",
    urlPlaceholder: "https://snapchat.com/add/username",
  },
  {
    slug: "whatsapp", nameAr: "واتساب", nameEn: "WhatsApp", category: "MESSAGING",
    defaultIcon: "message-circle", brandColor: "#25D366", domainPattern: "wa.me|whatsapp.com",
    urlPlaceholder: "https://wa.me/966500000000",
  },
  {
    slug: "telegram", nameAr: "تيليجرام", nameEn: "Telegram", category: "MESSAGING",
    defaultIcon: "send", brandColor: "#0088CC", domainPattern: "t.me|telegram.me",
    urlPlaceholder: "https://t.me/username",
  },
  {
    slug: "linkedin", nameAr: "لينكد إن", nameEn: "LinkedIn", category: "PROFESSIONAL",
    defaultIcon: "linkedin", brandColor: "#0A66C2", domainPattern: "linkedin.com",
    urlPlaceholder: "https://linkedin.com/in/username",
  },
  {
    slug: "github", nameAr: "جيت هاب", nameEn: "GitHub", category: "DEV",
    defaultIcon: "github", brandColor: "#24292E", domainPattern: "github.com",
    urlPlaceholder: "https://github.com/username",
  },
  {
    slug: "spotify", nameAr: "سبوتيفاي", nameEn: "Spotify", category: "MUSIC",
    defaultIcon: "disc", brandColor: "#1DB954", domainPattern: "spotify.com",
    urlPlaceholder: "https://open.spotify.com/artist/...",
  },
  {
    slug: "apple-music", nameAr: "أبل ميوزك", nameEn: "Apple Music", category: "MUSIC",
    defaultIcon: "headphones", brandColor: "#FA2D48", domainPattern: "music.apple.com",
    urlPlaceholder: "https://music.apple.com/artist/...",
  },
  {
    slug: "soundcloud", nameAr: "ساوند كلاود", nameEn: "SoundCloud", category: "MUSIC",
    defaultIcon: "radio", brandColor: "#FF5500", domainPattern: "soundcloud.com",
    urlPlaceholder: "https://soundcloud.com/artist",
  },
  {
    slug: "anghami", nameAr: "أنغامي", nameEn: "Anghami", category: "MUSIC",
    defaultIcon: "music", brandColor: "#7928CA", domainPattern: "anghami.com",
    urlPlaceholder: "https://play.anghami.com/artist/...",
  },
  {
    slug: "salla", nameAr: "سلة", nameEn: "Salla", category: "COMMERCE",
    defaultIcon: "shopping-bag", brandColor: "#00B4D8", domainPattern: "salla.sa|salla.com",
    urlPlaceholder: "https://salla.sa/mystore",
  },
  {
    slug: "zid", nameAr: "زد", nameEn: "Zid", category: "COMMERCE",
    defaultIcon: "shopping-cart", brandColor: "#6C5CE7", domainPattern: "zid.sa|zid.store",
    urlPlaceholder: "https://zid.store/mystore",
  },
  {
    slug: "discord", nameAr: "ديسكورد", nameEn: "Discord", category: "SOCIAL",
    defaultIcon: "hash", brandColor: "#5865F2", domainPattern: "discord.gg|discord.com",
    urlPlaceholder: "https://discord.gg/inviteCode",
  },
  {
    slug: "twitch", nameAr: "تويتش", nameEn: "Twitch", category: "VIDEO",
    defaultIcon: "tv", brandColor: "#9146FF", domainPattern: "twitch.tv",
    urlPlaceholder: "https://twitch.tv/channel",
  },
  {
    slug: "facebook", nameAr: "فيسبوك", nameEn: "Facebook", category: "SOCIAL",
    defaultIcon: "facebook", brandColor: "#1877F2", domainPattern: "facebook.com|fb.me",
    urlPlaceholder: "https://facebook.com/username",
  },
  {
    slug: "pinterest", nameAr: "بينترست", nameEn: "Pinterest", category: "SOCIAL",
    defaultIcon: "pin", brandColor: "#E60023", domainPattern: "pinterest.com",
    urlPlaceholder: "https://pinterest.com/username",
  },
  {
    slug: "custom", nameAr: "رابط مخصص", nameEn: "Custom Link", category: "CUSTOM",
    defaultIcon: "globe", brandColor: "#4EDEA3", domainPattern: ".*",
    urlPlaceholder: "https://example.com",
  },
];

export function extractHostname(url: string): string | null {
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProto);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function matchesDomain(hostname: string, domainPattern: string): boolean {
  if (!domainPattern || domainPattern === ".*") return false;
  const domains = domainPattern.split("|").map((d) => d.trim().toLowerCase()).filter(Boolean);
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export function detectPlatform(
  url: string,
  customPlatforms?: PlatformPattern[]
): PlatformPattern | null {
  if (!url || typeof url !== "string") return null;
  const hostname = extractHostname(url);
  if (!hostname) return null;

  const patterns = customPlatforms && customPlatforms.length > 0
    ? customPlatforms
    : DEFAULT_PLATFORM_PATTERNS;

  for (const pattern of patterns) {
    if (matchesDomain(hostname, pattern.domainPattern)) {
      return pattern;
    }
  }

  return null;
}
