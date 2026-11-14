import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  setAuthCache,
  clearAuthCache,
  getCachedAuthUser,
  useCurrentUser,
  UserNavDropdown,
} from "@/features/auth";
import { LandingHeader } from "@/features/landing";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("Persistent Navigation Auth & User Dropdown Resilience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuthCache();
  });

  it("should set and retrieve cached auth user across navigation", () => {
    expect(getCachedAuthUser()).toBeNull();

    setAuthCache({
      id: "u123",
      email: "creator@anlinks.dev",
      username: "creator_test",
      role: "USER",
    });

    const cached = getCachedAuthUser();
    expect(cached).not.toBeNull();
    expect(cached?.username).toBe("creator_test");
    expect(cached?.email).toBe("creator@anlinks.dev");

    clearAuthCache();
    expect(getCachedAuthUser()).toBeNull();
  });

  it("should retain authenticated user in useCurrentUser during loading if cached", () => {
    setAuthCache({
      id: "u123",
      email: "creator@anlinks.dev",
      username: "creator_test",
      role: "USER",
      name: "أحمد المبدع",
    });

    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    let result: any = null;
    function TestHookComponent() {
      result = useCurrentUser();
      return null;
    }

    renderToStaticMarkup(React.createElement(TestHookComponent));

    expect(result).not.toBeNull();
    expect(result.isAuthenticated).toBe(true);
    expect(result.user?.username).toBe("creator_test");
    expect(result.user?.name).toBe("أحمد المبدع");
    expect(result.isLoading).toBe(false);
  });

  it("should render UserNavDropdown and not flash login buttons on LandingHeader during loading with cache", () => {
    setAuthCache({
      id: "u123",
      email: "creator@anlinks.dev",
      username: "creator_test",
      role: "USER",
      name: "أحمد المبدع",
    });

    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    const html = renderToStaticMarkup(React.createElement(LandingHeader));

    // Must contain dashboard link and user dropdown
    expect(html).toContain("لوحة التحكم");
    expect(html).toContain("أحمد المبدع");
    expect(html).toContain("@creator_test");

    // Must NOT contain unauthenticated login/register buttons
    expect(html).not.toContain('href="/login"');
    expect(html).not.toContain("ابدأ مجاناً");
  });

  it("should render user info in UserNavDropdown even if session reports loading", () => {
    setAuthCache({
      id: "admin-99",
      email: "admin@anlinks.dev",
      username: "super_admin",
      role: "ADMIN",
      name: "المشرف العام",
    });

    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));

    expect(html).toContain("المشرف العام");
    expect(html).toContain("@super_admin");
    expect(html).toContain('title="مدير النظام"');
  });

  it("should show skeleton on LandingHeader when unauthenticated and loading with no cache", () => {
    clearAuthCache();

    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    const html = renderToStaticMarkup(React.createElement(LandingHeader));

    // When no cache and loading, show skeleton, NOT login buttons
    expect(html).toContain("animate-pulse");
    expect(html).not.toContain('href="/login"');
    expect(html).not.toContain("ابدأ مجاناً");
  });
});

