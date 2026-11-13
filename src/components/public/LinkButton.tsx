import React from "react";
import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";
import { THEMES, BUTTON_STYLES } from "@/lib/themes";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
}

interface LinkButtonProps {
  link: LinkItem;
  themeKey?: string;
  buttonStyle?: string;
  borderRadius?: string;
  accentColor?: string;
  isPreview?: boolean;
}

export function LinkButton({
  link,
  themeKey = "default",
  buttonStyle = "filled",
  borderRadius = "rounded-xl",
  accentColor,
  isPreview = false,
}: LinkButtonProps) {
  const theme = THEMES[themeKey] || THEMES.default;
  const styleModifier = BUTTON_STYLES[buttonStyle] || "";
  const href = isPreview ? "#" : `/go/${link.id}`;

  const customStyle: React.CSSProperties = {};
  if (accentColor && buttonStyle === "filled") {
    customStyle.borderColor = accentColor;
  }

  const content = (
    <div
      className={`group relative w-full py-3.5 px-5 flex items-center justify-between transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${theme.buttonClass} ${borderRadius} ${styleModifier}`}
      style={customStyle}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center">
          <Globe className="w-4 h-4 opacity-75" />
        </div>
        <span className="font-medium text-sm sm:text-base truncate">{link.title}</span>
      </div>

      <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  if (isPreview) {
    return <div className="cursor-pointer">{content}</div>;
  }

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
      {content}
    </Link>
  );
}

