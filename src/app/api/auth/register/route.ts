import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRegistrationInput, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, displayName } = body;

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

    // Check email uniqueness
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, errors: ["البريد الإلكتروني مسجل بالفعل"] },
        { status: 409 }
      );
    }

    // Check username uniqueness
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

    // Create user and profile in transaction
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

