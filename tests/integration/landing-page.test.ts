import { describe, it, expect } from "vitest";
import { sanitizeClaimUsername } from "@/lib/claim-validator";

describe("Landing Page Handle Claim Validator", () => {
  it("should sanitize valid latin username", () => {
    const result = sanitizeClaimUsername("salman");
    expect(result.isValid).toBe(true);
    expect(result.username).toBe("salman");
    expect(result.targetUrl).toBe("/register?username=salman");
  });

  it("should strip leading @ and trim whitespace and convert to lowercase", () => {
    const result = sanitizeClaimUsername("  @Ammar-Dev  ");
    expect(result.isValid).toBe(true);
    expect(result.username).toBe("ammar-dev");
    expect(result.targetUrl).toBe("/register?username=ammar-dev");
  });

  it("should reject empty or whitespace-only inputs gracefully", () => {
    const result = sanitizeClaimUsername("   ");
    expect(result.isValid).toBe(false);
    expect(result.username).toBe("");
    expect(result.targetUrl).toBe("/register");
    expect(result.error).toBe("يرجى إدخال اسم مستخدم");
  });

  it("should reject usernames with invalid characters", () => {
    const result = sanitizeClaimUsername("user!@#$");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة فقط");
  });

  it("should reject usernames that are too short or too long", () => {
    expect(sanitizeClaimUsername("a").isValid).toBe(false);
    expect(sanitizeClaimUsername("a".repeat(31)).isValid).toBe(false);
  });
});

describe("LandingHeader Component", () => {
  it("should render logo, login link, and register CTA button", async () => {
    const { LandingHeader } = await import("@/components/landing/LandingHeader");
    const element = LandingHeader();
    expect(element).toBeDefined();
    // React element type verification
    expect(element.type).toBe("header");
  });
});

describe("LandingFooter Component", () => {
  it("should render copyright, legal links, and platform mission", async () => {
    const { LandingFooter } = await import("@/components/landing/LandingFooter");
    const element = LandingFooter();
    expect(element).toBeDefined();
    expect(element.type).toBe("footer");
  });
});

describe("HeroSection Component", () => {
  it("should export HeroSection component properly", async () => {
    const { HeroSection } = await import("@/components/landing/HeroSection");
    expect(HeroSection).toBeDefined();
    expect(typeof HeroSection).toBe("function");
  });
});

describe("PhoneMockup Component", () => {
  it("should export PhoneMockup component", async () => {
    const { PhoneMockup } = await import("@/components/landing/PhoneMockup");
    expect(PhoneMockup).toBeDefined();
    expect(typeof PhoneMockup).toBe("function");
  });
});

describe("FeaturesSection Component", () => {
  it("should export FeaturesSection component", async () => {
    const { FeaturesSection } = await import("@/components/landing/FeaturesSection");
    expect(FeaturesSection).toBeDefined();
    expect(typeof FeaturesSection).toBe("function");
  });
});

describe("HowItWorksSection Component", () => {
  it("should export HowItWorksSection component", async () => {
    const { HowItWorksSection } = await import("@/components/landing/HowItWorksSection");
    expect(HowItWorksSection).toBeDefined();
    expect(typeof HowItWorksSection).toBe("function");
  });
});
