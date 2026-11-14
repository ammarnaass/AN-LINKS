import { NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getAllPlatformSessions } from "@/features/auth/server/session.service";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const sessions = await getAllPlatformSessions();
    return NextResponse.json({ success: true, sessions }, { status: 200 });
  } catch (error) {
    console.error("Admin sessions fetch error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب جلسات المنصة" }, { status: 500 });
  }
}

