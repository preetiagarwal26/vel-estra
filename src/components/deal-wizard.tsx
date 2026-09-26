"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  enrichPropertyAction,
  previewAnalysisAction,
  saveDealAnalysisAction,
} from "@/app/actions/deals";
import { AnalysisResultView } from "@/components/analysis-result";
import { Button, Card, Input, Label, Select } from "@/components/ui";
import type {
  AnalysisResult,
  DealAssumptions,
  DealStrategy,
  PropertySnapshot,
} from "@/domain/deal/types";
import { money } from "@/lib/format";

const emptyAssumptions = (rate: number, rent: number, taxMonthly: number): DealAssumptions => ({
  offerPrice: 0,
  downPaymentPercent: 25,
  interestRate: rate,
  loanTermYears: 30,
  closingCosts: 8000,
  rehabBudget: 10000,
  monthlyRent: rent,
  vacancyRatePercent: 5,
  propertyManagementPercent: 8,
  insuranceMonthly: 120,
  hoaMonthly: 0,
  taxMonthly,
  maintenancePercent: 1,
  strategy: "rental",
  minCashOnCashPercent: 8,
  holdYears: 5,
});

export function DealWizard({
  defaultMinCoC = 8,
}: {
  defaultMinCoC?: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [property, setProperty] = useState<PropertySnapshot | null>(null);
  const [assumptions, setAssumptions] = useState<DealAssumptions>(
    emptyAssumptions(6.5, 0, 0),
  );
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const canAnalyze = useMemo(
    () => assumptions.offerPrice > 0 && assumptions.monthlyRent > 0,
    [assumptions],
  );

  async function enrich() {
    setBusy(true);
    setError("");
    try {
      const result = await enrichPropertyAction(address);
      setProperty(result.property);
      setAssumptions({
        ...emptyAssumptions(
          result.rate,
          result.property.estimatedRent,
          Math.round(result.property.taxAnnual / 12),
        ),
        offerPrice: result.property.estimatedValue,
        minCashOnCashPercent: defaultMinCoC,
      });
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not enrich the address.");
    } finally {
      setBusy(false);
    }
  }

  async function runPreview() {
    setBusy(true);
    setError("");
    try {
      const result = await previewAnalysisAction(assumptions);
      setAnalysis(result);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!property) return;
    setBusy(true);
    setError("");
    try {
      const saved = await saveDealAnalysisAction({ property, assumptions });
      router.push(`/deals/${saved.dealId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the deal.");
    } finally {
      setBusy(false);
    }
  }

  function patch<K extends keyof DealAssumptions>(key: K, value: DealAssumptions[K]) {
    setAssumptions((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 text-sm text-[#5d6b75]">
        <span className={step === 1 ? "text-[#163247]" : ""}>1. Property</span>
        <span>/</span>
        <span className={step === 2 ? "text-[#163247]" : ""}>2. Assumptions</span>
        <span>/</span>
        <span className={step === 3 ? "text-[#163247]" : ""}>3. Decision</span>
      </div>

      {error ? <p className="text-sm text-[#a33b32]">{error}</p> : null}

      {step === 1 ? (
        <Card>
          <h2 className="text-2xl">Analyze a property</h2>
          <p className="mt-2 text-sm text-[#5d6b75]">
            Enter an address you already found. Vel-Estra decides whether to buy, pass, or negotiate.
          </p>
          <div className="mt-5">
            <Label>Property address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Austin, TX 78704"
            />
          </div>
          <Button className="mt-4" disabled={!address || busy} onClick={enrich}>
            {busy ? "Looking up…" : "Continue"}
          </Button>
        </Card>
      ) : null}

      {step === 2 && property ? (
        <div className="grid gap-5">
          <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[#5d6b75]">
              {property.dataSource} · {property.asOf}
            </p>
            <h2 className="mt-2 text-2xl">
              {property.addressLine}, {property.city}, {property.state} {property.zip}
            </h2>
            <p className="mt-2 text-sm text-[#5d6b75]">
              {property.beds} bd · {property.baths} ba · {property.sqFt.toLocaleString()} sq ft ·
              built {property.yearBuilt}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <p>Est. value {money(property.estimatedValue)}</p>
              <p>Est. rent {money(property.estimatedRent)}/mo</p>
              <p>Taxes {money(property.taxAnnual)}/yr</p>
            </div>
          </Card>

          <Card>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Offer price" value={assumptions.offerPrice} onChange={(v) => patch("offerPrice", v)} />
              <Field label="Down payment %" value={assumptions.downPaymentPercent} onChange={(v) => patch("downPaymentPercent", v)} />
              <Field label="Interest rate %" value={assumptions.interestRate} onChange={(v) => patch("interestRate", v)} step="0.01" />
              <Field label="Loan term (years)" value={assumptions.loanTermYears} onChange={(v) => patch("loanTermYears", v)} />
              <Field label="Closing costs" value={assumptions.closingCosts} onChange={(v) => patch("closingCosts", v)} />
              <Field label="Rehab budget" value={assumptions.rehabBudget} onChange={(v) => patch("rehabBudget", v)} />
              <Field label="Monthly rent" value={assumptions.monthlyRent} onChange={(v) => patch("monthlyRent", v)} />
              <Field label="Vacancy %" value={assumptions.vacancyRatePercent} onChange={(v) => patch("vacancyRatePercent", v)} />
              <Field label="PM fee %" value={assumptions.propertyManagementPercent} onChange={(v) => patch("propertyManagementPercent", v)} />
              <Field label="Insurance / mo" value={assumptions.insuranceMonthly} onChange={(v) => patch("insuranceMonthly", v)} />
              <Field label="HOA / mo" value={assumptions.hoaMonthly} onChange={(v) => patch("hoaMonthly", v)} />
              <Field label="Taxes / mo" value={assumptions.taxMonthly} onChange={(v) => patch("taxMonthly", v)} />
              <Field label="Maintenance % / yr" value={assumptions.maintenancePercent} onChange={(v) => patch("maintenancePercent", v)} />
              <Field label="Min cash-on-cash %" value={assumptions.minCashOnCashPercent} onChange={(v) => patch("minCashOnCashPercent", v)} />
              <div>
                <Label>Strategy</Label>
                <Select
                  value={assumptions.strategy}
                  onChange={(e) => patch("strategy", e.target.value as DealStrategy)}
                >
                  <option value="rental">Long-term rental</option>
                  <option value="brrrr">BRRRR</option>
                  <option value="flip">Fix and flip</option>
                </Select>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!canAnalyze || busy} onClick={runPreview}>
                {busy ? "Calculating…" : "See recommendation"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {step === 3 && analysis ? (
        <div className="grid gap-5">
          <AnalysisResultView analysis={analysis} />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Edit assumptions
            </Button>
            <Button disabled={busy} onClick={save}>
              {busy ? "Saving…" : "Save to pipeline"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
