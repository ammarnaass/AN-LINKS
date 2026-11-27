import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRegistrationInput, hashPassword } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limiter";
import { recordReferralAttribution } from "@/features/affiliate/server/affiliate.service";

function readCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, "auth_register", {
      maxAttempts: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (limited) return limited;

    const body = await request.json();
    const { email, password, username, displayName, referralCode } = body;
    const rawRef =
      (typeof referralCode === "string" && referralCode.trim()) ||
      readCookieValue(request.headers.get("cookie"), "anlinks_ref");

    const validation = validateRegistrationInput({
      email,
      password,
      username,
      displayName,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim();

    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, errors: ["البريد الإلكتروني مسجل بالفعل"] },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, errors: ["اسم المستخدم مأخوذ بالفعل، يرجى اختيار اسم آخر"] },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        username: cleanUsername,
        profile: {
          create: {
            displayName: displayName.trim(),
            bio: "مرحباً بكم في صفحتي!",
            themeKey: "default",
            accentColor: "#3B82F6",
            buttonStyle: "filled",
            borderRadius: "rounded-xl",
            font: "Cairo",
            isPublished: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (rawRef) {
      await recordReferralAttribution(newUser.id, rawRef).catch((err) =>
        console.error("Referral attribution error on register:", err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.profile?.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, errors: ["حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة لاحقاً"] },
      { status: 500 }
    );
  }
}
