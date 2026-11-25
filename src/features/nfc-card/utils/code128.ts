/**
 * Standard ISO/IEC 15417 Code 128B linear barcode SVG generator.
 * Encodes printable ASCII (32..126) with Start B (104), modulo-103 checksum, and Stop (106).
 */
export const CODE128_PATTERNS: readonly string[] = [
  "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
  "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
  "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
  "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
  "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
  "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
  "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
  "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
  "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
  "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
  "114131","311141","411131","211412","211214","211232","2331112",
];

function sanitizeBarcodeText(raw: string): string {
  const cleaned = raw.replace(/[^\x20-\x7e]/g, "").trim();
  return (cleaned || "ANLINKS").slice(0, 32);
}

export function encodeCode128B(rawText: string): { text: string; pattern: string } {
  const text = sanitizeBarcodeText(rawText);
  const START_B = 104;
  const STOP = 106;

  let checksum = START_B;
  const codes = [START_B];

  for (let i = 0; i < text.length; i++) {
    const val = text.charCodeAt(i) - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }

  codes.push(checksum % 103);
  codes.push(STOP);

  return {
    text,
    pattern: codes.map((c) => CODE128_PATTERNS[c]).join(""),
  };
}

export interface Code128SvgOptions {
  fgColor?: string;
  bgColor?: string;
  height?: number;
  showText?: boolean;
}

/**
 * Builds a clean, crisp SVG string containing a Code128B barcode and caption.
 */
export function generateCode128Svg(rawText: string, options: Code128SvgOptions = {}): string {
  const fgColor = options.fgColor || "#0f172a";
  const bgColor = options.bgColor || "#ffffff";
  const barHeight = options.height ?? 44;
  const showText = options.showText !== false;

  const { text, pattern } = encodeCode128B(rawText);
  const quietZone = 8;
  const totalUnits = pattern.split("").reduce((sum, ch) => sum + Number(ch), 0) + quietZone * 2;
  const textExtraHeight = showText ? 16 : 0;
  const svgHeight = barHeight + textExtraHeight + 8;

  let x = quietZone;
  const rects: string[] = [];

  for (let i = 0; i < pattern.length; i++) {
    const width = Number(pattern[i]);
    if (i % 2 === 0) {
      rects.push(`<rect x="${x}" y="4" width="${width}" height="${barHeight}" fill="${fgColor}" />`);
    }
    x += width;
  }

  const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const textEl = showText
    ? `<text x="${totalUnits / 2}" y="${barHeight + 17}" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="${fgColor}" letter-spacing="1.5">${safeText}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalUnits} ${svgHeight}" role="img" aria-label="Barcode ${safeText}"><rect width="${totalUnits}" height="${svgHeight}" rx="6" fill="${bgColor}" />${rects.join("")}${textEl}</svg>`;
}
