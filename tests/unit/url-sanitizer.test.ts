import { describe, it, expect } from "vitest";
import { sanitizeUrl } from "@/lib/url-sanitizer";

describe("URL Sanitizer", () => {
  it("should accept valid https and http URLs", () => {
    const res1 = sanitizeUrl("https://example.com/page");
    expect(res1.valid).toBe(true);
    expect(res1.normalizedUrl).toBe("https://example.com/page");

    const res2 = sanitizeUrl("http://my-store.sa");
    expect(res2.valid).toBe(true);
    expect(res2.normalizedUrl).toBe("http://my-store.sa");
  });

  it("should auto-prefix https:// when protocol is missing", () => {
    const res = sanitizeUrl("github.com/developer");
    expect(res.valid).toBe(true);
    expect(res.normalizedUrl).toBe("https://github.com/developer");
  });

  it("should reject dangerous schemes like javascript: and data:", () => {
    const resJs = sanitizeUrl("javascript:alert(1)");
    expect(resJs.valid).toBe(false);
    expect(resJs.error).toBeDefined();

    const resData = sanitizeUrl("data:text/html,<script>alert(1)</script>");
    expect(resData.valid).toBe(false);
    expect(resData.error).toBeDefined();

    const resVb = sanitizeUrl("vbscript:msgbox(1)");
    expect(resVb.valid).toBe(false);
  });

  it("should reject raw IP hostnames and localhost", () => {
    expect(sanitizeUrl("http://192.168.1.1/login").valid).toBe(false);
    expect(sanitizeUrl("http://127.0.0.1:3000").valid).toBe(false);
    expect(sanitizeUrl("http://localhost:8080").valid).toBe(false);
    expect(sanitizeUrl("http://[::1]").valid).toBe(false);
  });

  it("should reject known url shorteners to prevent double redirect phishing", () => {
    expect(sanitizeUrl("https://bit.ly/3xYz123").valid).toBe(false);
    expect(sanitizeUrl("https://tinyurl.com/abc").valid).toBe(false);
    expect(sanitizeUrl("https://t.co/xyz").valid).toBe(false);
  });

  it("should reject malformed or invalid domain formats", () => {
    expect(sanitizeUrl("not a url at all").valid).toBe(false);
    expect(sanitizeUrl("https://").valid).toBe(false);
  });
});
