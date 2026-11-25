import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { buildDynamicAuthOptions } from "@/lib/auth";

async function handler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const dynamicOptions = await buildDynamicAuthOptions();
  const nextAuthHandler = NextAuth(dynamicOptions);
  return nextAuthHandler(req, context);
}

export { handler as GET, handler as POST };
