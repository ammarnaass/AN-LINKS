import { AvatarFrameShape, AvatarBorderWidth, BadgeShape, BadgeSize } from "../types/appearance.types";

export interface AvatarFrameOption {
  value: AvatarFrameShape;
  labelAr: string;
  clipPath?: string;
  borderRadius?: string;
}

export const AVATAR_FRAME_SHAPES: AvatarFrameOption[] = [
  {
    value: "circle",
    labelAr: "دائري ناعم",
    borderRadius: "rounded-full",
  },
  {
    value: "squircle",
    labelAr: "مربع انسيابي",
    borderRadius: "rounded-2xl sm:rounded-3xl",
  },
  {
    value: "hexagon",
    labelAr: "سداسي عصري",
    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  },
  {
    value: "octagon",
    labelAr: "مثمن تقني",
    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  },
  {
    value: "none",
    labelAr: "بدون إطار",
    borderRadius: "rounded-full",
  },
];

export const AVATAR_BORDER_WIDTHS: { value: AvatarBorderWidth; labelAr: string; px: number }[] = [
  { value: "0", labelAr: "بدون (0px)", px: 0 },
  { value: "2", labelAr: "نحيف (2px)", px: 2 },
  { value: "4", labelAr: "متوسط (4px)", px: 4 },
  { value: "6", labelAr: "سميك (6px)", px: 6 },
  { value: "8", labelAr: "عريض بارز (8px)", px: 8 },
];

export const BADGE_SHAPES: { value: BadgeShape; labelAr: string; clipPath?: string; borderRadius?: string }[] = [
  {
    value: "circle",
    labelAr: "دائري كلاسيك",
    borderRadius: "rounded-full",
  },
  {
    value: "shield",
    labelAr: "درع حماية",
    clipPath: "polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%)",
  },
  {
    value: "star",
    labelAr: "نجمة شرفية",
    clipPath: "polygon(50% 0%, 65% 28%, 95% 35%, 75% 60%, 79% 91%, 50% 77%, 21% 91%, 25% 60%, 5% 35%, 35% 28%)",
  },
  {
    value: "scallop",
    labelAr: "وردة مضلعة",
    clipPath: "polygon(50% 0%, 63% 5%, 75% 15%, 85% 25%, 95% 37%, 100% 50%, 95% 63%, 85% 75%, 75% 85%, 63% 95%, 50% 100%, 37% 95%, 25% 85%, 15% 75%, 5% 63%, 0% 50%, 5% 37%, 15% 25%, 25% 15%, 37% 5%)",
  },
  {
    value: "hexagon",
    labelAr: "سداسي مميز",
    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  },
];

export const BADGE_SIZES: { value: BadgeSize; labelAr: string; containerPx: number; iconPx: number }[] = [
  { value: "sm", labelAr: "صغير", containerPx: 18, iconPx: 12 },
  { value: "md", labelAr: "متوسط (افتراضي)", containerPx: 22, iconPx: 14 },
  { value: "lg", labelAr: "كبير", containerPx: 26, iconPx: 16 },
  { value: "xl", labelAr: "ضخم بارز", containerPx: 30, iconPx: 18 },
];

export interface BadgeIconItem {
  id: string;
  labelAr: string;
  category: "verified" | "royalty" | "energy" | "special";
}

export const BADGE_AVAILABLE_ICONS: BadgeIconItem[] = [
  { id: "CheckCircle2", labelAr: "علامة صح رسمية", category: "verified" },
  { id: "BadgeCheck", labelAr: "شارة معتمدة", category: "verified" },
  { id: "ShieldCheck", labelAr: "درع الأمان", category: "verified" },
  { id: "Crown", labelAr: "تاج ملكي", category: "royalty" },
  { id: "Award", labelAr: "وسام شرفي", category: "royalty" },
  { id: "Trophy", labelAr: "كأس تفوق", category: "royalty" },
  { id: "Star", labelAr: "نجمة ذهبية", category: "royalty" },
  { id: "Sparkles", labelAr: "بريق سحري", category: "energy" },
  { id: "Flame", labelAr: "شعلة حماس", category: "energy" },
  { id: "Zap", labelAr: "صاعقة طاقة", category: "energy" },
  { id: "Rocket", labelAr: "صاروخ نمو", category: "energy" },
  { id: "Diamond", labelAr: "ألماسة نادرة", category: "special" },
  { id: "Heart", labelAr: "قلب نابض", category: "special" },
  { id: "Gem", labelAr: "جوهرة ثمينة", category: "special" },
  { id: "Check", labelAr: "صح بسيط", category: "verified" },
];

export const PRESET_BADGE_COLORS = [
  { color: "#10b981", label: "أخضر موثق" },
  { color: "#3b82f6", label: "أزرق رسمي" },
  { color: "#f59e0b", label: "ذهبي ملكي" },
  { color: "#8b5cf6", label: "أرجواني مميز" },
  { color: "#ec4899", label: "وردي نيون" },
  { color: "#06b6d4", label: "تركواز سماوي" },
  { color: "#ef4444", label: "قرمزي ساطع" },
];
