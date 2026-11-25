import React from "react";
import { ProfileData, SocialItem } from "../types/bio.types";

interface ProfileJsonLdProps {
  profile: ProfileData;
  username: string;
  socials?: SocialItem[];
  canonicalOrigin?: string;
}

/**
 * Generates schema.org ProfilePage + Person structured JSON-LD data for rich search snippets.
 */
export function buildProfileJsonLdSchema({
  profile,
  username,
  socials = [],
  canonicalOrigin = process.env.NEXTAUTH_URL || "https://anlinks.dev",
}: ProfileJsonLdProps) {
  const baseUrl = canonicalOrigin.replace(/\/$/, "");
  const profileUrl = `${baseUrl}/${encodeURIComponent(username)}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    mainEntity: {
      "@type": "Person",
      name: profile.displayName,
      alternateName: `@${username}`,
      description: profile.bio || undefined,
      image: profile.avatarUrl || undefined,
      url: profileUrl,
      sameAs: socials.map((s) => s.url).filter(Boolean),
    },
  };
}

export function ProfileJsonLd(props: ProfileJsonLdProps) {
  const schema = buildProfileJsonLdSchema(props);
  // Escape '<' to prevent inline script tag injection
  const safeJson = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
