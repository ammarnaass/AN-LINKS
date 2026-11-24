import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  extractYouTubeEmbedUrl,
  extractSpotifyEmbedUrl,
  detectAutoLinkType,
  getLinkTypeLabel,
} from "@/features/links/utils/media-embed";
import {
  BioSectionHeader,
  BioYouTubeEmbed,
  BioSpotifyEmbed,
} from "@/features/bio/components/BioMediaEmbeds";
import { LinkButton } from "@/features/bio/components/LinkButton";

describe("Media Embeds & Section Headers Suite", () => {
  it("extracts YouTube embed URLs accurately across various formats", () => {
    expect(extractYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
    expect(extractYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
    expect(extractYouTubeEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
    expect(extractYouTubeEmbedUrl("https://example.com/not-youtube")).toBeNull();
  });

  it("extracts Spotify embed URLs accurately for tracks, albums and playlists", () => {
    expect(extractSpotifyEmbedUrl("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT")).toBe(
      "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT"
    );
    expect(extractSpotifyEmbedUrl("https://open.spotify.com/album/4cOdK2wGLETKBW3PvgPWqT")).toBe(
      "https://open.spotify.com/embed/album/4cOdK2wGLETKBW3PvgPWqT"
    );
    expect(extractSpotifyEmbedUrl("https://example.com/not-spotify")).toBeNull();
  });

  it("detects auto link types correctly", () => {
    expect(detectAutoLinkType("https://youtu.be/dQw4w9WgXcQ")).toBe("YOUTUBE");
    expect(detectAutoLinkType("https://open.spotify.com/track/12345")).toBe("SPOTIFY");
    expect(detectAutoLinkType("https://myportfolio.com")).toBe("LINK");
  });

  it("returns appropriate Arabic labels for link types", () => {
    expect(getLinkTypeLabel("HEADER")).toBe("عنوان قسم");
    expect(getLinkTypeLabel("YOUTUBE")).toBe("فيديو يوتيوب");
    expect(getLinkTypeLabel("SPOTIFY")).toBe("صوتيات سبوتيفاي");
    expect(getLinkTypeLabel("LINK")).toBe("رابط مخصص");
  });

  it("renders BioSectionHeader with divider and title", () => {
    const html = renderToStaticMarkup(
      React.createElement(BioSectionHeader, { title: "مشاريعي البرمجية" })
    );
    expect(html).toContain("مشاريعي البرمجية");
  });

  it("renders BioYouTubeEmbed with iframe and title badge", () => {
    const html = renderToStaticMarkup(
      React.createElement(BioYouTubeEmbed, {
        title: "فيديو تدشين الخدمة",
        url: "https://youtu.be/dQw4w9WgXcQ",
      })
    );
    expect(html).toContain("فيديو تدشين الخدمة");
    expect(html).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(html).toContain("YouTube");
  });

  it("renders BioSpotifyEmbed with spotify iframe player", () => {
    const html = renderToStaticMarkup(
      React.createElement(BioSpotifyEmbed, {
        title: "البودكاست الأسبوعي",
        url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
      })
    );
    expect(html).toContain("https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT");
  });

  it("delegates to proper embed in LinkButton when link.type is specified", () => {
    const headerHtml = renderToStaticMarkup(
      React.createElement(LinkButton, {
        link: {
          id: "hdr-1",
          title: "قسم المنتجات",
          url: "https://header.anlinks.dev",
          type: "HEADER",
          isActive: true,
          position: 0,
        },
      })
    );
    expect(headerHtml).toContain("قسم المنتجات");

    const ytHtml = renderToStaticMarkup(
      React.createElement(LinkButton, {
        link: {
          id: "yt-1",
          title: "شاهد العرض",
          url: "https://youtu.be/dQw4w9WgXcQ",
          type: "YOUTUBE",
          isActive: true,
          position: 1,
        },
      })
    );
    expect(ytHtml).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });
});
