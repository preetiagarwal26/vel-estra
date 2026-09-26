import { describe, expect, it } from "vitest";
import { analyzeDeal } from "@/domain/analysis/recommendation-engine";
import type { DealAssumptions } from "@/domain/deal/types";

const strongDeal: DealAssumptions = {
  offerPrice: 280_000,
  downPaymentPercent: 25,
  interestRate: 6,
  loanTermYears: 30,
  closingCosts: 6_000,
  rehabBudget: 5_000,
  monthlyRent: 2_900,
  vacancyRatePercent: 5,
  propertyManagementPercent: 8,
  insuranceMonthly: 90,
  hoaMonthly: 0,
  taxMonthly: 280,
  maintenancePercent: 1,
  strategy: "rental",
  minCashOnCashPercent: 6,
  holdYears: 5,
};

describe("analyzeDeal", () => {
  it("recommends BUY when return thresholds are met", () => {
    const result = analyzeDeal(strongDeal, 6.5);
    expect(result.recommendation.action).toBe("BUY");
    expect(result.scenarios).toHaveLength(3);
    expect(result.sensitivity).toHaveLength(3);
  });

  it("recommends PASS or NEGOTIATE when the ask is too high", () => {
    const result = analyzeDeal(
      { ...strongDeal, offerPrice: 900_000, monthlyRent: 1800 },
      6.5,
    );
    expect(["PASS", "NEGOTIATE"]).toContain(result.recommendation.action);
  });
});
