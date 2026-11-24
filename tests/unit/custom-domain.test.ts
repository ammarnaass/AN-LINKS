import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/shared/db";
import * as nextAuth from "next-auth";
import {
  validateDomainFormat,
  generateVerificationToken,
  setCustomDomain,
  verifyCustomDomain,
  getUserCustomDomain,
  removeCustomDomain,
} from "@/features/domains/services/dns-verification.service";
import { getPublicProfileByDomain } from "@/features/bio/services/profile.service";
import { GET, POST, PUT, DELETE } from "@/app/api/profile/custom-domain/route";

vi.mock("next-auth");

describe("Custom Domains Verification & Routing Engine", () => {
  const mockUser = {
    id: "domain-test-user-id",
    email: "creator@brand.com",
    username: "brandcreator",
    name: "Brand Creator",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Domain Validation & Token Generation", () => {
    it("validates valid domain names and cleans protocols", () => {
      const res1 = validateDomainFormat("https://links.creator.com/");
      expect(res1.valid).toBe(true);
      expect(res1.cleanDomain).toBe("links.creator.com");

      const res2 = validateDomainFormat("creator.sa");
      expect(res2.valid).toBe(true);
      expect(res2.cleanDomain).toBe("creator.sa");
    });

    it("rejects reserved and platform domains", () => {
      expect(validateDomainFormat("anlinks.dev").valid).toBe(false);
      expect(validateDomainFormat("sub.anlinks.dev").valid).toBe(false);
      expect(validateDomainFormat("localhost").valid).toBe(false);
      expect(validateDomainFormat("test.vercel.app").valid).toBe(false);
    });

    it("rejects malformed domains", () => {
      expect(validateDomainFormat("not a domain").valid).toBe(false);
      expect(validateDomainFormat("").valid).toBe(false);
      expect(validateDomainFormat("-invalid.com").valid).toBe(false);
    });

    it("generates crypto secure verification token with platform prefix", () => {
      const token = generateVerificationToken();
      expect(token).toMatch(/^anlinks_verify_[a-f0-9]{24}$/);
    });
  });

  describe("Service & Database Operations", () => {
    it("sets, verifies, and removes custom domain on user profile", async () => {
      // Setup test user with profile
      await prisma.user.upsert({
        where: { id: mockUser.id },
        create: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: "PRO",
          profile: {
            create: {
              displayName: "Brand Creator",
              isPublished: true,
            },
          },
        },
        update: {},
      });

      // 1. Set custom domain
      const setupResult = await setCustomDomain(mockUser.id, "links.creator.test");
      expect(setupResult.customDomain).toBe("links.creator.test");
      expect(setupResult.domainVerified).toBe(false);
      expect(setupResult.domainVerificationToken).toBeDefined();

      // Verify profile lookup by domain before verification returns null
      const unverifiedPublic = await getPublicProfileByDomain("links.creator.test");
      expect(unverifiedPublic).toBeNull();

      // 2. Verify custom domain
      const verifyResult = await verifyCustomDomain(mockUser.id);
      expect(verifyResult.verified).toBe(true);

      // Verify profile lookup by domain after verification returns full data
      const verifiedPublic = await getPublicProfileByDomain("links.creator.test");
      expect(verifiedPublic).not.toBeNull();
      expect(verifiedPublic?.user.username).toBe(mockUser.username);

      // 3. Remove custom domain
      const removeResult = await removeCustomDomain(mockUser.id);
      expect(removeResult.success).toBe(true);

      const domainData = await getUserCustomDomain(mockUser.id);
      expect(domainData?.customDomain).toBeNull();
      expect(domainData?.domainVerified).toBe(false);
    });
  });

  describe("Custom Domain API Endpoints", () => {
    it("manages domain lifecycle via GET, POST, PUT, DELETE routes", async () => {
      vi.mocked(nextAuth.getServerSession).mockResolvedValue({
        user: mockUser,
        expires: "2099-01-01",
      });

      // 1. POST domain
      const postReq = new NextRequest("http://localhost:3000/api/profile/custom-domain", {
        method: "POST",
        body: JSON.stringify({ domain: "mybio.creator.test" }),
      });
      const postRes = await POST(postReq);
      const postJson = await postRes.json();
      expect(postRes.status).toBe(200);
      expect(postJson.success).toBe(true);

      // 2. GET domain info and DNS instructions
      const getRes = await GET();
      const getJson = await getRes.json();
      expect(getRes.status).toBe(200);
      expect(getJson.data.customDomain).toBe("mybio.creator.test");
      expect(getJson.data.instructions.cname.target).toBe("cname.anlinks.dev");

      // 3. PUT verification
      const putRes = await PUT();
      const putJson = await putRes.json();
      expect(putRes.status).toBe(200);
      expect(putJson.verified).toBe(true);

      // 4. DELETE domain
      const deleteRes = await DELETE();
      const deleteJson = await deleteRes.json();
      expect(deleteRes.status).toBe(200);
      expect(deleteJson.success).toBe(true);
    });
  });
});
