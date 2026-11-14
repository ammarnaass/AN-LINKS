import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getAdminReports } from "@/features/admin/services/admin.service";

export async function GET(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const status = request.nextUrl.searchParams.get("status") || undefined;
  const reports = await getAdminReports(status);

  return NextResponse.json({ success: true, reports }, { status: 200 });
}

