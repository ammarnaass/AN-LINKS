import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AdminSidebar,
  AdminNavTabs,
  AdminSubscriptionsContainer,
  SubscriptionsSubTabNav,
} from "@/features/admin";

describe("Admin Subscriptions Sidebar Separation Test Suite", () => {
  it("should render 'subscriptions' item as an independent tab in AdminSidebar", () => {
    const handleTabChange = vi.fn();
    const html = renderToStaticMarkup(
      <AdminSidebar
        activeTab="subscriptions"
        onTabChange={handleTabChange}
        plansCount={3}
      />
    );

    expect(html).toContain("باقات واشتراكات المنصة");
    expect(html).toContain("المالية وبوابات الدفع");
    expect(html).toContain("الإحصائيات والنمو");
    expect(html).toContain("المستخدمين");
  });

  it("should render separate badges for plans and other tabs", () => {
    const html = renderToStaticMarkup(
      <AdminSidebar
        activeTab="analytics"
        onTabChange={() => {}}
        plansCount={5}
        usersCount={42}
      />
    );

    expect(html).toContain("5");
    expect(html).toContain("42");
  });

  it("should render 'subscriptions' in AdminNavTabs horizontal bar", () => {
    const handleTabChange = vi.fn();
    const html = renderToStaticMarkup(
      <AdminNavTabs
        activeTab="subscriptions"
        onTabChange={handleTabChange}
        plansCount={3}
      />
    );

    expect(html).toContain("باقات واشتراكات المنصة");
    expect(html).toContain("المالية وبوابات الدفع");
  });

  it("should render SubscriptionsSubTabNav with all 3 dedicated sub-tabs", () => {
    const handleSelect = vi.fn();
    const html = renderToStaticMarkup(
      <SubscriptionsSubTabNav
        activeSubTab="plans"
        setActiveSubTab={handleSelect}
        totalPlans={3}
        activeCoupons={2}
      />
    );

    expect(html).toContain("باقات الاشتراك والأسعار");
    expect(html).toContain("المحددات والصلاحيات (Quotas)");
    expect(html).toContain("كوبونات وقسائم الخصم");
    expect(html).toContain("3");
    expect(html).toContain("2");
  });

  it("should mount AdminSubscriptionsContainer successfully", () => {
    const html = renderToStaticMarkup(
      <AdminSubscriptionsContainer />
    );

    expect(html).toContain("إدارة باقات واشتراكات المنصة");
    expect(html).toContain("إجمالي الباقات");
    expect(html).toContain("الباقات النشطة");
    expect(html).toContain("الكوبونات الفعالة");
    expect(html).toContain("باقات الاشتراك والأسعار");
  });
});
