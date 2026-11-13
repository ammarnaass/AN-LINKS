import bcrypt from "bcryptjs";
import { isUsernameReserved } from "./reserved-usernames";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export interface RegistrationInput {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateRegistrationInput(input: RegistrationInput): ValidationResult {
  const errors: string[] = [];

  // Validate Email
  if (!input.email || !EMAIL_REGEX.test(input.email.trim())) {
    errors.push("صيغة البريد الإلكتروني غير صالحة");
  }

  // Validate Password
  if (!input.password || input.password.length < 8) {
    errors.push("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
  }

  // Validate Username
  const username = input.username ? input.username.trim() : "";
  if (username.length < 3 || username.length > 30) {
    errors.push("اسم المستخدم يجب أن يكون بين 3 و 30 حرفاً");
  }

  if (!USERNAME_REGEX.test(username)) {
    errors.push("اسم المستخدم يجب أن يحتوي فقط على أحرف لاتينية، أرقام، شرطة (-) أو شرطة سفلية (_)");
  }

  if (isUsernameReserved(username)) {
    errors.push("اسم المستخدم هذا محجوز مسبقاً من قِبل النظام");
  }

  // Validate Display Name
  if (!input.displayName || input.displayName.trim().length === 0) {
    errors.push("الاسم الظاهر مطلوب");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { profile: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error("بيانات الاعتماد غير صحيحة");
        }

        if (user.isSuspended) {
          throw new Error("تم إيقاف هذا الحساب. يرجى التواصل مع الإدارة");
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error("بيانات الاعتماد غير صحيحة");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.displayName ?? user.username,
          username: user.username,
          image: user.profile?.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as unknown as { username: string }).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { username: string }).username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "default_development_secret_key_change_in_production",
};
