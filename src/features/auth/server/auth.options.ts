import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/shared/db";

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

