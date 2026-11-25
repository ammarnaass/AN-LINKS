import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CR80_STANDARDS,
  PRINT_SPECIFICATIONS,
  DEFAULT_PRINT_OPTIONS,
} from "@/features/nfc-card/types/nfc-print.types";
import { NfcCard3DControls } from "@/features/nfc-card/components/NfcCard3DControls";
import { NfcCard3DViewer } from "@/features/nfc-card/components/NfcCard3DViewer";
import { NfcPrintSheet } from "@/features/nfc-card/components/NfcPrintSheet";
import { NfcPrintModal } from "@/features/nfc-card/components/NfcPrintModal";
import { CardFrontFace } from "@/features/nfc-card/components/CardFrontFace";
import { CardBackFace } from "@/features/nfc-card/components/CardBackFace";
import {
  NFC_CARD_MATERIALS,
  NFC_CARD_SHAPES,
  NfcCardConfigDTO,
} from "@/features/nfc-card/types/nfc.types";

describe("NFC Card 3D Viewer & High-Res Print Suite", () => {
  const mockCard: NfcCardConfigDTO = {
    id: "test-card-id",
    username: "ammardev",
    cardCode: "AN-TEST-999",
    cardTitle: "عمار المهندس",
    cardSubtitle: "مطور تطبيقات سحابية",
    avatarUrl: null,
    material: "royal_gold",
    orientation: "horizontal",
    accentColor: "#d97706",
    customBgColor: "#111827",
    customTextColor: "#ffffff",
    cardShape: "rounded",
    cardPattern: "chip",
    showAvatar: true,
    showNfcIcon: true,
    showQrOnBack: true,
    showBarcodeOnBack: true,
    targetMode: "BIO_PAGE",
    customTargetUrl: "",
    vcardPhone: "+213555123456",
    vcardEmail: "ammar@test.com",
    vcardCompany: "AN LINKS Corp",
    qrForeground: "#000000",
    qrBackground: "#ffffff",
    barcodeValue: "AN-AMMARDEV",
    isEnabled: true,
    nfcTapUrl: "https://anlinks.dev/nfc/AN-TEST-999",
    qrScanUrl: "https://anlinks.dev/nfc/AN-TEST-999",
    tapCount: 42,
    qrScanCount: 15,
    lastTappedAt: new Date().toISOString(),
    qrSvgMarkup: "<svg><rect width='100' height='100'/></svg>",
    qrPngDataUrl: "data:image/png;base64,mock",
  };

  const material = NFC_CARD_MATERIALS[4]; // royal_gold
  const shape = NFC_CARD_SHAPES[0]; // rounded

  it("1. should maintain exact CR80 physical standards and print resolutions", () => {
    expect(CR80_STANDARDS.widthMm).toBe(85.6);
    expect(CR80_STANDARDS.heightMm).toBe(53.98);
    expect(CR80_STANDARDS.aspectRatio).toBeCloseTo(1.58577, 4);
    expect(PRINT_SPECIFICATIONS.standardDpi).toBe(300);
    expect(PRINT_SPECIFICATIONS.widthPx300Dpi).toBe(1011);
    expect(PRINT_SPECIFICATIONS.heightPx300Dpi).toBe(638);
    expect(DEFAULT_PRINT_OPTIONS.side).toBe("both");
    expect(DEFAULT_PRINT_OPTIONS.includeCropMarks).toBe(true);
  });

  it("2. should render 3D controls with flip, auto-rotate, and glare buttons", () => {
    const markup = renderToStaticMarkup(
      <NfcCard3DControls
        isAutoRotating={false}
        isFlipped={false}
        enableGlare={true}
        onToggleAutoRotate={vi.fn()}
        onToggleFlip={vi.fn()}
        onToggleGlare={vi.fn()}
        onResetView={vi.fn()}
      />
    );

    expect(markup).toContain("الوجه الأمامي");
    expect(markup).toContain("دوران تلقائي");
    expect(markup).toContain("انعكاس الإضاءة واللمعان");
    expect(markup).toContain("إعادة ضبط زاوية الرؤية");
  });

  it("3. should render CardFrontFace with title, chip, and AN LINKS branding", () => {
    const markup = renderToStaticMarkup(
      <CardFrontFace card={mockCard} material={material} isVertical={false} />
    );

    expect(markup).toContain("AN LINKS");
    expect(markup).toContain("عمار المهندس");
    expect(markup).toContain("مطور تطبيقات سحابية");
    expect(markup).toContain("anlinks.dev/ammardev");
    expect(markup).toContain("Smart Chip");
  });

  it("4. should render CardBackFace with QR code, barcode, and card code", () => {
    const markup = renderToStaticMarkup(
      <CardBackFace
        card={mockCard}
        material={material}
        qrMarkup="<svg id='test-qr-mock'></svg>"
        barcodeSvg="<svg id='test-barcode-mock'></svg>"
        isVertical={false}
      />
    );

    expect(markup).toContain("AN-TEST-999");
    expect(markup).toContain("امسح الكود أو قرّب البطاقة");
    expect(markup).toContain("test-qr-mock");
    expect(markup).toContain("test-barcode-mock");
    expect(markup).toContain("AN LINKS SMART NFC");
  });

  it("5. should render NfcCard3DViewer with 1200px perspective and front/back faces", () => {
    const markup = renderToStaticMarkup(
      <NfcCard3DViewer card={mockCard} liveQrSvg="<svg></svg>" />
    );

    expect(markup).toContain("perspective:1200px");
    expect(markup).toContain("transform-style:preserve-3d");
    expect(markup).toContain("عمار المهندس");
    expect(markup).toContain("AN-TEST-999");
  });

  it("6. should render NfcPrintSheet with standard CR80 millimeter dimensions and crop marks", () => {
    const markup = renderToStaticMarkup(
      <NfcPrintSheet
        card={mockCard}
        material={material}
        shape={shape}
        qrMarkup="<svg></svg>"
        barcodeSvg="<svg></svg>"
        side="both"
        includeCropMarks={true}
        includeBleed={true}
      />
    );

    expect(markup).toContain("w-[85.60mm] h-[53.98mm]");
    expect(markup).toContain("nfc-card-print-front");
    expect(markup).toContain("nfc-card-print-back");
    expect(markup).toContain("الوجه الأمامي (CR80: 85.6mm × 53.98mm)");
  });

  it("7. should render NfcPrintModal when open with export triggers and print button", () => {
    const markup = renderToStaticMarkup(
      <NfcPrintModal
        card={mockCard}
        liveQrSvg="<svg></svg>"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(markup).toContain("استوديو الطباعة والتنزيل عالي الدقة (CR80)");
    expect(markup).toContain("طباعة البطاقة الآن");
    expect(markup).toContain("تنزيل PNG (300 DPI)");
    expect(markup).toContain("تصدير SVG متجهي");
    expect(markup).toContain("علامات القص");
    expect(markup).toContain("تسييل 3mm");
  });
});
