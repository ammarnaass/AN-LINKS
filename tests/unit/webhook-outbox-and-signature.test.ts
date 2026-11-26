import { describe, it, expect } from "vitest";
import {
  validateWebhookUrl,
  isPrivateOrLocalIp,
} from "@/features/webhooks/validators/webhooks.validator";
import {
  createWebhookSignature,
  verifyWebhookSignature,
} from "@/features/webhooks/services/webhook-signer.service";
import { calculateNextRetryDelayMs } from "@/features/webhooks/services/webhook-outbox.service";

describe("Webhook Signer & Outbox Reliability Engine", () => {
  describe("validateWebhookUrl & SSRF Protection", () => {
    it("should accept valid public HTTPS and HTTP webhook URLs", () => {
      expect(validateWebhookUrl("https://hooks.zapier.com/hooks/catch/123/abc")).toBe(true);
      expect(validateWebhookUrl("https://webhook.site/unique-uuid-123")).toBe(true);
      expect(validateWebhookUrl("https://api.mycrm.com/v1/anlinks-webhook")).toBe(true);
    });

    it("should reject private IPs, localhost, and cloud metadata IPs", () => {
      expect(validateWebhookUrl("http://localhost:3000/webhook")).toBe(false);
      expect(validateWebhookUrl("http://127.0.0.1/webhook")).toBe(false);
      expect(validateWebhookUrl("http://10.0.0.5/api")).toBe(false);
      expect(validateWebhookUrl("http://192.168.1.100/hook")).toBe(false);
      expect(validateWebhookUrl("http://172.20.0.1/hook")).toBe(false);
      expect(validateWebhookUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
    });

    it("should reject non-http schemes", () => {
      expect(validateWebhookUrl("ftp://example.com/file")).toBe(false);
      expect(validateWebhookUrl("javascript:alert(1)")).toBe(false);
      expect(validateWebhookUrl("file:///etc/passwd")).toBe(false);
    });
  });

  describe("HMAC-SHA256 Signature Generator & Verifier", () => {
    const secret = "whsec_test_secret_key_123456789";
    const payload = JSON.stringify({ event: "order.completed", amount: 150 });
    const nowTimestamp = Math.floor(Date.now() / 1000);

    it("should generate formatted header t={timestamp},v1={hash}", () => {
      const header = createWebhookSignature(payload, secret, nowTimestamp);
      expect(header).toMatch(/^t=\d+,v1=[a-f0-9]{64}$/);
      expect(header).toContain(`t=${nowTimestamp}`);
    });

    it("should verify valid signature successfully", () => {
      const header = createWebhookSignature(payload, secret, nowTimestamp);
      const isValid = verifyWebhookSignature(payload, header, secret, 300);
      expect(isValid).toBe(true);
    });

    it("should reject invalid secret or tampered payload", () => {
      const header = createWebhookSignature(payload, secret, nowTimestamp);
      const isTampered = verifyWebhookSignature(
        JSON.stringify({ event: "order.completed", amount: 999 }),
        header,
        secret
      );
      expect(isTampered).toBe(false);

      const isWrongSecret = verifyWebhookSignature(payload, header, "wrong_secret");
      expect(isWrongSecret).toBe(false);
    });

    it("should reject expired timestamp (older than tolerance)", () => {
      const oldTimestamp = nowTimestamp - 400; // 400s ago (> 300s tolerance)
      const header = createWebhookSignature(payload, secret, oldTimestamp);
      const isValid = verifyWebhookSignature(payload, header, secret, 300);
      expect(isValid).toBe(false);
    });
  });

  describe("calculateNextRetryDelayMs (Exponential Backoff)", () => {
    it("should calculate progressive retry delays up to 5 attempts", () => {
      expect(calculateNextRetryDelayMs(0)).toBe(60 * 1000); // Attempt 1: 1m
      expect(calculateNextRetryDelayMs(1)).toBe(5 * 60 * 1000); // Attempt 2: 5m
      expect(calculateNextRetryDelayMs(2)).toBe(15 * 60 * 1000); // Attempt 3: 15m
      expect(calculateNextRetryDelayMs(3)).toBe(60 * 60 * 1000); // Attempt 4: 60m
      expect(calculateNextRetryDelayMs(4)).toBe(null); // Max attempts reached (5 total)
    });
  });
});
