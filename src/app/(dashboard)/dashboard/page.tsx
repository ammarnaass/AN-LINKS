"use client";

import React, { useState } from "react";
import { LinkEditor, LinkData } from "@/components/dashboard/LinkEditor";
import { ThemeCustomizer } from "@/components/dashboard/ThemeCustomizer";
import { SocialLinksEditor } from "@/components/dashboard/SocialLinksEditor";
import { MobilePreview } from "@/components/dashboard/MobilePreview";
import { ProfileData } from "@/components/public/BioPageContent";
import { SocialItem } from "@/components/public/ProfileCard";
import { Link2, Palette, Share2, Save, Check } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "socials">("links");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initial state for demonstration / editing
  const [username] = useState("ammar");
  const [profile, setProfile] = useState<ProfileData>({
    displayName: "عمار - مطور ومصمم",
    bio: "أشارك معكم أحدث المشاريع التقنية والمصادر المفيدة في تطوير الويب والذكاء الاصطناعي.",
    avatarUrl: null,
    themeKey: "default",
    accentColor: "#3B82F6",
    buttonStyle: "filled",
    borderRadius: "rounded-xl",
    font: "Cairo",
  });

  const [links, setLinks] = useState<LinkData[]>([
    {
      id: "1",
      title: "موقعي الشخصي ومعرض الأعمال",
      url: "https://ammar.dev",
      isActive: true,
      position: 0,
    },
    {
      id: "2",
      title: "قناتي التقنية على يوتيوب",
      url: "https://youtube.com/@tech",
      isActive: true,
      position: 1,
    },
    {
      id: "3",
      title: "تواصل معي عبر واتساب",
      url: "https://wa.me/966500000000",
      isActive: true,
      position: 2,
    },
  ]);

  const [socials, setSocials] = useState<SocialItem[]>([
    { id: "s1", network: "x", url: "https://x.com/ammar" },
    { id: "s2", network: "github", url: "https://github.com/ammar" },
    { id: "s3", network: "instagram", url: "https://instagram.com/ammar" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    // Simulate saving changes
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة صفحتك</h1>
          <p className="text-xs text-gray-500 mt-1">
            رابط صفحتك المباشر:{" "}
            <a
              href={`/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-mono"
              dir="ltr"
            >
              /{username}
            </a>
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-green-300" />
              <span>تم الحفظ بنجاح</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
            </>
          )}
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Management Tabs & Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === "links"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>الروابط ({links.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === "appearance"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>المظهر والقوالب</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("socials")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === "socials"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>التواصل ({socials.length})</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === "links" && (
            <LinkEditor links={links} onLinksChange={setLinks} />
          )}

          {activeTab === "appearance" && (
            <ThemeCustomizer profile={profile} onProfileChange={setProfile} />
          )}

          {activeTab === "socials" && (
            <SocialLinksEditor socials={socials} onSocialsChange={setSocials} />
          )}
        </div>

        {/* Right Column: Live Mobile Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <MobilePreview
            profile={profile}
            username={username}
            links={links}
            socials={socials}
          />
        </div>
      </div>
    </div>
  );
}
