import { describe, it, expect } from "vitest";
import { validateSaudiIban } from "@/features/settings/validators/settings.validator";
import { detectBankFromIban, getBankByCode } from "@/features/settings/constants/saudi-banks";

describe("Saudi IBAN & SAMA Bank Detection", () => {
  it("should detect Saudi bank by code", () => {
    const rajhi = getBankByCode("80");
    expect(rajhi).toBeDefined();
    expect(rajhi?.nameAr).toBe("مصرف الراجحي");

    const snb = getBankByCode("10");
    expect(snb).toBeDefined();
    expect(snb?.nameAr).toBe("البنك الأهلي السعودي");

    const unknown = getBankByCode("99");
    expect(unknown).toBeNull();
  });

  it("should reject IBANs not starting with SA or with wrong length", () => {
    const wrongPrefix = validateSaudiIban("AE1280000000000000000000");
    expect(wrongPrefix.valid).toBe(false);
    expect(wrongPrefix.error).toBe("يجب أن يبدأ الآيبان السعودي بـ SA");

    const shortIban = validateSaudiIban("SA1280000000");
    expect(shortIban.valid).toBe(false);
    expect(shortIban.error).toBe("طول الآيبان السعودي يجب أن يكون 24 خانة بالضبط");
  });

  it("should reject IBAN with unknown SAMA bank code", () => {
    const invalidBank = validateSaudiIban("SA0399000000000000000000");
    expect(invalidBank.valid).toBe(false);
    expect(invalidBank.error).toContain("غير معتمد لدى البنك المركزي السعودي");
  });

  it("should validate and detect bank on a mathematically valid Saudi IBAN", () => {
    // Al Rajhi Bank (80): SA03 8000 0000 6080 1016 7519
    // Let's verify MOD 97-10:
    // Rearranged: "80000000608010167519" + "2810" + "03" = "80000000608010167519281003"
    // BigInt("80000000608010167519281003") % 97n === 1n
    const validRajhiIban = "SA0380000000608010167519";
    const res = validateSaudiIban(validRajhiIban);
    expect(res.valid).toBe(true);
    expect(res.bank?.code).toBe("80");
    expect(res.bank?.nameAr).toBe("مصرف الراجحي");
  });

  it("should reject IBAN when checksum digits are corrupted", () => {
    // Tampered checksum: SA04 instead of SA03
    const corruptedIban = "SA0480000000608010167519";
    const res = validateSaudiIban(corruptedIban);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("رقم الآيبان غير صالح (فشل التحقق من أرقام التدقيق المصرفية)");
  });
});
