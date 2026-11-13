import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

describe("Database Schema & Prisma Client Singleton", () => {
  it("should export a valid prisma client instance", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe("object");
  });

  it("should have all required model delegates on the prisma client", () => {
    expect(prisma.user).toBeDefined();
    expect(prisma.profile).toBeDefined();
    expect(prisma.link).toBeDefined();
    expect(prisma.socialLink).toBeDefined();
    expect(prisma.dailyLinkStat).toBeDefined();
    expect(prisma.dailyProfileStat).toBeDefined();
    expect(prisma.report).toBeDefined();
  });

  it("should have a valid schema.prisma file containing all required models", () => {
    const schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
    expect(fs.existsSync(schemaPath)).toBe(true);

    const schemaContent = fs.readFileSync(schemaPath, "utf-8");
    const requiredModels = [
      "model User",
      "model Profile",
      "model Link",
      "model SocialLink",
      "model DailyLinkStat",
      "model DailyProfileStat",
      "model Report",
    ];

    for (const model of requiredModels) {
      expect(schemaContent).toContain(model);
    }
  });

  it("should verify foreign keys and cascade rules in schema", () => {
    const schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
    const schemaContent = fs.readFileSync(schemaPath, "utf-8");

    expect(schemaContent).toContain("onDelete: Cascade");
    expect(schemaContent).toContain("@@index([userId, position])");
    expect(schemaContent).toContain("@@unique([linkId, date])");
    expect(schemaContent).toContain("@@unique([username, date])");
  });
});
