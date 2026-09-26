import type { AnalysisResult } from "@/domain/deal/types";
import { Badge, Card } from "@/components/ui";
import { money, pct } from "@/lib/format";

export function AnalysisResultView({ analysis }: { analysis: AnalysisResult }) {
  const tone =
    analysis.recommendation.action === "BUY"
      ? "buy"
      : analysis.recommendation.action === "PASS"
        ? "pass"
        : "negotiate";

  return (
    <div className="grid gap-5">
      <Card className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#5d6b75]">Recommendation</p>
          <h2 className="mt-2 text-3xl">{analysis.recommendation.action}</h2>
          <p className="mt-2 max-w-xl text-[#5d6b75]">{analysis.recommendation.headline}</p>
        </div>
        <div className="text-right">
          <Badge tone={tone}>{analysis.recommendation.confidencePercent}% confidence</Badge>
          <p className="mt-3 text-sm text-[#5d6b75]">
            Max offer {money(analysis.metrics.maxOfferAtTarget)}
          </p>
          <p className="text-xs text-[#5d6b75]">Benchmark rate {pct(analysis.benchmarkRate)}</p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Cash-on-cash" value={pct(analysis.metrics.cashOnCashPercent)} />
        <Metric label="Cap rate" value={pct(analysis.metrics.capRatePercent)} />
        <Metric label="Monthly cash flow" value={money(analysis.metrics.cashFlowMonthly)} />
        <Metric label="DSCR" value={analysis.metrics.dscr.toFixed(2)} />
      </div>

      <Card>
        <h3 className="mb-3 text-lg">Scenarios</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#5d6b75]">
              <tr>
                <th className="pb-2">Scenario</th>
                <th>Price</th>
                <th>CoC</th>
                <th>Cash flow</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              {analysis.scenarios.map((s) => (
                <tr key={s.id} className="border-t border-[#efe8da]">
                  <td className="py-2">{s.label}</td>
                  <td>{money(s.offerPrice)}</td>
                  <td>{pct(s.metrics.cashOnCashPercent)}</td>
                  <td>{money(s.metrics.cashFlowMonthly)}</td>
                  <td className="capitalize">{s.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="mb-2">Why</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3d4a53]">
            {analysis.recommendation.drivers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2">Risks</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3d4a53]">
            {analysis.recommendation.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2">Alternatives</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#3d4a53]">
            {analysis.recommendation.alternatives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3">Sensitivity</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {analysis.sensitivity.map((row) => (
            <div key={row.label} className="rounded-xl bg-[#f6f1e8] p-3">
              <p className="text-xs uppercase tracking-wide text-[#5d6b75]">{row.label}</p>
              <p className="mt-1 text-sm">
                CoC {pct(row.cashOnCashPercent)} · CF {money(row.cashFlowMonthly)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.14em] text-[#5d6b75]">{label}</p>
      <p className="mt-2 text-2xl">{value}</p>
    </Card>
  );
}
