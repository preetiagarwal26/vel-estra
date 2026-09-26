import type { DealAssumptions, FinancialMetrics } from "@/domain/deal/types";

export function calculateFinancialMetrics(
  assumptions: DealAssumptions,
  offerPrice: number,
): FinancialMetrics {
  const downPayment = offerPrice * (assumptions.downPaymentPercent / 100);
  const loanAmount = offerPrice - downPayment;
  const monthlyRate = assumptions.interestRate / 100 / 12;
  const n = assumptions.loanTermYears * 12;

  let monthlyPi = 0;
  if (loanAmount > 0 && monthlyRate > 0) {
    monthlyPi =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);
  } else if (loanAmount > 0) {
    monthlyPi = loanAmount / n;
  }

  const effectiveRent =
    assumptions.monthlyRent * (1 - assumptions.vacancyRatePercent / 100);
  const pmFee = effectiveRent * (assumptions.propertyManagementPercent / 100);
  const maintenance =
    (offerPrice * (assumptions.maintenancePercent / 100)) / 12;

  const operatingMonthly =
    pmFee +
    assumptions.insuranceMonthly +
    assumptions.hoaMonthly +
    assumptions.taxMonthly +
    maintenance;

  const totalMonthlyPayment = monthlyPi + operatingMonthly;
  const cashFlowMonthly = effectiveRent - totalMonthlyPayment;
  const cashFlowAnnual = cashFlowMonthly * 12;

  const noiAnnual =
    effectiveRent * 12 -
    (pmFee +
      assumptions.insuranceMonthly +
      assumptions.hoaMonthly +
      assumptions.taxMonthly +
      maintenance) *
      12;

  const capRatePercent = offerPrice > 0 ? (noiAnnual / offerPrice) * 100 : 0;

  const totalCashIn =
    downPayment + assumptions.closingCosts + assumptions.rehabBudget;
  const cashOnCashPercent =
    totalCashIn > 0 ? (cashFlowAnnual / totalCashIn) * 100 : 0;

  const dscr =
    monthlyPi > 0 ? (effectiveRent - operatingMonthly) / monthlyPi : 0;

  const grossYieldPercent =
    offerPrice > 0 ? ((assumptions.monthlyRent * 12) / offerPrice) * 100 : 0;

  const maxOfferAtTarget = solveMaxOffer(assumptions);

  return {
    monthlyPi,
    totalMonthlyPayment,
    noiAnnual,
    cashFlowMonthly,
    cashFlowAnnual,
    capRatePercent,
    cashOnCashPercent,
    dscr,
    grossYieldPercent,
    maxOfferAtTarget,
    totalCashIn,
  };
}

function solveMaxOffer(assumptions: DealAssumptions): number {
  let low = 50_000;
  let high = 5_000_000;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const metrics = calculateFinancialMetrics(
      { ...assumptions, offerPrice: mid },
      mid,
    );
    if (metrics.cashOnCashPercent >= assumptions.minCashOnCashPercent) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Math.round(low);
}
