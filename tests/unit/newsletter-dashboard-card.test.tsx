import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NewsletterDashboardCard } from "@/features/dashboard/components/NewsletterDashboardCard";

describe("Newsletter Dashboard Card Suite", () => {
  it("renders newsletter dashboard card with subscriber counters and CTA link", () => {
    const html = renderToStaticMarkup(<NewsletterDashboardCard />);

    expect(html).toContain("إدارة النشرة البريدية والمشتركين");
    expect(html).toContain("اجمع المشتركين وأرسل حملات تسويقية مباشرة لجمهورك");
    expect(html).toContain("مشترك نشط");
    expect(html).toContain("100%");
    expect(html).toContain("جاهزية");
    expect(html).toContain("فتح الاستوديو وإرسال حملة");
    expect(html).toContain('href="/dashboard/newsletter"');
  });
});
