export interface VCardInput {
  fullName: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  profileUrl: string;
}

function escapeVCardText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

/**
 * Generates an RFC 2426 / 6350 compatible vCard 3.0 payload for NFC / QR downloads.
 */
export function buildVCardPayload(input: VCardInput): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardText(input.fullName)}`,
    `N:${escapeVCardText(input.fullName)};;;;`,
  ];

  if (input.company?.trim()) {
    lines.push(`ORG:${escapeVCardText(input.company.trim())}`);
  }
  if (input.title?.trim()) {
    lines.push(`TITLE:${escapeVCardText(input.title.trim())}`);
  }
  if (input.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL:${input.phone.trim()}`);
  }
  if (input.email?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET:${input.email.trim()}`);
  }
  lines.push(`URL:${input.profileUrl}`);
  lines.push("END:VCARD");

  return `${lines.join("\r\n")}\r\n`;
}
