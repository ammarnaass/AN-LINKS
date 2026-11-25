export type NfcCardMaterial =
  | "matte_black"
  | "brushed_metal"
  | "emerald_glass"
  | "pearl_minimal"
  | "royal_gold";

export type NfcCardOrientation = "horizontal" | "vertical";
export type NfcTargetMode = "BIO_PAGE" | "DIRECT_URL" | "VCARD";

export interface NfcCardMaterialPreset {
  key: NfcCardMaterial;
  labelAr: string;
  bgClass: string;
  textClass: string;
  mutedClass: string;
  borderClass: string;
  previewSwatch: string;
}

export const NFC_CARD_MATERIALS: NfcCardMaterialPreset[] = [
  {
    key: "matte_black",
    labelAr: "أسود مطفي فاخر",
    bgClass: "bg-gradient-to-br from-zinc-900 via-neutral-950 to-black",
    textClass: "text-white",
    mutedClass: "text-zinc-400",
    borderClass: "border-white/15",
    previewSwatch: "#18181b",
  },
  {
    key: "brushed_metal",
    labelAr: "معدني تيتانيوم",
    bgClass: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950",
    textClass: "text-slate-50",
    mutedClass: "text-slate-300",
    borderClass: "border-slate-400/30",
    previewSwatch: "#334155",
  },
  {
    key: "emerald_glass",
    labelAr: "زجاج زمردي",
    bgClass: "bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950",
    textClass: "text-emerald-50",
    mutedClass: "text-emerald-200/75",
    borderClass: "border-emerald-400/30",
    previewSwatch: "#064e3b",
  },
  {
    key: "pearl_minimal",
    labelAr: "لؤلؤي فاتح",
    bgClass: "bg-gradient-to-br from-stone-50 via-white to-slate-100",
    textClass: "text-slate-900",
    mutedClass: "text-slate-600",
    borderClass: "border-slate-300",
    previewSwatch: "#f8fafc",
  },
  {
    key: "royal_gold",
    labelAr: "ذهبي ملكي",
    bgClass: "bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950",
    textClass: "text-amber-50",
    mutedClass: "text-amber-200/80",
    borderClass: "border-amber-400/40",
    previewSwatch: "#78350f",
  },
];

export interface NfcCardConfigDTO {
  id: string;
  cardCode: string;
  nfcTapUrl: string;
  qrScanUrl: string;
  username: string;
  avatarUrl: string | null;
  isEnabled: boolean;
  cardTitle: string;
  cardSubtitle: string;
  material: NfcCardMaterial;
  orientation: NfcCardOrientation;
  accentColor: string;
  showAvatar: boolean;
  showNfcIcon: boolean;
  showQrOnBack: boolean;
  showBarcodeOnBack: boolean;
  targetMode: NfcTargetMode;
  customTargetUrl: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardCompany: string;
  qrForeground: string;
  qrBackground: string;
  barcodeValue: string;
  tapCount: number;
  qrScanCount: number;
  lastTappedAt: string | null;
  qrSvgMarkup: string;
  qrPngDataUrl: string;
}

export interface UpdateNfcCardInput {
  isEnabled?: boolean;
  cardTitle?: string;
  cardSubtitle?: string;
  material?: NfcCardMaterial;
  orientation?: NfcCardOrientation;
  accentColor?: string;
  showAvatar?: boolean;
  showNfcIcon?: boolean;
  showQrOnBack?: boolean;
  showBarcodeOnBack?: boolean;
  targetMode?: NfcTargetMode;
  customTargetUrl?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  vcardCompany?: string;
  qrForeground?: string;
  qrBackground?: string;
  barcodeValue?: string;
}
