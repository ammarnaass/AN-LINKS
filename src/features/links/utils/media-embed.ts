export type LinkType = "LINK" | "HEADER" | "YOUTUBE" | "SPOTIFY";

export function extractYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  return null;
}

export function extractSpotifyEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/i;
  const match = trimmed.match(regExp);
  if (match && match[1] && match[2]) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  }
  return null;
}

export function detectAutoLinkType(url: string): LinkType {
  if (extractYouTubeEmbedUrl(url)) return "YOUTUBE";
  if (extractSpotifyEmbedUrl(url)) return "SPOTIFY";
  return "LINK";
}

export function getLinkTypeLabel(type?: string): string {
  switch (type) {
    case "HEADER":
      return "عنوان قسم";
    case "YOUTUBE":
      return "فيديو يوتيوب";
    case "SPOTIFY":
      return "صوتيات سبوتيفاي";
    default:
      return "رابط مخصص";
  }
}
