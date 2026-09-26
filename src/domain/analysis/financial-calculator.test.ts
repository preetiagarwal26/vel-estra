import { describe, expect, it } from "vitest";
import { calculateFinancialMetrics } from "@/domain/analysis/financial-calculator";
import type { DealAssumptions } from "@/domain/deal/types";

const base: DealAssumptions = {
  offerPrice: 400_000,
  downPaymentPercent: 25,
  interestRate: 6.5,
  loanTermYears: 30,
  closingCosts: 8_000,
  rehabBudget: 15_000,
  monthlyRent: 2_800,
  vacancyRatePercent: 5,
  propertyManagementPercent: 8,
  insuranceMonthly: 120,
  hoaMonthly: 0,
  taxMonthly: 400,
  maintenancePercent: 1,
  strategy: "rental",
  minCashOnCashPercent: 8,
  holdYears: 5,
};

describe("calculateFinancialMetrics", () => {
  it("computes cash flow, cap rate, and cash-on-cash", () => {
    const metrics = calculateFinancialMetrics(base, base.offerPrice);
    expect(metrics.monthlyPi).toBeGreaterThan(0);
    expect(metrics.noiAnnual).toBeGreaterThan(0);
    expect(metrics.totalCashIn).toBe(100_000 + 8_000 + 15_000);
    expect(metrics.capRatePercent).toBeGreaterThan(0);
    expect(metrics.maxOfferAtTarget).toBeGreaterThan(0);
  });

  it("returns a lower max offer when the return target is higher", () => {
    const easy = calculateFinancialMetrics(
      { ...base, minCashOnCashPercent: 4 },
      base.offerPrice,
    );
    const hard = calculateFinancialMetrics(
      { ...base, minCashOnCashPercent: 12 },
      base.offerPrice,
    );
    expect(easy.maxOfferAtTarget).toBeGreaterThan(hard.maxOfferAtTarget);
  });
});
