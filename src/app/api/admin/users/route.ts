import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, getAdminUsersList } from "@/features/admin";

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

