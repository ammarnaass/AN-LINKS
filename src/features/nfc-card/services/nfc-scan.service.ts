import { prisma } from "@/shared/db";
import { buildVCardPayload } from "../utils/vcard";

export function getNfcAppOrigin(): string {
  return (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function validateNfcRedirectUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error("يرجى إدخال رابط التوجيه المباشر عند اختيار وضع الرابط المخصص");
  }
  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//")) {
      throw new Error("الرابط غير صالح لأسباب أمنية");
    }
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("يُسمح فقط بروابط http:// أو https://");
    }
    return parsed.toString();
  } catch {
    throw new Error("صيغة رابط التوجيه غير صالحة (يجب أن يبدأ بـ https:// أو http://)");
  }
}

export type NfcScanResolution =
  | { status: "NOT_FOUND" }
  | { status: "DISABLED"; username: string; cardTitle: string }
  | { status: "REDIRECT"; url: string; username: string }
  | { status: "VCARD"; vcf: string; filename: string; username: string };

export async function resolveNfcScan(
  cardCode: string,
  source: "nfc" | "qr"
): Promise<NfcScanResolution> {
  const card = await prisma.nfcCard.findUnique({
    where: { cardCode },
    include: { user: { include: { profile: true } } },
  });

  if (!card || !card.user) return { status: "NOT_FOUND" };
  if (!card.isEnabled || card.user.isSuspended) {
    return { status: "DISABLED", username: card.user.username, cardTitle: card.cardTitle };
  }

  await prisma.nfcCard.update({
    where: { id: card.id },
    data: {
      tapCount: source === "nfc" ? { increment: 1 } : undefined,
      qrScanCount: source === "qr" ? { increment: 1 } : undefined,
      lastTappedAt: new Date(),
    },
  });

  const origin = getNfcAppOrigin();
  const bioUrl = `${origin}/${card.user.username}?source=${source}`;

  if (card.targetMode === "VCARD") {
    const vcf = buildVCardPayload({
      fullName: card.cardTitle || card.user.profile?.displayName || card.user.username,
      title: card.cardSubtitle || undefined,
      company: card.vcardCompany || undefined,
      phone: card.vcardPhone || card.user.profile?.phone || undefined,
      email: card.vcardEmail || card.user.email || undefined,
      profileUrl: `${origin}/${card.user.username}`,
    });
    return { status: "VCARD", vcf, filename: `${card.user.username}.vcf`, username: card.user.username };
  }

  if (card.targetMode === "DIRECT_URL" && card.customTargetUrl) {
    try {
      const safeUrl = validateNfcRedirectUrl(card.customTargetUrl);
      const absUrl = safeUrl.startsWith("/") ? `${origin}${safeUrl}` : safeUrl;
      return { status: "REDIRECT", url: absUrl, username: card.user.username };
    } catch {
      return { status: "REDIRECT", url: bioUrl, username: card.user.username };
    }
  }

  return { status: "REDIRECT", url: bioUrl, username: card.user.username };
}
