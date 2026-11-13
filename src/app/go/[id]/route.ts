import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recordLinkClick } from "@/lib/tracking-service";

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
        user: {
          select: { isSuspended: true },
        },
      },
    });

    if (!link || !link.isActive || link.user?.isSuspended) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    const userAgent = request.headers.get("user-agent");
    // Record click without blocking redirect execution
    recordLinkClick(link.id, userAgent, request.headers).catch(() => {});

    // 302 Temporary Redirect to target destination
    return NextResponse.redirect(new URL(link.url), 302);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

