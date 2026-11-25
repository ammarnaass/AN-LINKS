"use client";

import { PRINT_SPECIFICATIONS } from "../types/nfc-print.types";

export function downloadBlob(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * High-resolution rasterization of an HTML element to 300 DPI PNG
 */
export async function exportElementToHighResPng(
  element: HTMLElement,
  filename: string,
  scale = 3.5
): Promise<boolean> {
  try {
    const width = element.offsetWidth || PRINT_SPECIFICATIONS.widthPx300Dpi;
    const height = element.offsetHeight || PRINT_SPECIFICATIONS.heightPx300Dpi;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    ctx.scale(scale, scale);

    // Deep clone styles and SVG foreignObject approach
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.margin = "0";
    clone.style.transform = "none";

    const svgXml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${new XMLSerializer().serializeToString(clone)}
          </div>
        </foreignObject>
      </svg>
    `;

    const img = new Image();
    const svgBlob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              downloadBlob(blob, filename, "image/png");
              resolve(true);
            } else {
              resolve(false);
            }
          },
          "image/png",
          1.0
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        // Fallback: download standalone SVG
        downloadBlob(svgXml, filename.replace(/\.png$/, ".svg"), "image/svg+xml;charset=utf-8");
        resolve(true);
      };
      img.src = url;
    });
  } catch (err) {
    console.error("Failed to export high-res card PNG:", err);
    return false;
  }
}

/**
 * Export standalone vector SVG wrapper
 */
export function exportElementToSvg(element: HTMLElement, filename: string): boolean {
  try {
    const width = element.offsetWidth || 1011;
    const height = element.offsetHeight || 638;
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.margin = "0";

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;">
      ${new XMLSerializer().serializeToString(clone)}
    </div>
  </foreignObject>
</svg>`;

    downloadBlob(svgString, filename, "image/svg+xml;charset=utf-8");
    return true;
  } catch (err) {
    console.error("Failed to export SVG:", err);
    return false;
  }
}

/**
 * Triggers native browser print with dedicated card styling
 */
export function triggerCardPrint() {
  window.print();
}
