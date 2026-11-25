import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { recordLinkClick } from "@/features/analytics/services/tracking.service";
import { appendTrackingParams } from "@/shared/utils/url-sanitizer";
import { isLinkWithinSchedule } from "@/features/bio/utils/link-schedule";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  try {
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        user: { select: { isSuspended: true } },
        platform: { select: { isEnabled: true } },
      },
    });

    if (
      !link ||
      !link.isActive ||
      link.isArchived ||
      link.user?.isSuspended ||
      !isLinkWithinSchedule(link)
    ) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (link.pinCode) {
      const suppliedPin = request.nextUrl.searchParams.get("pin")?.trim();
      if (suppliedPin !== link.pinCode) {
        return NextResponse.json(
          { success: false, error: "هذا الرابط محمي برمز سري (PIN)" },
          { status: 403 }
        );
      }
    }

    const rawCountry = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country");
    const country = (rawCountry && rawCountry !== "XX" && rawCountry !== "T1") ? rawCountry.toUpperCase().trim() : null;
    const city = request.headers.get("x-vercel-ip-city") || null;
    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");

    // Record click asynchronously without blocking redirect execution
    recordLinkClick(link.id, userAgent, request.headers, {
      country,
      city,
      platformId: link.platformId,
      referer,
    }).catch(() => {});

    // 302 Temporary Redirect to target destination while preserving UTM tracking params
    const destinationUrl = appendTrackingParams(link.url, request.nextUrl.searchParams);
    return NextResponse.redirect(destinationUrl, 302);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

