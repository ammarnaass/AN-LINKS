import { prisma } from "@/shared/db";

export function getCountryFromHeaders(headers: Headers): string | null {
  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry && vercelCountry.length === 2) {
    return vercelCountry.toUpperCase();
  }

  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry && cfCountry.length === 2 && cfCountry !== "XX") {
    return cfCountry.toUpperCase();
  }

  const customCountry = headers.get("x-country-code");
  if (customCountry && customCountry.length === 2) {
    return customCountry.toUpperCase();
  }

  return null;
}

export async function detectVisitorCurrency(headers?: Headers): Promise<string> {
  const countryCode = headers ? getCountryFromHeaders(headers) : null;

  try {
    const activeCurrencies = await prisma.currencyConfig.findMany({
      where: { isActive: true },
    });

    if (countryCode && activeCurrencies.length > 0) {
      const match = activeCurrencies.find((c) =>
        c.autoDetectCountries?.some(
          (iso) => iso.toUpperCase() === countryCode.toUpperCase()
        )
      );
      if (match) {
        return match.code;
      }
    }

    const baseCurrency = activeCurrencies.find((c) => c.isBaseCurrency);
    if (baseCurrency) return baseCurrency.code;

    const sarFallback = activeCurrencies.find((c) => c.code === "SAR");
    if (sarFallback) return sarFallback.code;
  } catch {
    // Database fallback
  }

  return "SAR";
}
