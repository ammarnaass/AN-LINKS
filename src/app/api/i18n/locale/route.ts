import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from "@/shared/i18n/constants/locales";
import { Locale } from "@/shared/i18n/types/i18n.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetLocale = body.locale as Locale;

    if (!targetLocale || !SUPPORTED_LOCALES[targetLocale]) {
      return NextResponse.json({ success: false, error: "Unsupported locale" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, locale: targetLocale });
    response.cookies.set(LOCALE_COOKIE_NAME, targetLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
