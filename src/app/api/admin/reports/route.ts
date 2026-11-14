import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, getAdminReports } from "@/features/admin";

export async function GET(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const status = request.nextUrl.searchParams.get("status") || undefined;
  const reports = await getAdminReports(status);

  return NextResponse.json({ success: true, reports }, { status: 200 });
}

