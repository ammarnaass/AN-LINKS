import React from "react";
import {
  InstagramIcon,
  TwitterXIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/public/SocialIcons";
import { CheckCircle2, ExternalLink } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto max-w-[320px] sm:max-w-[340px]">
      {/* Outer Phone Shell */}
      <div className="relative rounded-[44px] p-3.5 bg-gray-900 shadow-2xl ring-1 ring-gray-800/60 shadow-blue-500/10">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800" />
        </div>

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white p-6 pt-10 min-h-[560px] flex flex-col items-center justify-between">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-3 w-full">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-white uppercase overflow-hidden">
                  س
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5">
                <CheckCircle2 className="w-4 h-4 fill-current text-white" />
              </div>
            </div>

            {/* Names */}
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg text-white">سارة أحمد</h3>
              <p className="text-xs font-mono text-gray-400 dir-ltr" dir="ltr">
                @sara_design
              </p>
            </div>

            {/* Bio */}
            <p className="text-xs text-gray-300 leading-relaxed max-w-[260px]">
              مصممة واجهات ومطورة تجارب مستخدم 🎨 صانعة محتوى ومؤسسة مجتمع التصميم العربي.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                <TwitterXIcon className="w-3.5 h-3.5" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                <YoutubeIcon className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Links List */}
          <div className="w-full space-y-2.5 my-4">
            <div className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-right flex items-center justify-between text-xs font-medium text-white transition shadow-sm">
              <span>🛍️ متجري وقوالبي الرقمية</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </div>

            <div className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-right flex items-center justify-between text-xs font-medium text-white transition shadow-sm">
              <span>🎥 دورة التصميم المجانية على يوتيوب</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </div>

            <div className="w-full p-3 rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 text-right flex items-center justify-between text-xs font-semibold text-white transition shadow-md shadow-blue-500/20">
              <span>💬 احجز استشارة تصميم خاصة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Platform Watermark */}
          <div className="text-[10px] text-gray-500 font-medium tracking-wide">
            ⚡ صُمم بواسطة AN LINKS
          </div>
        </div>
      </div>
    </div>
  );
}
