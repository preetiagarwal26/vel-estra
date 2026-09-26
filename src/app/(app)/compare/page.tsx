import { loadDeals } from "@/app/actions/deals";
import { Card } from "@/components/ui";
import { hasSupabaseEnv } from "@/lib/env";
import { money, pct } from "@/lib/format";

export default async function ComparePage() {
  const deals = hasSupabaseEnv ? await loadDeals().catch(() => []) : [];
  const ranked = [...deals].sort(
    (a, b) =>
      (b.latest?.metrics.cashOnCashPercent ?? -999) -
      (a.latest?.metrics.cashOnCashPercent ?? -999),
  );

  return (
    <div>
      <h1 className="mb-2 text-4xl">Compare deals</h1>
      <p className="mb-6 text-[#5d6b75]">
        Ranked by latest cash-on-cash. Use this when choosing among 2–5 candidate properties.
      </p>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#5d6b75]">
            <tr>
              <th className="pb-2">Property</th>
              <th>Status</th>
              <th>Recommendation</th>
              <th>CoC</th>
              <th>Cash flow</th>
              <th>DSCR</th>
              <th>Max offer</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((deal) => (
              <tr key={deal.id} className="border-t border-[#efe8da]">
                <td className="py-3">{deal.address_line}</td>
                <td>{deal.status}</td>
                <td>{deal.latest?.recommendation.action ?? "—"}</td>
                <td>{deal.latest ? pct(deal.latest.metrics.cashOnCashPercent) : "—"}</td>
                <td>{deal.latest ? money(deal.latest.metrics.cashFlowMonthly) : "—"}</td>
                <td>{deal.latest ? deal.latest.metrics.dscr.toFixed(2) : "—"}</td>
                <td>{deal.latest ? money(deal.latest.metrics.maxOfferAtTarget) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {ranked.length === 0 ? <p className="pt-4">Save at least two analyses to compare.</p> : null}
      </Card>
    </div>
  );
}
