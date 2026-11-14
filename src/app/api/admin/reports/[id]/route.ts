import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, updateReportStatus } from "@/features/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const body = await request.json();
    if (body.status !== "RESOLVED" && body.status !== "DISMISSED") {
      return NextResponse.json(
        { success: false, error: "حالة البلاغ يجب أن تكون إما RESOLVED أو DISMISSED" },
        { status: 400 }
      );
    }

    const res = await updateReportStatus(id, body.status);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: res.error }, { status: res.status });
    }

    return NextResponse.json({ success: true, report: res.report }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "طلب غير صالح" }, { status: 400 });
  }
}

