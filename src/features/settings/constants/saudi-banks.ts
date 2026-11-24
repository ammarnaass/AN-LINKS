export interface SaudiBank {
  code: string;
  nameAr: string;
  nameEn: string;
}

export const SAUDI_BANKS: Record<string, SaudiBank> = {
  "80": { code: "80", nameAr: "مصرف الراجحي", nameEn: "Al Rajhi Bank" },
  "10": { code: "10", nameAr: "البنك الأهلي السعودي", nameEn: "Saudi National Bank (SNB)" },
  "50": { code: "50", nameAr: "بنك الإنماء", nameEn: "Alinma Bank" },
  "20": { code: "20", nameAr: "بنك الرياض", nameEn: "Riyad Bank" },
  "15": { code: "15", nameAr: "بنك البلاد", nameEn: "Bank Albilad" },
  "05": { code: "05", nameAr: "البنك السعودي الأول (ساب)", nameEn: "SAB" },
  "65": { code: "65", nameAr: "بنك الجزيرة", nameEn: "Bank AlJazira" },
  "45": { code: "45", nameAr: "البنك السعودي للاستثمار", nameEn: "SAIB" },
  "55": { code: "55", nameAr: "بنك الخليج الدولي", nameEn: "Gulf International Bank (GIB)" },
  "30": { code: "30", nameAr: "البنك العربي الوطني", nameEn: "Arab National Bank (ANB)" },
  "40": { code: "40", nameAr: "بنك سامبا (سابقاً)", nameEn: "Samba Financial Group" },
};

export function getBankByCode(code: string): SaudiBank | null {
  return SAUDI_BANKS[code] ?? null;
}

export function detectBankFromIban(iban: string): SaudiBank | null {
  const clean = iban.replace(/\s+/g, "").toUpperCase();
  if (!clean.startsWith("SA") || clean.length < 6) return null;
  const bankCode = clean.slice(4, 6);
  return getBankByCode(bankCode);
}
