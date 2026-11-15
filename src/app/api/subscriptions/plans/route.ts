import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";

export async function GET(request: NextRequest) {
  try {
    // 1. Resolve country from query param, Cloudflare header, Vercel header, or fallback to "SA"
    const searchCountry = request.nextUrl.searchParams.get("country");
    const cfCountry = request.headers.get("cf-ipcountry");
    const vercelCountry = request.headers.get("x-vercel-ip-country");

    const country = (searchCountry || cfCountry || vercelCountry || "SA").trim().toUpperCase();

    // 2. Query active currencies
    const activeCurrencies = await prisma.currencyConfig.findMany({
      where: { isActive: true },
    });

    // 3. Find matching currency:
    // Check if autoDetectCountries contains the resolved country (case-insensitive)
    let selectedCurrency = activeCurrencies.find((curr) =>
      curr.autoDetectCountries?.some((c) => c.trim().toUpperCase() === country)
    );

    // Fallback to base currency (isBaseCurrency: true)
    if (!selectedCurrency) {
      selectedCurrency = activeCurrencies.find((curr) => curr.isBaseCurrency);
    }

    // Fallback to SAR
    if (!selectedCurrency) {
      selectedCurrency = activeCurrencies.find((curr) => curr.code.toUpperCase() === "SAR");
    }

    // Ultimate fallback if no currencies are configured
    const currency = selectedCurrency
      ? {
          code: selectedCurrency.code,
          symbol: selectedCurrency.symbol,
          exchangeRateToUSD: selectedCurrency.exchangeRateToUSD,
        }
      : {
          code: "SAR",
          symbol: "ر.س",
          exchangeRateToUSD: 3.75,
        };

    // 4. Fetch active plans ordered by sortOrder asc with prices and quotas
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      include: {
        prices: true,
        quotas: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      country,
      currency,
      plans,
    });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      {
        success: false,
        error: "فشل في جلب باقات الاشتراك",
      },
      { status: 500 }
    );
  }
}
