"use client";

import React, { useState } from "react";
import {
  LinkEditor,
  SocialLinksEditor,
  MobilePreview,
  DashboardHeader,
  LinksFilterTabs,
  LinkData,
  SocialItem,
} from "@/features/links";
import { ProfileData } from "@/components/public/BioPageContent";

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");
  const [isPageActive, setIsPageActive] = useState(true);

  // Profile data
  const [username] = useState("tariq");
  const [profile] = useState<ProfileData>({
    displayName: "طارق المنصور",
    bio: "مؤسس تقني ومهتم بتطوير الويب الحديث ومنتجات الذكاء الاصطناعي 🚀",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDna7yVuEnXkE1ufPbKTp2yol4T9COdyZll2lcYKRlNeUzJpMpnEBfnD3M68XcXc8kEgQaVCYlHheSZI6i4BArwW46uUwLiL0AUijGuUxlmZR8saKYCi5J0Y-RjvTxSCSM5PwCJNQcVVv-bZj7JqwMhBNpi9xJQexqUMFhyEW0SVdCDWQJXovdAuGZewp1Gpg3d1h7FUPw83mrxOoCEcWMJn1ZuvBEZUQoD0El4ED6E",
    themeKey: "layanDark",
    accentColor: "#4edea3",
    buttonStyle: "filled",
    borderRadius: "rounded-xl",
    font: "Cairo",
  });

  const [links, setLinks] = useState<LinkData[]>([
    {
      id: "1",
      title: "متجري الإلكتروني - عطور حصرية وعينات فاخرة",
      url: "https://store.tariq.sa",
      isActive: true,
      position: 0,
      category: "store",
      clicks: 1420,
    },
    {
      id: "2",
      title: "قناتي على يوتيوب - أحدث حلقة بودكاست عن الذكاء الاصطناعي",
      url: "https://youtube.com/@tariq",
      isActive: true,
      position: 1,
      category: "video",
      clicks: 890,
    },
    {
      id: "3",
      title: "حجز استشارة خاصة عبر واتساب (٣٠ دقيقة)",
      url: "https://wa.me/966500000000",
      isActive: true,
      position: 2,
      category: "chat",
      clicks: 340,
    },
    {
      id: "4",
      title: "مدونتي التقنية - مقالات متخصصة في البرمجة والتصميم",
      url: "https://blog.tariq.dev",
      isActive: true,
      position: 3,
      category: "blog",
      clicks: 215,
    },
    {
      id: "5",
      title: "عرض الجمعة البيضاء - خصم ٥٠٪ على كافة الدورات التدريبية",
      url: "https://courses.tariq.sa/bf2024",
      isActive: false,
      position: 4,
      category: "link",
      clicks: 0,
    },
  ]);

  const [socials, setSocials] = useState<SocialItem[]>([
    { id: "s1", network: "instagram", url: "https://instagram.com/tariq" },
    { id: "s2", network: "x", url: "https://x.com/tariq" },
    { id: "s3", network: "youtube", url: "https://youtube.com/@tariq" },
    { id: "s4", network: "tiktok", url: "https://tiktok.com/@tariq" },
    { id: "s5", network: "whatsapp", url: "https://wa.me/966500000000" },
    { id: "s6", network: "telegram", url: "https://t.me/tariq" },
    { id: "s7", network: "linkedin", url: "https://linkedin.com/in/tariq" },
  ]);

  const activeCount = links.filter((l) => l.isActive).length;
  const draftCount = links.filter((l) => !l.isActive).length;

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
            onLinksChange={setLinks}
            filter={filter}
          />

          <SocialLinksEditor
            socials={socials}
            onSocialsChange={setSocials}
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
