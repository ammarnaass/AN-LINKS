import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";

describe("Prisma Schema Phase 1 Models & Fields Verification", () => {
  it("should have Phase 1 models defined in Prisma model names", () => {
    const dmmf = Prisma.dmmf;
    const modelNames = dmmf.datamodel.models.map((m) => m.name);

    expect(modelNames).toContain("ConsultationService");
    expect(modelNames).toContain("AvailabilityRule");
    expect(modelNames).toContain("AppointmentBooking");
    expect(modelNames).toContain("CreatorWebhookEndpoint");
    expect(modelNames).toContain("WebhookOutbox");
  });

  it("should have new quota fields in PlanQuota model", () => {
    const dmmf = Prisma.dmmf;
    const planQuota = dmmf.datamodel.models.find((m) => m.name === "PlanQuota");
    expect(planQuota).toBeDefined();

    const fieldNames = planQuota!.fields.map((f) => f.name);
    expect(fieldNames).toContain("allowAppointments");
    expect(fieldNames).toContain("allowOutgoingWebhooks");
    expect(fieldNames).toContain("allowAiCopilot");
  });

  it("should have welcome email fields in Profile model", () => {
    const dmmf = Prisma.dmmf;
    const profile = dmmf.datamodel.models.find((m) => m.name === "Profile");
    expect(profile).toBeDefined();

    const fieldNames = profile!.fields.map((f) => f.name);
    expect(fieldNames).toContain("welcomeSubject");
    expect(fieldNames).toContain("welcomeBody");
    expect(fieldNames).toContain("welcomeGiftUrl");
  });

  it("should have referral fields in User model", () => {
    const dmmf = Prisma.dmmf;
    const user = dmmf.datamodel.models.find((m) => m.name === "User");
    expect(user).toBeDefined();

    const fieldNames = user!.fields.map((f) => f.name);
    expect(fieldNames).toContain("referralCode");
    expect(fieldNames).toContain("referredById");
  });
});
