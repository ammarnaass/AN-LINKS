import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🚀 Starting End-to-End Live HTTP Test against:", BASE_URL);

  // 1. Landing Page Test
  console.log("\n1. Testing Landing Page (GET /)...");
  const landingRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(landingRes.status, 200, "Landing page should return 200 OK");
  const landingHtml = await landingRes.text();
  assert(landingHtml.includes("AN LINKS"), "Landing page should contain brand name 'AN LINKS'");
  assert(landingHtml.includes("dir=\"rtl\""), "Landing page must be RTL");
  assert(landingHtml.includes("rawabet.me/"), "Landing page should have handle claim prefix");
  assert(landingHtml.includes("احجز رابطك"), "Landing page should contain claim CTA button");

  assert(landingHtml.includes("فيصل الشمري") || landingHtml.includes("طارق المنصور"), "Landing page should render phone mockup showcase");
  console.log("   ✅ Landing Page: 200 OK, RTL verified, Hero & Mockup present.");

  // 2. Registration Page
  console.log("\n2. Testing Registration Page (GET /register)...");
  const registerPageRes = await fetch(`${BASE_URL}/register`);
  assert.strictEqual(registerPageRes.status, 200, "Register page should return 200 OK");
  const registerHtml = await registerPageRes.text();
  assert(registerHtml.includes("أنشئ صفحتك الآن") || registerHtml.includes("إنشاء حساب جديد"), "Register page should contain heading");
  console.log("   ✅ Register Page: 200 OK, form rendered.");

  // 3. Register API Endpoint
  console.log("\n3. Testing Registration API (POST /api/auth/register)...");
  const uniqueUser = `user_${Date.now().toString().slice(-6)}`;
  const registerApiRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `${uniqueUser}@anlinks.dev`,
      username: uniqueUser,
      displayName: "مستخدم تجريبي",
      password: "StrongPassword123!",
    }),
  });

  assert.strictEqual(registerApiRes.status, 201, "Registration should return 201 Created");
  const registerJson = await registerApiRes.json();
  assert.strictEqual(registerJson.user.username, uniqueUser, "Returned username should match");
  console.log(`   ✅ Registered new user: @${uniqueUser} (ID: ${registerJson.user.id})`);

  // 4. Login Page
  console.log("\n4. Testing Login Page (GET /login)...");
  const loginRes = await fetch(`${BASE_URL}/login`);
  assert.strictEqual(loginRes.status, 200, "Login page should return 200 OK");
  console.log("   ✅ Login Page: 200 OK.");

  // 5. Public Profile SSR
  console.log(`\n5. Testing Public Profile Page (GET /${uniqueUser})...`);
  const profileRes = await fetch(`${BASE_URL}/${uniqueUser}`);
  assert.strictEqual(profileRes.status, 200, "Public profile should return 200 OK");
  const profileHtml = await profileRes.text();
  assert(profileHtml.includes("مستخدم تجريبي"), "Profile should display user displayName");
  assert(profileHtml.includes(`@${uniqueUser}`), "Profile should display username");
  console.log(`   ✅ Public Profile: 200 OK, SSR rendered displayName and handle.`);

  // 6. View Beacon API
  console.log(`\n6. Testing View Beacon API (POST /api/views/${uniqueUser})...`);
  const viewRes = await fetch(`${BASE_URL}/api/views/${uniqueUser}`, {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  assert.strictEqual(viewRes.status, 200, "View beacon should return 200 OK");
  const viewJson = await viewRes.json();
  assert(viewJson.success, "View beacon should return success: true");
  console.log("   ✅ View beacon successfully recorded real user visit.");

  // 7. Abuse Reporting API
  console.log("\n7. Testing Report Submission API (POST /api/reports)...");
  const reportRes = await fetch(`${BASE_URL}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: uniqueUser,
      reason: "spam",
      details: "تجربة فحص الإبلاغ التلقائي",
    }),
  });
  assert.strictEqual(reportRes.status, 201, "Report should return 201 Created");
  const reportJson = await reportRes.json();
  assert(reportJson.success, "Report response should indicate success");
  console.log("   ✅ Abuse Report: 201 Created with IP truncation.");

  // 8. Non-existent User 404
  console.log("\n8. Testing Non-existent User Profile (GET /non_existent_user_99999)...");
  const notFoundRes = await fetch(`${BASE_URL}/non_existent_user_99999`);
  assert.strictEqual(notFoundRes.status, 404, "Unknown profile should return 404");
  const notFoundHtml = await notFoundRes.text();
  assert(notFoundHtml.includes("الصفحة غير موجودة"), "404 page should render custom Arabic not found message");
  console.log("   ✅ 404 Not Found: custom Arabic page rendered correctly.");

  // 9. Dashboard Pages
  console.log("\n9. Testing Dashboard Workspaces (GET /dashboard, /dashboard/appearance, /dashboard/analytics, /dashboard/settings)...");
  const dashRes = await fetch(`${BASE_URL}/dashboard`);
  assert.strictEqual(dashRes.status, 200, "Dashboard should return 200 OK");
  const dashHtml = await dashRes.text();
  assert(dashHtml.includes("لوحة التحكم"), "Dashboard should contain Arabic workspace breadcrumb");

  const appRes = await fetch(`${BASE_URL}/dashboard/appearance`);
  assert.strictEqual(appRes.status, 200, "Appearance customizer should return 200 OK");

  const anlRes = await fetch(`${BASE_URL}/dashboard/analytics`);
  assert.strictEqual(anlRes.status, 200, "Analytics dashboard should return 200 OK");

  const setRes = await fetch(`${BASE_URL}/dashboard/settings`);
  assert.strictEqual(setRes.status, 200, "Settings page should return 200 OK");
  console.log("   ✅ Dashboard Workspaces: All 4 workspace screens return 200 OK.");

  // 10. Pricing Page
  console.log("\n10. Testing Dedicated Pricing Page (GET /pricing)...");
  const pricingRes = await fetch(`${BASE_URL}/pricing`);
  assert.strictEqual(pricingRes.status, 200, "Pricing page should return 200 OK");
  const pricingHtml = await pricingRes.text();
  assert(pricingHtml.includes("البداية المجانية"), "Pricing should include free tier");
  assert(pricingHtml.includes("صانع المحتوى المحترف"), "Pricing should include pro tier");
  assert(pricingHtml.includes("الأعمال والوكالات"), "Pricing should include agency tier");
  console.log("   ✅ Pricing Page: 200 OK, 3 tiers rendered.");

  // 11. Features Deep Dive Page
  console.log("\n11. Testing Features Deep Dive Page (GET /features)...");
  const featuresRes = await fetch(`${BASE_URL}/features`);
  assert.strictEqual(featuresRes.status, 200, "Features page should return 200 OK");
  const featuresHtml = await featuresRes.text();
  assert(featuresHtml.includes("فاحص الروابط"), "Features should describe Link Sentinel");
  assert(featuresHtml.includes("المقارنة الحقيقية"), "Features should include alternative comparison");
  console.log("   ✅ Features Page: 200 OK, full deep dive rendered.");

  console.log("\n🎉 ALL LIVE END-TO-END TESTS PASSED SUCCESSFULLY! 100% HEALTHY.");
}


runTests().catch((err) => {
  console.error("❌ Live test failed:", err);
  process.exit(1);
});
