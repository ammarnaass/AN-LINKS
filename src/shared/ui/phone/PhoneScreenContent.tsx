import React from "react";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { SocialIcons } from "../SocialIcons";

export interface PhoneScreenContentProps {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  links?: Array<{ id: string; title: string; url: string; isActive?: boolean }>;
  themeKey?: string;
}

const DEFAULT_LINKS = [
  { id: "1", title: "متجري الرقمي - قوالب وتطبيقات", url: "https://store.anlinks.dev", isActive: true },
  { id: "2", title: "قناتي على يوتيوب - أحدث حلقة", url: "https://youtube.com", isActive: true },
  { id: "3", title: "حجز استشارة خاصة عبر واتساب", url: "https://wa.me", isActive: true },
];

export function PhoneScreenContent({
  displayName = "فيصل الشمري",
  username = "faisal_client",
  bio = "صانع محتوى تقني وتجارة رقمية 🚀 | روابطي ومتاجري الرسمية",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  links = DEFAULT_LINKS,
}: PhoneScreenContentProps) {
  const activeLinks = links.filter((l) => l.isActive !== false);

  return (
    <div className="flex-1 w-full px-5 py-3 flex flex-col items-center justify-between text-center overflow-y-auto no-scrollbar font-cairo">
      {/* Profile Header */}
      <div className="flex flex-col items-center w-full">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full ring-2 ring-primary/40 p-1 bg-surface-container-high overflow-hidden shadow-lg">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5 shadow">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <h3 className="font-bold text-base text-on-surface flex items-center gap-1.5 mb-0.5">
          <span>{displayName}</span>
        </h3>
        <p className="text-xs text-primary font-semibold mb-2" dir="ltr">
          @{username}
        </p>
        <p className="text-xs text-on-surface-variant max-w-[240px] leading-relaxed mb-4">
          {bio}
        </p>

        {/* Social Icons Bar */}
        <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-surface-container/70 rounded-full border border-white/5">
          <SocialIcons network="x" className="w-3.5 h-3.5 text-on-surface-variant" />
          <SocialIcons network="youtube" className="w-3.5 h-3.5 text-on-surface-variant" />
          <SocialIcons network="github" className="w-3.5 h-3.5 text-on-surface-variant" />
          <SocialIcons network="instagram" className="w-3.5 h-3.5 text-on-surface-variant" />
        </div>
      </div>

      {/* Dynamic Links List */}
      <div className="w-full flex flex-col gap-2.5 my-2">
        {activeLinks.map((link) => (
          <div
            key={link.id}
            className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center justify-between transition-all hover:border-primary/40 hover:bg-surface-container-high text-xs font-semibold shadow-xs"
          >
            <span className="truncate pr-1">{link.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-outline shrink-0" />
          </div>
        ))}
      </div>

      {/* Footer Branding */}
      <div className="pt-3 pb-1 flex items-center gap-1 text-[11px] text-outline">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>مدعوم بواسطة روابط | AN LINKS</span>
      </div>
    </div>
  );
}

