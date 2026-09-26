export type DealStrategy = "rental" | "flip" | "brrrr";

export type DealPipelineStatus =
  | "analyzing"
  | "offer"
  | "passed"
  | "bought";

export type RecommendationAction = "BUY" | "PASS" | "NEGOTIATE";

export interface PropertySnapshot {
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqFt: number;
  yearBuilt: number;
  estimatedValue: number;
  estimatedRent: number;
  taxAnnual: number;
  dataSource: string;
  asOf: string;
  comps: Array<{
    address: string;
    soldPrice: number;
    sqFt: number;
    distanceMiles: number;
  }>;
}

export interface DealAssumptions {
  offerPrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  closingCosts: number;
  rehabBudget: number;
  monthlyRent: number;
  vacancyRatePercent: number;
  propertyManagementPercent: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  taxMonthly: number;
  maintenancePercent: number;
  strategy: DealStrategy;
  minCashOnCashPercent: number;
  holdYears: number;
}

export interface FinancialMetrics {
  monthlyPi: number;
  totalMonthlyPayment: number;
  noiAnnual: number;
  cashFlowMonthly: number;
  cashFlowAnnual: number;
  capRatePercent: number;
  cashOnCashPercent: number;
  dscr: number;
  grossYieldPercent: number;
  maxOfferAtTarget: number;
  totalCashIn: number;
}

export interface ScenarioResult {
  id: string;
  label: string;
  offerPrice: number;
  metrics: FinancialMetrics;
  signal: "strong" | "monitor" | "weak";
}

export interface Recommendation {
  action: RecommendationAction;
  confidencePercent: number;
  headline: string;
  drivers: string[];
  risks: string[];
  alternatives: string[];
  maxOffer?: number;
}

export interface AnalysisResult {
  modelVersion: string;
  benchmarkRate: number;
  metrics: FinancialMetrics;
  scenarios: ScenarioResult[];
  recommendation: Recommendation;
  sensitivity: Array<{ label: string; cashOnCashPercent: number; cashFlowMonthly: number }>;
}
