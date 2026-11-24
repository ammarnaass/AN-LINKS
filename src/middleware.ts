import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "anlinks.dev",
  "www.anlinks.dev",
  "app.anlinks.dev",
];

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0]?.toLowerCase();
  const pathname = request.nextUrl.pathname;

  const isCustomDomain =
    hostname &&
    !ROOT_DOMAINS.includes(hostname) &&
    !hostname.endsWith(".anlinks.dev") &&
    !hostname.endsWith(".vercel.app");

  let response: NextResponse;

  if (isCustomDomain) {
    // Pass static assets and critical routes through without domain rewrite
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/go/") ||
      pathname === "/favicon.ico"
    ) {
      response = NextResponse.next();
    } else {
      // Rewrite custom domain requests to /domain/[domain]
      const url = request.nextUrl.clone();
      url.pathname = `/domain/${hostname}${pathname === "/" ? "" : pathname}`;
      response = NextResponse.rewrite(url);
    }
  } else {
    response = NextResponse.next();
  }

  // Security Headers for Production 2026 SaaS
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  // Allow iframe embedding within same origin for Phone Mockup Simulator
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Cache Control for static public profiles vs dynamic dashboard
  if (pathname.startsWith("/go/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
