import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROOT_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "anlinks.dev",
  "www.anlinks.dev",
  "app.anlinks.dev",
];

function isInternalOrLocalHost(hostname: string): boolean {
  if (ROOT_DOMAINS.includes(hostname)) return true;
  if (/^(127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname)) return true;
  if (hostname === "::1" || hostname === "[::1]") return true;
  if (hostname.endsWith(".local") || hostname.endsWith(".internal")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0]?.toLowerCase();
  const pathname = request.nextUrl.pathname;

  // 1. Session & Auth Guards for protected routes
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCheckoutRoute = pathname.startsWith("/checkout");
  const isAuthFormRoute = pathname === "/login" || pathname === "/register";

  if (isDashboardRoute || isAdminRoute || isCheckoutRoute || isAuthFormRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (isDashboardRoute || isAdminRoute || isCheckoutRoute) {
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
      }
      if (isAdminRoute && token.role !== "ADMIN") {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    if (isAuthFormRoute && token) {
      const planParam = request.nextUrl.searchParams.get("plan");
      if (planParam && planParam !== "free") {
        const checkoutUrl = new URL("/checkout", request.url);
        checkoutUrl.searchParams.set("plan", planParam);
        return NextResponse.redirect(checkoutUrl);
      }
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 2. Custom Domain Routing
  const isCustomDomain =
    hostname &&
    !isInternalOrLocalHost(hostname) &&
    !hostname.endsWith(".anlinks.dev") &&
    !hostname.endsWith(".vercel.app");

  let response: NextResponse;

  if (isCustomDomain) {
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/go/") ||
      pathname === "/favicon.ico"
    ) {
      response = NextResponse.next();
    } else {
      const url = request.nextUrl.clone();
      url.pathname = `/domain/${hostname}${pathname === "/" ? "" : pathname}`;
      response = NextResponse.rewrite(url);
    }
  } else {
    response = NextResponse.next();
  }

  // 3. SaaS Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://analytics.tiktok.com https://www.googletagmanager.com https://sc-static.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
    ].join("; ")
  );

  if (pathname.startsWith("/go/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
