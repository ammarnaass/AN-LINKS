import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AVATAR_FRAME_SHAPES,
  AVATAR_BORDER_WIDTHS,
  BADGE_SHAPES,
  BADGE_SIZES,
  BADGE_AVAILABLE_ICONS,
} from "@/features/appearance/constants/avatar-badge.constants";
import {
  getAvatarFrameStyles,
  getBadgeStyles,
  renderBadgeIconComponent,
} from "@/features/appearance/utils/avatar-frame.utils";
import { ProfileBadgeRenderer } from "@/features/bio/components/profile/ProfileBadgeRenderer";
import { ProfileCard } from "@/features/bio/components/ProfileCard";
import { PhoneScreenContent } from "@/shared/ui/phone/PhoneScreenContent";
import { PATCH as profilePatch } from "@/app/api/profile/route";
import { NextRequest } from "next/server";
import { prisma } from "@/shared/db";
import { getServerSession } from "next-auth";

vi.mock("next-auth", () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

describe("Creator Avatar Frame & Profile Badge Studio Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("verifies avatar frame and badge constants and options", () => {
    expect(AVATAR_FRAME_SHAPES.length).toBe(5);
    expect(AVATAR_FRAME_SHAPES.map((s) => s.value)).toEqual([
      "circle",
      "squircle",
      "hexagon",
      "octagon",
      "none",
    ]);

    expect(AVATAR_BORDER_WIDTHS.length).toBe(5);
    expect(AVATAR_BORDER_WIDTHS.map((w) => w.value)).toEqual(["0", "2", "4", "6", "8"]);

    expect(BADGE_SHAPES.length).toBe(5);
    expect(BADGE_SHAPES.map((b) => b.value)).toEqual([
      "circle",
      "shield",
      "star",
      "scallop",
      "hexagon",
    ]);

    expect(BADGE_SIZES.length).toBe(4);
    expect(BADGE_SIZES.map((sz) => sz.value)).toEqual(["sm", "md", "lg", "xl"]);
    expect(BADGE_AVAILABLE_ICONS.length).toBeGreaterThanOrEqual(12);
  });

  it("calculates avatar frame styles with clipPath and border correctly", () => {
    // Circle with 4px border
    const circle = getAvatarFrameStyles("circle", "4", "#6366f1");
    expect(circle.containerClass).toContain("rounded-full");
    expect(circle.containerStyle.borderWidth).toBe("4px");
    expect(circle.containerStyle.borderColor).toBe("#6366f1");

    // Hexagon with clipPath
    const hex = getAvatarFrameStyles("hexagon", "6", "#10b981");
    expect(hex.containerStyle.clipPath).toBeDefined();
    expect(hex.containerStyle.clipPath).toContain("polygon");
    expect(hex.containerStyle.borderWidth).toBe("6px");

    // None shape or 0 width
    const none = getAvatarFrameStyles("none", "0");
    expect(none.containerStyle.borderWidth).toBe(0);
  });

  it("calculates badge styles and renders all icon variants", () => {
    // Star shape badge
    const star = getBadgeStyles("star", "lg", "#f59e0b");
    expect(star.style.backgroundColor).toBe("#f59e0b");
    expect(star.style.clipPath).toContain("polygon");
    expect(star.style.width).toBe("26px");

    // Render icons
    for (const item of BADGE_AVAILABLE_ICONS) {
      const iconMarkup = renderToStaticMarkup(renderBadgeIconComponent(item.id, 16));
      expect(iconMarkup).toContain("<svg");
    }
  });

  it("renders ProfileBadgeRenderer and respects badgeEnabled toggle", () => {
    const markupEnabled = renderToStaticMarkup(
      <ProfileBadgeRenderer
        enabled={true}
        shape="shield"
        size="lg"
        color="#3b82f6"
        icon="ShieldCheck"
      />
    );
    expect(markupEnabled).toContain("span");
    expect(markupEnabled).toContain("background-color:#3b82f6");
    expect(markupEnabled).toContain("clip-path:polygon");

    const markupDisabled = renderToStaticMarkup(
      <ProfileBadgeRenderer enabled={false} />
    );
    expect(markupDisabled).toBe("");
  });

  it("renders customized avatar frame and badge in ProfileCard and PhoneScreenContent", () => {
    const profileCardMarkup = renderToStaticMarkup(
      <ProfileCard
        displayName="عمار المطور"
        username="ammar"
        avatarUrl="https://example.com/avatar.jpg"
        avatarFrameShape="squircle"
        avatarBorderWidth="4"
        avatarBorderColor="#ec4899"
        badgeEnabled={true}
        badgeShape="star"
        badgeSize="lg"
        badgeColor="#ec4899"
        badgeIcon="Crown"
      />
    );
    expect(profileCardMarkup).toContain("عمار المطور");
    expect(profileCardMarkup).toContain("border-color:#ec4899");
    expect(profileCardMarkup).toContain("border-width:4px");
    expect(profileCardMarkup).toContain("background-color:#ec4899");

    const phoneContentMarkup = renderToStaticMarkup(
      <PhoneScreenContent
        displayName="عمار المطور"
        username="ammar"
        avatarUrl="https://example.com/avatar.jpg"
        avatarFrameShape="hexagon"
        avatarBorderWidth="6"
        avatarBorderColor="#10b981"
        badgeEnabled={true}
        badgeShape="shield"
        badgeColor="#10b981"
        badgeIcon="Sparkles"
      />
    );
    expect(phoneContentMarkup).toContain("عمار المطور");
    expect(phoneContentMarkup).toContain("border-color:#10b981");
    expect(phoneContentMarkup).toContain("clip-path:polygon");
  });

  it("validates and saves avatar frame and badge settings via PATCH /api/profile", async () => {
    const mockUser = await prisma.user.findFirst({
      where: { profile: { isNot: null } },
      include: { profile: true },
    });

    if (!mockUser || !mockUser.profile) return;

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: mockUser.id, email: mockUser.email, role: "USER" },
    } as any);

    // Invalid enum test
    const invalidReq = new NextRequest("http://localhost:3002/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ avatarFrameShape: "invalid_triangle" }),
    });
    const invalidRes = await profilePatch(invalidReq);
    expect(invalidRes.status).toBe(400);

    // Valid update test
    const validReq = new NextRequest("http://localhost:3002/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        avatarFrameShape: "octagon",
        avatarBorderWidth: "6",
        avatarBorderColor: "#8b5cf6",
        badgeEnabled: true,
        badgeShape: "scallop",
        badgeSize: "xl",
        badgeColor: "#8b5cf6",
        badgeIcon: "Trophy",
      }),
    });
    const validRes = await profilePatch(validReq);
    expect(validRes.status).toBe(200);

    const updatedProfile = await prisma.profile.findUnique({
      where: { userId: mockUser.id },
    });
    expect(updatedProfile?.avatarFrameShape).toBe("octagon");
    expect(updatedProfile?.avatarBorderWidth).toBe("6");
    expect(updatedProfile?.avatarBorderColor).toBe("#8b5cf6");
    expect(updatedProfile?.badgeShape).toBe("scallop");
    expect(updatedProfile?.badgeSize).toBe("xl");
    expect(updatedProfile?.badgeIcon).toBe("Trophy");
  });
});
