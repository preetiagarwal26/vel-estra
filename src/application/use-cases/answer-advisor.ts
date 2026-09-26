import { analyzeDeal } from "@/domain/analysis/recommendation-engine";
import type { AnalysisResult, DealAssumptions } from "@/domain/deal/types";

export function answerAdvisor(
  question: string,
  assumptions: DealAssumptions,
  analysis: AnalysisResult,
): string {
  const offerMatch = question.match(/\$?\s*([0-9]{3,7}(?:,[0-9]{3})*)/);
  const parsedOffer = offerMatch
    ? Number(offerMatch[1].replace(/,/g, ""))
    : null;

  if (parsedOffer && parsedOffer > 50_000) {
    const next = analyzeDeal({ ...assumptions, offerPrice: parsedOffer }, analysis.benchmarkRate);
    return [
      `At an offer of $${parsedOffer.toLocaleString()}, the model says ${next.recommendation.action} (${next.recommendation.confidencePercent}% confidence).`,
      `Cash-on-cash would be ${next.metrics.cashOnCashPercent.toFixed(1)}% with monthly cash flow of $${Math.round(next.metrics.cashFlowMonthly).toLocaleString()}.`,
      `Max offer to hit your ${assumptions.minCashOnCashPercent}% target is about $${next.metrics.maxOfferAtTarget.toLocaleString()}.`,
      next.recommendation.headline,
    ].join(" ");
  }

  if (/why|explain|driver/i.test(question)) {
    return [
      analysis.recommendation.headline,
      ...analysis.recommendation.drivers,
      analysis.recommendation.risks.length
        ? `Risks: ${analysis.recommendation.risks.join(" ")}`
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (/max|offer|price/i.test(question)) {
    return `The max offer that still meets your ${assumptions.minCashOnCashPercent}% cash-on-cash target is $${analysis.metrics.maxOfferAtTarget.toLocaleString()}. Current ask is $${assumptions.offerPrice.toLocaleString()}.`;
  }

  return [
    `Latest recommendation: ${analysis.recommendation.action} at ${analysis.recommendation.confidencePercent}% confidence.`,
    analysis.recommendation.headline,
    `Cash-on-cash ${analysis.metrics.cashOnCashPercent.toFixed(1)}%, DSCR ${analysis.metrics.dscr.toFixed(2)}, monthly cash flow $${Math.round(analysis.metrics.cashFlowMonthly).toLocaleString()}.`,
    "Ask a price-specific question such as “What if I offer $400,000?” to re-run the numbers.",
  ].join(" ");
}
