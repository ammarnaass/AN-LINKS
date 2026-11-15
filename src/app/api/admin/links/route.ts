import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getAdminLinks } from "@/features/admin/server/admin-links.service";

export async function GET(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const platformId = searchParams.get("platformId") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await getAdminLinks({ search, platformId, status, page, limit });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Admin links GET error:", error);
    const message = error instanceof Error ? error.message : "فشل جلب الروابط";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

