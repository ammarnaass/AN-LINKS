import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { prisma } from "@/shared/db";
import { CODE128_PATTERNS, generateCode128Svg } from "@/features/nfc-card/utils/code128";
import { buildVCardPayload } from "@/features/nfc-card/utils/vcard";
import {
  getOrCreateUserNfcCard,
  updateUserNfcCard,
  resolveNfcScan,
  validateNfcRedirectUrl,
} from "@/features/nfc-card/services/nfc-card.service";
import {
  NfcCardPreview,
  NfcDesignPanel,
  NfcSettingsPanel,
  BarcodeAndQrPanel,
} from "@/features/nfc-card";

describe("Creator NFC Card, Design, Settings & Barcode Suite", () => {
  const testEmail = `nfc_test_${Date.now()}@anlinks.dev`;
  const testUsername = `nfctest_${Date.now()}`;
  let testUserId = "";

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: testUsername,
        role: "USER",
        profile: {
          create: {
            displayName: "مبدع بطاقة NFC",
            bio: "مصمم ورائد أعمال",
            phone: "+966500112233",
          },
        },
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  it("uses valid Code128B patterns and renders clean barcode SVG + vCard", () => {
    expect(CODE128_PATTERNS).toHaveLength(107);
    for (let i = 0; i < 106; i++) {
      expect(CODE128_PATTERNS[i]).toHaveLength(6);
      const sum = CODE128_PATTERNS[i].split("").reduce((acc, d) => acc + Number(d), 0);
      expect(sum).toBe(11);
    }
    expect(CODE128_PATTERNS[106]).toBe("2331112");

    const svg = generateCode128Svg("AN-FAISAL");
    expect(svg).toContain("<svg");
    expect(svg).toContain("<rect");
    expect(svg).toContain("AN-FAISAL");

    const vcf = buildVCardPayload({
      fullName: "فيصل السيف",
      company: "AN LINKS",
      phone: "+966500112233",
      email: "test@anlinks.dev",
      profileUrl: "https://anlinks.dev/faisal",
    });
    expect(vcf).toContain("BEGIN:VCARD");
    expect(vcf).toContain("FN:فيصل السيف");
    expect(vcf).toContain("TEL;TYPE=CELL:+966500112233");
    expect(vcf).toContain("END:VCARD");
  });

  it("blocks unsafe redirect protocols in NFC target URLs", () => {
    expect(() => validateNfcRedirectUrl("javascript:alert(1)")).toThrow();
    expect(() => validateNfcRedirectUrl("data:text/html,<h1>x</h1>")).toThrow();
    expect(() => validateNfcRedirectUrl("//evil.example.com")).toThrow();
    expect(validateNfcRedirectUrl("https://wa.me/966500112233")).toBe(
      "https://wa.me/966500112233"
    );
  });

  it(
    "creates, updates, and resolves NFC & QR scans across BIO_PAGE, DIRECT_URL, VCARD, and DISABLED",
    async () => {
    const initial = await getOrCreateUserNfcCard(testUserId);
    expect(initial.cardCode).toBe(`an-${testUsername}`);
    expect(initial.qrSvgMarkup).toContain("<svg");
    expect(initial.qrPngDataUrl).toContain("data:image/png;base64,");

    const bioRes = await resolveNfcScan(initial.cardCode, "nfc");
    expect(bioRes.status).toBe("REDIRECT");
    if (bioRes.status === "REDIRECT") {
      expect(bioRes.url).toContain(`/${testUsername}?source=nfc`);
    }

    await updateUserNfcCard(testUserId, {
      material: "custom",
      customBgColor: "#1e1b4b",
      customTextColor: "#fde68a",
      cardShape: "pill",
      cardPattern: "chip",
      orientation: "vertical",
      targetMode: "DIRECT_URL",
      customTargetUrl: "https://example.com/shop",
      barcodeValue: "VIP-2026",
    });
    const directRes = await resolveNfcScan(initial.cardCode, "qr");
    expect(directRes.status).toBe("REDIRECT");
    if (directRes.status === "REDIRECT") {
      expect(directRes.url).toBe("https://example.com/shop");
    }

    await updateUserNfcCard(testUserId, {
      targetMode: "VCARD",
      vcardCompany: "AN Tech",
    });
    const vcardRes = await resolveNfcScan(initial.cardCode, "nfc");
    expect(vcardRes.status).toBe("VCARD");
    if (vcardRes.status === "VCARD") {
      expect(vcardRes.vcf).toContain("ORG:AN Tech");
    }

    await updateUserNfcCard(testUserId, { isEnabled: false });
    const disabledRes = await resolveNfcScan(initial.cardCode, "nfc");
    expect(disabledRes.status).toBe("DISABLED");

    const refreshed = await getOrCreateUserNfcCard(testUserId);
    expect(refreshed.tapCount).toBe(2);
    expect(refreshed.qrScanCount).toBe(1);
    expect(refreshed.material).toBe("custom");
    expect(refreshed.customBgColor).toBe("#1e1b4b");
    expect(refreshed.customTextColor).toBe("#fde68a");
    expect(refreshed.cardShape).toBe("pill");
    expect(refreshed.cardPattern).toBe("chip");
    expect(refreshed.orientation).toBe("vertical");
    expect(refreshed.barcodeValue).toBe("VIP-2026");
  }, 25000);

  it("renders NfcCardPreview, NfcDesignPanel, NfcSettingsPanel, and BarcodeAndQrPanel", async () => {
    const card = await getOrCreateUserNfcCard(testUserId);
    const previewHtml = renderToStaticMarkup(<NfcCardPreview card={card} />);
    expect(previewHtml).toContain("AN LINKS");
    expect(previewHtml).toContain(card.cardTitle);

    const designHtml = renderToStaticMarkup(<NfcDesignPanel card={card} onPatch={vi.fn()} />);
    expect(designHtml).toContain("أسود مطفي فاخر");
    expect(designHtml).toContain("ذهبي ملكي");

    const settingsHtml = renderToStaticMarkup(<NfcSettingsPanel card={card} onPatch={vi.fn()} />);
    expect(settingsHtml).toContain(card.nfcTapUrl);
    expect(settingsHtml).toContain("بطاقة جهة اتصال (vCard)");

    const barcodeHtml = renderToStaticMarkup(<BarcodeAndQrPanel card={card} onPatch={vi.fn()} />);
    expect(barcodeHtml).toContain("تحميل PNG عالي الدقة");
    expect(barcodeHtml).toContain("تحميل الباركود SVG");
  });
});
