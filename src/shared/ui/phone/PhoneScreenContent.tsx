import React from "react";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { SocialIcons } from "../SocialIcons";
import { resolveThemeStyles, BORDER_RADIUS_MAP } from "@/features/appearance";

export interface PhoneScreenContentProps {
  displayName?: string;
  username?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  links?: Array<{
    id: string;
    title: string;
    url: string;
    isActive?: boolean;
    thumbnailUrl?: string | null;
    customBgColor?: string | null;
    customTextColor?: string | null;
    customBorderColor?: string | null;
    customShadow?: string | null;
  }>;
  socials?: Array<{ network: string; url: string; position?: number }>;
  themeKey?: string | null;
  accentColor?: string | null;
  buttonStyle?: string | null;
  borderRadius?: string | null;
  font?: string | null;
  backgroundType?: string | null;
  customBackground?: string | null;
  buttonShadow?: string | null;
  socialPosition?: string | null;
  bgOverlayOpacity?: number | null;
  cardStyle?: string | null;
}

export function PhoneScreenContent({
  displayName,
  username,
  bio,
  avatarUrl,
  links = [],
  socials = [],
  themeKey,
  accentColor,
  buttonStyle,
  borderRadius = "rounded-xl",
  font,
  backgroundType,
  customBackground,
  buttonShadow,
  socialPosition = "top",
  bgOverlayOpacity,
  cardStyle,
}: PhoneScreenContentProps) {
  const styles = resolveThemeStyles({
    themeKey,
    accentColor,
    buttonStyle,
    borderRadius,
    font,
    backgroundType,
    customBackground,
    buttonShadow,
    bgOverlayOpacity,
    cardStyle,
  });

  const activeLinks = (links || []).filter((l) => l.isActive !== false);
  const initialLetter = (displayName?.trim()?.charAt(0) || username?.trim()?.charAt(0) || "ر").toUpperCase();
  const resolvedRadius = BORDER_RADIUS_MAP[borderRadius || "rounded-xl"] || borderRadius || "rounded-xl";

  const socialIconsBar = socials && socials.length > 0 ? (
    <div className="flex items-center justify-center flex-wrap gap-2 my-2.5 p-2 bg-surface-container/70 rounded-full border border-white/5">
      {socials.map((s, idx) => (
        <span
          key={idx}
          className={`w-7 h-7 rounded-full flex items-center justify-center ${styles.socialIconClass || "text-on-surface-variant"}`}
        >
          <SocialIcons network={s.network} className="w-3.5 h-3.5" />
        </span>
      ))}
    </div>
  ) : null;

  return (
    <div
      className={`relative w-full h-full min-h-full flex flex-col items-center justify-between px-4 pt-12 pb-6 select-none overflow-y-auto no-scrollbar ${styles.backgroundClass} ${styles.fontClass}`}
      style={styles.backgroundStyle}
    >
      {styles.overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={styles.overlayStyle} />
      )}
      <div className={`relative z-10 w-full flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${styles.cardClass}`}>
        {/* Profile Header */}
        <div className="flex flex-col items-center w-full">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full ring-2 ring-primary/40 p-1 bg-surface-container-high overflow-hidden shadow-lg flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || username || "المستخدم"}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-2xl select-none">
                  {initialLetter}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5 shadow">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <h3 className={`font-bold text-base flex items-center gap-1.5 mb-0.5 ${styles.textPrimaryClass}`}>
            <span>{displayName || username || "مستخدم منصة روابط"}</span>
          </h3>
          {username && (
            <p className={`text-xs font-semibold mb-2 ${styles.textSecondaryClass}`} dir="ltr">
              @{username}
            </p>
          )}
          {bio && (
            <p className={`text-xs max-w-[240px] leading-relaxed mb-3 text-center ${styles.textSecondaryClass}`}>
              {bio}
            </p>
          )}
        </div>

        {/* Top Socials */}
        {socialPosition !== "bottom" && socialIconsBar}

        {/* Dynamic Links List or Empty State */}
        {activeLinks.length > 0 ? (
          <div className="w-full flex flex-col gap-2.5 my-2">
            {activeLinks.map((link) => {
              const perLinkStyle: React.CSSProperties = {
                ...styles.buttonStyleProps,
                ...(link.customBgColor ? { backgroundColor: link.customBgColor } : {}),
                ...(link.customTextColor ? { color: link.customTextColor } : {}),
                ...(link.customBorderColor ? { borderColor: link.customBorderColor, borderWidth: "2px" } : {}),
              };
              const shadowClass = link.customShadow === "glow"
                ? "shadow-[0_0_15px_rgba(78,222,163,0.35)]"
                : link.customShadow === "strong"
                ? "shadow-xl"
                : link.customShadow === "soft"
                ? "shadow-md"
                : link.customShadow === "none"
                ? "shadow-none"
                : "";

              return (
                <div
                  key={link.id}
                  style={perLinkStyle}
                  className={`w-full p-2.5 ${resolvedRadius} ${styles.buttonClass} ${shadowClass} flex items-center justify-between transition-all text-xs font-semibold`}
                >
                  <div className="flex items-center gap-2 truncate pr-1">
                    {link.thumbnailUrl && (
                      <img src={link.thumbnailUrl} alt="" className="w-5 h-5 rounded-md object-cover shrink-0 border border-white/20" />
                    )}
                    <span className="truncate">{link.title}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full text-center py-6 px-4 rounded-xl bg-surface-container-low/60 border border-dashed border-outline-variant/40 my-2">
            <p className="text-xs text-on-surface-variant font-medium">
              لا توجد روابط منشورة حالياً
            </p>
          </div>
        )}

        {/* Bottom Socials */}
        {socialPosition === "bottom" && socialIconsBar}
      </div>

      {/* Footer Branding */}
      <div className="pt-4 pb-1 flex items-center gap-1 text-[11px] text-outline mt-auto shrink-0">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>مدعوم بواسطة AN LINKS</span>
      </div>
    </div>
  );
}
