import QRCode from "qrcode";
import { prisma } from "@/shared/db";
import {
  NFC_CARD_MATERIALS,
  NFC_CARD_PATTERNS,
  NFC_CARD_SHAPES,
  NfcCardConfigDTO,
  NfcCardMaterial,
  NfcCardOrientation,
  NfcCardPattern,
  NfcCardShape,
  NfcTargetMode,
  UpdateNfcCardInput,
} from "../types/nfc.types";
import { getNfcAppOrigin, validateNfcRedirectUrl } from "./nfc-scan.service";

export { resolveNfcScan, validateNfcRedirectUrl } from "./nfc-scan.service";
export type { NfcScanResolution } from "./nfc-scan.service";

const VALID_MATERIALS = new Set<string>(NFC_CARD_MATERIALS.map((m) => m.key));
const VALID_ORIENTATIONS = new Set<string>(["horizontal", "vertical"]);
const VALID_SHAPES = new Set<string>(NFC_CARD_SHAPES.map((s) => s.key));
const VALID_PATTERNS = new Set<string>(NFC_CARD_PATTERNS.map((p) => p.key));
const VALID_MODES = new Set<string>(["BIO_PAGE", "DIRECT_URL", "VCARD"]);

function sanitizeHexColor(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : fallback;
}

async function generateQrAssets(targetUrl: string, fg: string, bg: string) {
  const [qrSvgMarkup, qrPngDataUrl] = await Promise.all([
    QRCode.toString(targetUrl, {
      type: "svg",
      margin: 1,
      width: 240,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: "M",
    }),
    QRCode.toDataURL(targetUrl, {
      margin: 2,
      width: 512,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: "M",
    }),
  ]);
  return { qrSvgMarkup, qrPngDataUrl };
}

function buildDefaultCardCode(username: string): string {
  const cleaned = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `an-${cleaned || "card"}`;
}

async function toNfcCardDto(
  row: Awaited<ReturnType<typeof prisma.nfcCard.upsert>>,
  username: string,
  avatarUrl: string | null
): Promise<NfcCardConfigDTO> {
  const origin = getNfcAppOrigin();
  const nfcTapUrl = `${origin}/nfc/${row.cardCode}`;
  const qrScanUrl = `${origin}/nfc/${row.cardCode}?src=qr`;
  const { qrSvgMarkup, qrPngDataUrl } = await generateQrAssets(
    qrScanUrl,
    row.qrForeground,
    row.qrBackground
  );

  return {
    id: row.id,
    cardCode: row.cardCode,
    nfcTapUrl,
    qrScanUrl,
    username,
    avatarUrl,
    isEnabled: row.isEnabled,
    cardTitle: row.cardTitle,
    cardSubtitle: row.cardSubtitle || "",
    material: (VALID_MATERIALS.has(row.material) ? row.material : "matte_black") as NfcCardMaterial,
    orientation: (VALID_ORIENTATIONS.has(row.orientation)
      ? row.orientation
      : "horizontal") as NfcCardOrientation,
    accentColor: row.accentColor,
    customBgColor: row.customBgColor || "#111827",
    customTextColor: row.customTextColor || "#ffffff",
    cardShape: (VALID_SHAPES.has(row.cardShape) ? row.cardShape : "rounded") as NfcCardShape,
    cardPattern: (VALID_PATTERNS.has(row.cardPattern) ? row.cardPattern : "glow") as NfcCardPattern,
    showAvatar: row.showAvatar,
    showNfcIcon: row.showNfcIcon,
    showQrOnBack: row.showQrOnBack,
    showBarcodeOnBack: row.showBarcodeOnBack,
    targetMode: (VALID_MODES.has(row.targetMode) ? row.targetMode : "BIO_PAGE") as NfcTargetMode,
    customTargetUrl: row.customTargetUrl || "",
    vcardPhone: row.vcardPhone || "",
    vcardEmail: row.vcardEmail || "",
    vcardCompany: row.vcardCompany || "",
    qrForeground: row.qrForeground,
    qrBackground: row.qrBackground,
    barcodeValue: row.barcodeValue,
    tapCount: row.tapCount,
    qrScanCount: row.qrScanCount,
    lastTappedAt: row.lastTappedAt ? row.lastTappedAt.toISOString() : null,
    qrSvgMarkup,
    qrPngDataUrl,
  };
}

export async function getOrCreateUserNfcCard(userId: string): Promise<NfcCardConfigDTO> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!user) throw new Error("المستخدم غير موجود");

  const cardCode = buildDefaultCardCode(user.username);
  const row = await prisma.nfcCard.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      cardCode,
      cardTitle: user.profile?.displayName || user.username,
      cardSubtitle: `@${user.username}`,
      accentColor: user.profile?.accentColor || "#4edea3",
      barcodeValue: `AN-${user.username.toUpperCase()}`,
      vcardPhone: user.profile?.phone || null,
      vcardEmail: user.email,
    },
  });

  return toNfcCardDto(row, user.username, user.profile?.avatarUrl || null);
}

export async function updateUserNfcCard(
  userId: string,
  input: UpdateNfcCardInput
): Promise<NfcCardConfigDTO> {
  const current = await getOrCreateUserNfcCard(userId);
  const nextMode =
    input.targetMode && VALID_MODES.has(input.targetMode) ? input.targetMode : current.targetMode;

  let nextCustomUrl =
    input.customTargetUrl !== undefined ? input.customTargetUrl.trim() : current.customTargetUrl;
  if (nextMode === "DIRECT_URL") {
    nextCustomUrl = validateNfcRedirectUrl(nextCustomUrl);
  }

  const nextTitle =
    input.cardTitle !== undefined ? input.cardTitle.trim() || current.cardTitle : current.cardTitle;
  const nextBarcode =
    input.barcodeValue !== undefined
      ? input.barcodeValue.replace(/[^\x20-\x7e]/g, "").trim().slice(0, 32) || current.barcodeValue
      : current.barcodeValue;

  const updated = await prisma.nfcCard.update({
    where: { userId },
    data: {
      isEnabled: input.isEnabled !== undefined ? Boolean(input.isEnabled) : current.isEnabled,
      cardTitle: nextTitle,
      cardSubtitle:
        input.cardSubtitle !== undefined ? input.cardSubtitle.trim() : current.cardSubtitle,
      material:
        input.material && VALID_MATERIALS.has(input.material) ? input.material : current.material,
      orientation:
        input.orientation && VALID_ORIENTATIONS.has(input.orientation)
          ? input.orientation
          : current.orientation,
      accentColor: sanitizeHexColor(input.accentColor, current.accentColor),
      customBgColor: sanitizeHexColor(input.customBgColor, current.customBgColor),
      customTextColor: sanitizeHexColor(input.customTextColor, current.customTextColor),
      cardShape:
        input.cardShape && VALID_SHAPES.has(input.cardShape) ? input.cardShape : current.cardShape,
      cardPattern:
        input.cardPattern && VALID_PATTERNS.has(input.cardPattern)
          ? input.cardPattern
          : current.cardPattern,
      showAvatar: input.showAvatar !== undefined ? Boolean(input.showAvatar) : current.showAvatar,
      showNfcIcon:
        input.showNfcIcon !== undefined ? Boolean(input.showNfcIcon) : current.showNfcIcon,
      showQrOnBack:
        input.showQrOnBack !== undefined ? Boolean(input.showQrOnBack) : current.showQrOnBack,
      showBarcodeOnBack:
        input.showBarcodeOnBack !== undefined
          ? Boolean(input.showBarcodeOnBack)
          : current.showBarcodeOnBack,
      targetMode: nextMode,
      customTargetUrl: nextCustomUrl || null,
      vcardPhone: input.vcardPhone !== undefined ? input.vcardPhone.trim() : current.vcardPhone,
      vcardEmail: input.vcardEmail !== undefined ? input.vcardEmail.trim() : current.vcardEmail,
      vcardCompany:
        input.vcardCompany !== undefined ? input.vcardCompany.trim() : current.vcardCompany,
      qrForeground: sanitizeHexColor(input.qrForeground, current.qrForeground),
      qrBackground: sanitizeHexColor(input.qrBackground, current.qrBackground),
      barcodeValue: nextBarcode,
    },
  });

  return toNfcCardDto(updated, current.username, current.avatarUrl);
}
