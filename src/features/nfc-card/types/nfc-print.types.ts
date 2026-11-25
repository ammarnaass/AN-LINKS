export type PrintSide = "front" | "back" | "both";
export type PrintPaperSize = "A4" | "Letter" | "card-only";
export type ExportFormat = "png-300dpi" | "svg" | "both-sides";

export interface Card3DSettings {
  tiltIntensity: number;
  isAutoRotating: boolean;
  isFlipped: boolean;
  enableGlare: boolean;
  scale: number;
}

export interface CR80Dimensions {
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  cornerRadiusMm: number;
  aspectRatio: number;
}

export const CR80_STANDARDS: CR80Dimensions = {
  widthMm: 85.6,
  heightMm: 53.98,
  bleedMm: 3.0,
  cornerRadiusMm: 3.18,
  aspectRatio: 85.6 / 53.98, // ~1.58577
};

export const PRINT_SPECIFICATIONS = {
  standardDpi: 300,
  screenDpi: 72,
  widthPx300Dpi: 1011,
  heightPx300Dpi: 638,
  bleedWidthPx300Dpi: 1082,
  bleedHeightPx300Dpi: 709,
  printBleedMm: 3.0,
  cardThicknessMm: 0.76, // Standard PVC credit card thickness
};

export interface PrintExportOptions {
  side: PrintSide;
  includeCropMarks: boolean;
  includeBleed: boolean;
  paperSize: PrintPaperSize;
  colorProfile: "sRGB" | "CMYK_simulation";
}

export const DEFAULT_PRINT_OPTIONS: PrintExportOptions = {
  side: "both",
  includeCropMarks: true,
  includeBleed: true,
  paperSize: "A4",
  colorProfile: "sRGB",
};
