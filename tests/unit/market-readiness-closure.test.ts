import { describe, it, expect, afterAll } from "vitest";
import { appendTrackingParams } from "@/shared/utils/url-sanitizer";
import { buildProfileJsonLdSchema } from "@/features/bio/components/ProfileJsonLd";
import { getS3Config } from "@/lib/storage";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { provisionOAuthUser } from "@/features/auth/server/oauth-provision.service";
import { prisma } from "@/shared/db";

describe("2026 Market Readiness Gap Closure Suite", () => {
  const oauthEmail = "oauth.closure.test@anlinks.dev";
  const suspendedEmail = "oauth.suspended.test@anlinks.dev";

  afterAll(async () => {
    await prisma.profile.deleteMany({
      where: { user: { email: { in: [oauthEmail, suspendedEmail] } } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [oauthEmail, suspendedEmail] } },
    });
    await prisma.$disconnect();
  });

  it("preserves UTM and ad attribution query params without overwriting explicit target params", () => {
    const incoming = new URLSearchParams(
      "utm_source=instagram&utm_campaign=ramadan_2026&fbclid=fb123&evil=hack"
    );
    const result = appendTrackingParams("https://store.example.com/product?utm_source=manual", incoming);

    expect(result.searchParams.get("utm_source")).toBe("manual"); // existing preserved
    expect(result.searchParams.get("utm_campaign")).toBe("ramadan_2026");
    expect(result.searchParams.get("fbclid")).toBe("fb123");
    expect(result.searchParams.get("evil")).toBeNull();
  });

  it("builds valid Schema.org ProfilePage JSON-LD structured data", () => {
    const schema = buildProfileJsonLdSchema({
      username: "faisal_tech",
      canonicalOrigin: "https://anlinks.dev",
      profile: {
        displayName: "فيصل السيف",
        bio: "مراجعات تقنية",
        avatarUrl: "https://cdn.anlinks.dev/faisal.webp",
      } as never,
      socials: [
        { id: "1", network: "youtube", url: "https://youtube.com/@faisal_tech" },
        { id: "2", network: "x", url: "https://x.com/faisal_tech" },
      ],
    });

    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.url).toBe("https://anlinks.dev/faisal_tech");
    expect(schema.mainEntity["@type"]).toBe("Person");
    expect(schema.mainEntity.alternateName).toBe("@faisal_tech");
    expect(schema.mainEntity.sameAs).toHaveLength(2);
  });

  it("reads S3/R2 storage config only when all required credentials are provided", () => {
    const origEndpoint = process.env.S3_ENDPOINT;
    delete process.env.S3_ENDPOINT;
    expect(getS3Config()).toBeNull();
    if (origEndpoint) process.env.S3_ENDPOINT = origEndpoint;
  });

  it("falls back safely to console mailer when RESEND_API_KEY is unset", async () => {
    const origKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    const res = await sendPasswordResetEmail("user@anlinks.dev", "sample_token_123");
    expect(res.sent).toBe(true);
    expect(res.provider).toBe("console");
    if (origKey) process.env.RESEND_API_KEY = origKey;
  });

  it("auto-provisions user and profile for OAuth login and blocks suspended users", async () => {
    const provisioned = await provisionOAuthUser(
      oauthEmail,
      "مستخدم جوجل",
      "https://lh3.googleusercontent.com/avatar.jpg"
    );
    expect(provisioned).not.toBeNull();
    expect(provisioned?.email).toBe(oauthEmail);
    expect(provisioned?.username).toContain("oauthclosuretest");

    // Suspend user and verify OAuth sign-in is rejected
    await prisma.user.update({
      where: { email: oauthEmail },
      data: { isSuspended: true },
    });
    const blocked = await provisionOAuthUser(oauthEmail);
    expect(blocked).toBeNull();
  });
});
