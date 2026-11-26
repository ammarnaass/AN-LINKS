import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminNavTabs } from "@/features/admin/components/AdminNavTabs";
import { AdminSidebarNavList } from "@/features/admin/components/sidebar/AdminSidebarNavList";
import { AdminAnalyticsSkeleton } from "@/features/admin/components/AdminAnalyticsSkeleton";

describe("Admin Dashboard Visibility & Navigation Suite", () => {
  it("renders 'لوحة التحكم الرئيسية' prominently in AdminSidebarNavList", () => {
    const html = renderToStaticMarkup(
      <AdminSidebarNavList
        activeTab="analytics"
        onTabChange={vi.fn()}
        isCollapsedView={false}
      />
    );

    expect(html).toContain("لوحة التحكم الرئيسية (الإحصائيات والنمو)");
    expect(html).toContain("المستخدمين");
    expect(html).toContain("الجلسات النشطة");
  });

  it("renders 'لوحة التحكم الرئيسية' with tooltip in collapsed AdminSidebarNavList", () => {
    const html = renderToStaticMarkup(
      <AdminSidebarNavList
        activeTab="analytics"
        onTabChange={vi.fn()}
        isCollapsedView={true}
      />
    );

    expect(html).toContain('title="لوحة التحكم الرئيسية (الإحصائيات والنمو)"');
    expect(html).toContain('aria-label="لوحة التحكم الرئيسية (الإحصائيات والنمو)"');
  });

  it("renders 'لوحة التحكم الرئيسية' tab in AdminNavTabs", () => {
    const html = renderToStaticMarkup(
      <AdminNavTabs
        activeTab="analytics"
        onTabChange={vi.fn()}
      />
    );

    expect(html).toContain("لوحة التحكم الرئيسية (الإحصائيات والنمو)");
  });

  it("renders loading skeleton instead of empty view when analytics is loading", () => {
    const html = renderToStaticMarkup(
      <AdminAnalyticsSkeleton isLoading={true} />
    );

    expect(html).toContain("animate-pulse");
    expect(html).toContain("aria-busy=\"true\"");
  });

  it("renders helpful error and retry button when analytics fails to load", () => {
    const onRetryMock = vi.fn();
    const html = renderToStaticMarkup(
      <AdminAnalyticsSkeleton isLoading={false} onRetry={onRetryMock} />
    );

    expect(html).toContain("تعذّر تحميل بيانات لوحة التحكم الرئيسية");
    expect(html).toContain("إعادة تحميل البيانات");
  });
});
