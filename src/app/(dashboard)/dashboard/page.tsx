"use client";

import React, { useState, useEffect } from "react";
import {
  LinkEditor,
  SocialLinksEditor,
  MobilePreview,
  DashboardHeader,
  LinksFilterTabs,
  LinkData,
  SocialItem,
} from "@/features/links";
import { fetchUserLinks, batchReorderLinksClient } from "@/features/links/services/links.client";
import { ProfileData } from "@/components/public/BioPageContent";

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");
  const [isPageActive, setIsPageActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<ProfileData>({
    displayName: "صانع محتوى",
    bio: "",
    themeKey: "default",
    accentColor: "#4edea3",
    buttonStyle: "filled",
    borderRadius: "rounded-xl",
    font: "Cairo",
  });

  const [links, setLinks] = useState<LinkData[]>([]);
  const [socials, setSocials] = useState<SocialItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/profile").then((r) => (r.ok ? r.json() : null)),
      fetchUserLinks().catch(() => ({ links: [], socials: [] })),
    ])
      .then(([pData, lData]) => {
        if (!isMounted) return;
        if (pData?.success && pData.profile) {
          setProfile({
            displayName: pData.profile.displayName || pData.profile.username,
            bio: pData.profile.bio || "",
            avatarUrl: pData.profile.avatarUrl || undefined,
            themeKey: pData.profile.themeKey || "default",
            accentColor: pData.profile.accentColor || "#4edea3",
            buttonStyle: pData.profile.buttonStyle || "filled",
            borderRadius: pData.profile.borderRadius || "rounded-xl",
            font: pData.profile.font || "Cairo",
          });
          setUsername(pData.profile.username || "");
          setIsPageActive(pData.profile.isPublished !== false);
        }
        if (lData) {
          setLinks(lData.links || []);
          setSocials(lData.socials || []);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLinksChange = async (newLinks: LinkData[]) => {
    setLinks(newLinks);
    try {
      await batchReorderLinksClient({
        links: newLinks.map((l, idx) => ({ id: l.id, position: idx, isActive: l.isActive })),
      });
    } catch (err) {
      console.error("Save links failed:", err);
    }
  };

  const handleSocialsChange = async (newSocials: SocialItem[]) => {
    setSocials(newSocials);
    try {
      await batchReorderLinksClient({
        links: [],
        socials: newSocials,
      });
    } catch (err) {
      console.error("Save socials failed:", err);
    }
  };

  const activeCount = links.filter((l) => l.isActive).length;
  const draftCount = links.filter((l) => !l.isActive).length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-surface-container-high rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 bg-surface-container-low rounded-2xl" />
          <div className="lg:col-span-5 h-96 bg-surface-container-low rounded-2xl hidden lg:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        displayName={profile.displayName}
        avatarUrl={profile.avatarUrl}
        username={username}
        isPageActive={isPageActive}
        onTogglePageActive={() => setIsPageActive(!isPageActive)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 space-y-6">
          <LinksFilterTabs
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            draftCount={draftCount}
          />

          <LinkEditor
            links={links}
            onLinksChange={handleLinksChange}
            filter={filter}
          />

          <SocialLinksEditor
            socials={socials}
            onSocialsChange={handleSocialsChange}
          />
        </section>

        <section className="lg:col-span-5 hidden lg:block">
          <MobilePreview
            profile={profile}
            username={username}
            links={links}
            socials={socials}
          />
        </section>
      </div>
    </div>
  );
}
