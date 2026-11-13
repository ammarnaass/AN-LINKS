"use client";

import React, { useState } from "react";
import { LinkEditor, LinkData } from "@/components/dashboard/LinkEditor";
import { SocialLinksEditor } from "@/components/dashboard/SocialLinksEditor";
import { MobilePreview } from "@/components/dashboard/MobilePreview";
import { ProfileData } from "@/components/public/BioPageContent";
import { SocialItem } from "@/components/public/ProfileCard";
import { filterLinks } from "@/lib/dashboard-actions";
import { Check, Copy } from "lucide-react";

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");
  const [copied, setCopied] = useState(false);
  const [isPageActive, setIsPageActive] = useState(true);

  // Profile data
  const [username] = useState("tariq");
  const [profile, setProfile] = useState<ProfileData>({
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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Workspace Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
          <span className="text-on-surface font-semibold">لوحة التحكم</span>
          <span className="material-symbols-outlined text-[14px] [transform:scaleX(-1)]">chevron_left</span>
          <span className="text-primary font-medium">مدير الروابط والمنصات</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>المزامنة التلقائية فورية</span>
          </span>
          <span className="text-outline-variant text-xs">|</span>
          <span className="text-xs text-on-surface-variant">آخر تحديث: قبل لحظات</span>
        </div>
      </div>

      {/* Main Bento Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Side / Editor Workspace (7 cols on lg) */}
        <section className="lg:col-span-7 space-y-6">
          {/* Welcome & Profile Control Hero Card */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={profile.displayName}
                    className="w-16 h-16 rounded-full object-cover shadow-lg shadow-black/60 ring-2 ring-primary/40"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-on-surface">أهلاً بك، {profile.displayName}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                      موثّق
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-on-surface-variant text-xs" dir="ltr">
                      bio.link/{username}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 text-primary hover:text-primary-fixed transition-colors text-xs pr-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-primary" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Live Toggle */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-0 border-outline-variant/30">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-on-surface">حالة الصفحة</span>
                  <span className={`text-[11px] font-medium ${isPageActive ? "text-primary" : "text-on-surface-variant"}`}>
                    {isPageActive ? "نشطة ومتاحة للجمهور" : "مغلقة مؤقتاً"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPageActive}
                    onChange={(e) => setIsPageActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner" />
                </label>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 bg-surface-container/60 rounded-xl p-3 border border-outline-variant/20">
              <div className="flex flex-col px-2">
                <span className="text-xs text-on-surface-variant">إجمالي الزيارات</span>
                <span className="text-lg font-bold text-on-surface mt-0.5">٢٨,٤٥٠</span>
                <span className="text-[11px] text-primary flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px] [transform:scaleX(-1)]">trending_up</span>
                  <span>+١٤.٢٪ هذا الأسبوع</span>
                </span>
              </div>
              <div className="flex flex-col px-2 border-x border-outline-variant/30">
                <span className="text-xs text-on-surface-variant">النقرات على الروابط</span>
                <span className="text-lg font-bold text-on-surface mt-0.5">٩,١٢٠</span>
                <span className="text-[11px] text-primary flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px] [transform:scaleX(-1)]">trending_up</span>
                  <span>+٨.٦٪</span>
                </span>
              </div>
              <div className="flex flex-col px-2">
                <span className="text-xs text-on-surface-variant">معدل التحويل (CTR)</span>
                <span className="text-lg font-bold text-on-surface mt-0.5">٣٢.٠٪</span>
                <span className="text-[11px] text-tertiary flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  <span>ممتاز جداً</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Filter Pill Stack */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-on-surface text-base">إدارة المحتوى والمنصات</h3>
            <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === "all"
                    ? "bg-surface-container-highest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                الكل ({links.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === "active"
                    ? "bg-surface-container-highest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                النشطة ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("draft")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === "draft"
                    ? "bg-surface-container-highest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                المسودات ({draftCount})
              </button>
            </div>
          </div>

          {/* Section 1: Social Bar Configurator */}
          <SocialLinksEditor socials={socials} onSocialsChange={setSocials} />

          {/* Section 2: Links List */}
          <LinkEditor links={links} onLinksChange={setLinks} filter={filter} />
        </section>

        {/* Left Side / Live Mobile Preview (5 cols on lg) */}
        <section className="lg:col-span-5 flex justify-center">
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
