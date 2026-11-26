import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { detectVisitorCurrency } from "@/features/subscriptions";

export async function GET(request: NextRequest) {
  try {
    const currencies = await prisma.currencyConfig.findMany({
      where: { isActive: true },
      orderBy: [{ isBaseCurrency: "desc" }, { code: "asc" }],
      select: {
        code: true,
        nameAr: true,
        symbol: true,
        exchangeRateToUSD: true,
        isBaseCurrency: true,
        autoDetectCountries: true,
      },
    });

    const detectedCurrency = await detectVisitorCurrency(request.headers);

    return NextResponse.json({
      success: true,
      baseCurrency: "USD",
      detectedCurrency,
      currencies,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل جلب قائمة العملات المتاحة";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
