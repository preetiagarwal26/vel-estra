import type {
  AnalysisResult,
  DealAssumptions,
  Recommendation,
  ScenarioResult,
} from "@/domain/deal/types";
import { calculateFinancialMetrics } from "@/domain/analysis/financial-calculator";

const MODEL_VERSION = "vel-estra-v1";

export function analyzeDeal(
  assumptions: DealAssumptions,
  benchmarkRate: number,
): AnalysisResult {
  const askMetrics = calculateFinancialMetrics(
    assumptions,
    assumptions.offerPrice,
  );
  const targetPrice = Math.min(
    assumptions.offerPrice,
    askMetrics.maxOfferAtTarget,
  );
  const targetMetrics = calculateFinancialMetrics(assumptions, targetPrice);

  const scenarios: ScenarioResult[] = [
    scenario("buy-ask", "Buy at ask", assumptions.offerPrice, askMetrics),
    scenario("buy-target", "Buy at target", targetPrice, targetMetrics),
    scenario(
      "pass",
      "Pass",
      assumptions.offerPrice,
      askMetrics,
      askMetrics.cashOnCashPercent < assumptions.minCashOnCashPercent
        ? "strong"
        : "monitor",
    ),
  ];

  const recommendation = buildRecommendation(
    assumptions,
    askMetrics,
    targetPrice,
    benchmarkRate,
  );

  const sensitivity = [
    sensitivityRow(assumptions, "Rent -10%", { monthlyRent: assumptions.monthlyRent * 0.9 }),
    sensitivityRow(assumptions, "Rate +1%", { interestRate: assumptions.interestRate + 1 }),
    sensitivityRow(assumptions, "Rehab +$20k", { rehabBudget: assumptions.rehabBudget + 20_000 }),
  ];

  return {
    modelVersion: MODEL_VERSION,
    benchmarkRate,
    metrics: askMetrics,
    scenarios,
    recommendation,
    sensitivity,
  };
}

function scenario(
  id: string,
  label: string,
  offerPrice: number,
  metrics: ReturnType<typeof calculateFinancialMetrics>,
  signalOverride?: ScenarioResult["signal"],
): ScenarioResult {
  let signal: ScenarioResult["signal"] = "monitor";
  if (metrics.cashOnCashPercent >= 10 && metrics.dscr >= 1.2) signal = "strong";
  else if (metrics.cashOnCashPercent < 5 || metrics.dscr < 1) signal = "weak";
  if (signalOverride) signal = signalOverride;

  return { id, label, offerPrice, metrics, signal };
}

function buildRecommendation(
  assumptions: DealAssumptions,
  metrics: ReturnType<typeof calculateFinancialMetrics>,
  targetPrice: number,
  benchmarkRate: number,
): Recommendation {
  const meetsTarget =
    metrics.cashOnCashPercent >= assumptions.minCashOnCashPercent &&
    metrics.dscr >= 1.0 &&
    metrics.cashFlowMonthly > 0;

  const negotiate =
    !meetsTarget &&
    targetPrice < assumptions.offerPrice * 0.98 &&
    targetPrice > 0;

  let action: Recommendation["action"] = "PASS";
  if (meetsTarget) action = "BUY";
  else if (negotiate) action = "NEGOTIATE";

  const rateSpread = benchmarkRate - assumptions.interestRate;
  const drivers: string[] = [];
  if (metrics.cashOnCashPercent >= assumptions.minCashOnCashPercent) {
    drivers.push(
      `Cash-on-cash ${metrics.cashOnCashPercent.toFixed(1)}% meets your ${assumptions.minCashOnCashPercent}% target.`,
    );
  } else {
    drivers.push(
      `Cash-on-cash ${metrics.cashOnCashPercent.toFixed(1)}% is below your ${assumptions.minCashOnCashPercent}% target.`,
    );
  }
  drivers.push(`DSCR ${metrics.dscr.toFixed(2)} at the stated offer price.`);
  if (rateSpread > 0.25) {
    drivers.push(
      `Your modeled rate is ${rateSpread.toFixed(2)}% below the benchmark — favorable financing assumption.`,
    );
  }

  const risks: string[] = [];
  if (metrics.dscr < 1.15) risks.push("Thin debt coverage if rent or expenses shift.");
  if (assumptions.vacancyRatePercent < 5)
    risks.push("Vacancy assumption is aggressive for stress testing.");
  if (assumptions.rehabBudget > assumptions.offerPrice * 0.15)
    risks.push("Rehab budget is a large share of purchase price.");

  const alternatives: string[] = [];
  if (action === "NEGOTIATE") {
    alternatives.push(`Offer up to $${targetPrice.toLocaleString()} to meet return target.`);
  }
  if (action !== "PASS") {
    alternatives.push("Re-run with higher vacancy or lower rent before making an offer.");
  } else {
    alternatives.push("Wait for a price reduction or better financing terms.");
  }

  const confidenceBase =
    50 +
    Math.min(20, metrics.cashOnCashPercent) +
    Math.min(15, metrics.dscr * 10) +
    (meetsTarget ? 10 : 0);
  const confidencePercent = Math.min(95, Math.max(40, Math.round(confidenceBase)));

  const headlines: Record<Recommendation["action"], string> = {
    BUY: "Deal meets your return thresholds at the ask price.",
    PASS: "Deal does not meet your return thresholds at the ask price.",
    NEGOTIATE: "Deal may work at a lower price — negotiate before proceeding.",
  };

  return {
    action,
    confidencePercent,
    headline: headlines[action],
    drivers,
    risks,
    alternatives,
    maxOffer: action === "NEGOTIATE" ? targetPrice : metrics.maxOfferAtTarget,
  };
}

function sensitivityRow(
  base: DealAssumptions,
  label: string,
  patch: Partial<DealAssumptions>,
) {
  const merged = { ...base, ...patch };
  const m = calculateFinancialMetrics(merged, merged.offerPrice);
  return {
    label,
    cashOnCashPercent: m.cashOnCashPercent,
    cashFlowMonthly: m.cashFlowMonthly,
  };
}
