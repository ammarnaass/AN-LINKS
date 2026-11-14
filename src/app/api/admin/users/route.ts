import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getAdminUsersList } from "@/features/admin/services/admin.service";

export async function GET(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const statusParam = searchParams.get("status");
  const status =
    statusParam === "active" || statusParam === "suspended" ? statusParam : "all";

  const users = await getAdminUsersList({ search, status });
  return NextResponse.json({ success: true, users }, { status: 200 });
}

