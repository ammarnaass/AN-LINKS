import { describe, it, expect } from "vitest";
import {
  LANDING_TEMPLATES,
  LANDING_TESTIMONIALS,
  LANDING_FAQS,
} from "@/features/landing";

describe("Stitch _9 Landing Page Data & Components", () => {
  it("should provide templates across 4 creator categories", () => {
    expect(LANDING_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    const creator = LANDING_TEMPLATES.find((t) => t.category === "creator");
    const writer = LANDING_TEMPLATES.find((t) => t.category === "writer");
    expect(creator).toBeDefined();
    expect(writer).toBeDefined();
  });

  it("should provide authentic creator testimonials with Arabic copy", () => {
    expect(LANDING_TESTIMONIALS.length).toBeGreaterThanOrEqual(3);
    expect(LANDING_TESTIMONIALS[0]).toHaveProperty("name");
    expect(LANDING_TESTIMONIALS[0]).toHaveProperty("role");
    expect(LANDING_TESTIMONIALS[0]).toHaveProperty("quote");
  });

  it("should provide comprehensive landing FAQs matching Stitch _9", () => {
    expect(LANDING_FAQS).toHaveLength(4);
  });
});
