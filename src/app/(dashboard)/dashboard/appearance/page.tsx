"use client";

import React, { useState } from "react";
import { ThemeCustomizer } from "@/features/appearance";
import { MobilePreview, LinkData, SocialItem } from "@/features/links";
import { ProfileData } from "@/components/public/BioPageContent";
import { Check, Save } from "lucide-react";

export default function AppearancePage() {
  const [username] = useState("tariq");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    displayName: "طارق المنصور",
    bio: "مؤسس ومستشار في بناء المنتجات الرقمية الحديثة. أشارك تجاربي حول التقنية والتصميم.",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPcdTZmgJVmMd-w_D2QoUK_eqjdr2WN2K5TzsaY8YEilfbFKEdjg_yIk7T5d3_YrljgRBANuUk8ALwqqVIotKKCn2fmH48VPr4ej0k2dsnxIIxuomeyxb7SmJE99aCk84EOUuTjNMRI0WOno6N5T53fQRNicYVHgjlv6JTPV3t-bDlJTXJfMmeZ2X6MfdH4K7kBkRCrhHsKO7Jnmn9uwrp-EKXD1XJq3_B2xlIt7s-",
    themeKey: "layanDark",
    accentColor: "#4edea3",
    buttonStyle: "filled",
    borderRadius: "rounded-xl",
    font: "Cairo",
  });

  const [links] = useState<LinkData[]>([
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
  ]);

  const [socials] = useState<SocialItem[]>([
    { id: "s1", network: "instagram", url: "https://instagram.com/tariq" },
    { id: "s2", network: "x", url: "https://x.com/tariq" },
    { id: "s3", network: "youtube", url: "https://youtube.com/@tariq" },
    { id: "s4", network: "whatsapp", url: "https://wa.me/966500000000" },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-primary text-xs">
            <span className="material-symbols-outlined text-[16px]">palette</span>
            <span>استوديو التخصيص والمظهر الحي</span>
            <span className="mx-1 text-outline">/</span>
            <span className="text-on-surface-variant font-mono">@{username}</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">تخصيص المظهر والهوية</h1>
          <p className="text-xs text-on-surface-variant">
            تحكم بكافة التفاصيل البصرية لصفحتك الشخصية وشاهد انعكاسها الفوري في نافذة المحاكاة الذكية.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-[0_0_20px_rgba(78,222,163,0.35)] hover:bg-primary-fixed transition disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم الحفظ بنجاح!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? "جاري الحفظ..." : "حفظ المظهر ونشره"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (7 Cols on desktop) */}
        <div className="lg:col-span-7">
          <ThemeCustomizer profile={profile} onProfileChange={setProfile} />
        </div>

        {/* Live Preview Column (5 Cols on desktop) */}
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
