import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/settings/export/route";
import { prisma } from "@/shared/db";
import * as nextAuth from "next-auth";

vi.mock("next-auth");

describe("Data Export & Portability Suite (PDPL / GDPR)", () => {
  const mockUser = {
    id: "export-test-user-id",
    email: "exporter@anlinks.dev",
    username: "exporter",
    name: "Export Tester",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 unauthorized when user has no session", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost:3000/api/settings/export");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it("exports complete JSON format with profile, links, and socials", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValueOnce({
      user: mockUser,
      expires: "2099-01-01",
    });

    // Ensure user exists in test db
    await prisma.user.upsert({
      where: { email: mockUser.email },
      create: {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        role: "USER",
        profile: {
          create: { displayName: "Export User", bio: "Testing portability" },
        },
        links: {
          create: [
            {
              title: "My Portfolio",
              url: "https://portfolio.example.com",
              position: 0,
              type: "LINK",
              clicksCount: 42,
            },
          ],
        },
      },
      update: {},
    });

    const req = new NextRequest("http://localhost:3000/api/settings/export?format=json");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/json");
    expect(res.headers.get("Content-Disposition")).toContain("anlinks-exporter-");

    const data = await res.json();
    expect(data).toHaveProperty("exportDate");
    expect(data.user.email).toBe(mockUser.email);
    expect(data.links.length).toBeGreaterThan(0);
    expect(data.links[0].title).toBe("My Portfolio");
  });

  it("exports CSV format with UTF-8 BOM for Arabic spreadsheet compatibility", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValueOnce({
      user: mockUser,
      expires: "2099-01-01",
    });

    const req = new NextRequest("http://localhost:3000/api/settings/export?format=csv");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/csv");
    expect(res.headers.get("Content-Disposition")).toContain(".csv");

    const buffer = Buffer.from(await res.arrayBuffer());
    // Verify UTF-8 BOM bytes (EF BB BF) in wire representation for Excel
    expect(buffer[0]).toBe(0xEF);
    expect(buffer[1]).toBe(0xBB);
    expect(buffer[2]).toBe(0xBF);

    // Verify headers and content
    const text = buffer.toString("utf-8");
    expect(text).toContain("Title,URL,Type,Clicks,Active,Created At");
    expect(text).toContain("My Portfolio");
  });
});
