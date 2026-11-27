import { afterEach, describe, expect, it, vi } from "vitest";
import { cashfreeMode, isCashfreeProduction } from "@/lib/cashfree-env";

const set = (value: string | undefined) => {
  if (value === undefined) vi.stubEnv("NEXT_PUBLIC_CASHFREE_ENVIRONMENT", "");
  else vi.stubEnv("NEXT_PUBLIC_CASHFREE_ENVIRONMENT", value);
};

describe("Cashfree environment setting", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(["PRODUCTION", "production", "Production", " production "])("treats %j as live payments", (value) => {
    set(value);
    expect(isCashfreeProduction()).toBe(true);
    expect(cashfreeMode()).toBe("production");
  });

  // "PROD" is not accepted on purpose: only the full word switches to live money.
  it.each(["sandbox", "SANDBOX", "TEST", "PROD", "", undefined])("treats %j as sandbox", (value) => {
    set(value);
    expect(isCashfreeProduction()).toBe(false);
    expect(cashfreeMode()).toBe("sandbox");
  });
});
