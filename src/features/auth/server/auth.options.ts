import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import { prisma } from "@/shared/db";
import { recordSession } from "./session.service";
import { provisionOAuthUser } from "./oauth-provision.service";
import { verifyTwoFactorCodeOrBackup } from "@/features/settings/server/two-factor.service";
import { getActiveRuntimeOAuthConfigs } from "@/features/admin/services/oauth-settings.service";

const OAUTH_PROVIDER_KEYS = new Set(["google", "facebook", "apple"]);

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
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
        totpCode: { label: "رمز التحقق الثنائي", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { profile: true, twoFactorAuth: true },
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

        if (user.twoFactorAuth && user.twoFactorAuth.isEnabled) {
          const totpCode = (credentials as Record<string, string>).totpCode;
          if (!totpCode || !totpCode.trim()) {
            throw new Error("2FA_REQUIRED");
          }
          const isTwoFactorValid = await verifyTwoFactorCodeOrBackup(user.id, totpCode);
          if (!isTwoFactorValid) {
            throw new Error("رمز التحقق الثنائي غير صحيح");
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.displayName ?? user.username,
          username: user.username,
          role: user.role,
          image: user.profile?.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider && OAUTH_PROVIDER_KEYS.has(account.provider)) {
        const provisioned = await provisionOAuthUser(user.email, user.name, user.image);
        if (!provisioned) return false;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider && OAUTH_PROVIDER_KEYS.has(account.provider) && user?.email) {
        const provisioned = await provisionOAuthUser(user.email, user.name, user.image);
        if (provisioned) {
          token.id = provisioned.id;
          token.username = provisioned.username;
          token.role = provisioned.role;
          token.name = provisioned.name;
          token.picture = provisioned.image;
          token.sessionToken = (token.jti as string) || `${provisioned.id}_${Date.now()}`;
          try {
            await recordSession(provisioned.id, token.sessionToken as string);
          } catch (err) {
            console.error("OAuth session recording error:", err);
          }
        }
      } else if (user) {
        token.id = user.id;
        token.username = (user as unknown as { username: string }).username;
        token.role = (user as unknown as { role: string }).role;
        token.email = user.email ?? null;
        token.name = user.name ?? null;
        token.picture = (user as unknown as { image?: string }).image || null;
        token.sessionToken = (token.jti as string) || `${user.id}_${Date.now()}`;
        try {
          await recordSession(user.id, token.sessionToken as string);
        } catch (err) {
          console.error("Session recording error in jwt callback:", err);
        }
      }

      // Always sync latest role and username from database if token.id is present
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, username: true, email: true, isSuspended: true },
          });
          if (dbUser) {
            if (dbUser.isSuspended) return {};
            token.role = dbUser.role;
            if (dbUser.email) token.email = dbUser.email;
            if (dbUser.username) token.username = dbUser.username;
          }
        } catch {
          // ignore lookup errors
        }
      }

      // Sync latest profile avatar if not already on token
      if (token.id && !token.picture) {
        try {
          const profile = await prisma.profile.findUnique({
            where: { userId: token.id as string },
            select: { avatarUrl: true, displayName: true },
          });
          if (profile?.avatarUrl) token.picture = profile.avatarUrl;
          if (profile?.displayName && !token.name) token.name = profile.displayName;
        } catch {
          // ignore lookup errors
        }
      }

      if (token.sessionToken) {
        try {
          const dbSession = await prisma.userSession.findUnique({
            where: { sessionToken: token.sessionToken as string },
            select: { isActive: true },
          });
          if (dbSession && !dbSession.isActive) {
            return {};
          }
        } catch {
          // ignore db errors on session check
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { username: string }).username = token.username as string;
        const role = (token.role as string) || "USER";
        (session.user as unknown as { role: string }).role = role;
        (session.user as unknown as { sessionToken: string }).sessionToken = token.sessionToken as string;
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev_only_anlinks_secret" : undefined),
};

/**
 * Builds NextAuthOptions dynamically with active Google, Facebook, and Apple providers
 * configured via the System Admin dashboard or environment variables.
 */
export async function buildDynamicAuthOptions(): Promise<NextAuthOptions> {
  const runtimeConfigs = await getActiveRuntimeOAuthConfigs();
  const credentialsProvider = authOptions.providers[authOptions.providers.length - 1];

  const dynamicOAuthProviders = runtimeConfigs.map((cfg) => {
    if (cfg.provider === "facebook") {
      return FacebookProvider({
        clientId: cfg.clientId,
        clientSecret: cfg.clientSecret,
      });
    }
    if (cfg.provider === "apple") {
      return AppleProvider({
        clientId: cfg.clientId,
        clientSecret: cfg.clientSecret,
      });
    }
    return GoogleProvider({
      clientId: cfg.clientId,
      clientSecret: cfg.clientSecret,
    });
  });

  return {
    ...authOptions,
    providers: [...dynamicOAuthProviders, credentialsProvider],
  };
}

