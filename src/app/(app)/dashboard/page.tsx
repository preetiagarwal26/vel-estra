import Link from "next/link";
import { loadDeals } from "@/app/actions/deals";
import { Badge, Button, Card } from "@/components/ui";
import { hasSupabaseEnv } from "@/lib/env";
import { money, pct } from "@/lib/format";

export default async function DashboardPage() {
  const deals = hasSupabaseEnv ? await loadDeals().catch(() => []) : [];
  const recent = deals.slice(0, 6);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#c9842a]">Workspace</p>
          <h1 className="mt-2 text-4xl">Deal dashboard</h1>
        </div>
        <Link href="/deals/new">
          <Button>New analysis</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-[#5d6b75]">Saved deals</p>
          <p className="mt-2 text-3xl">{deals.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-[#5d6b75]">Buy signals</p>
          <p className="mt-2 text-3xl">
            {deals.filter((d) => d.latest?.recommendation.action === "BUY").length}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-[#5d6b75]">Watched</p>
          <p className="mt-2 text-3xl">{deals.filter((d) => d.watched).length}</p>
        </Card>
      </div>

      <div className="grid gap-4">
        {recent.length === 0 ? (
          <Card>
            <p>No deals yet. Analyze an address to get your first BUY / PASS / NEGOTIATE call.</p>
          </Card>
        ) : (
          recent.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <Card className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg">{deal.address_line}</p>
                  <p className="text-sm text-[#5d6b75]">
                    {deal.city}, {deal.state} · {deal.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {deal.latest ? (
                    <>
                      <span className="text-sm text-[#5d6b75]">
                        {pct(deal.latest.metrics.cashOnCashPercent)} ·{" "}
                        {money(deal.latest.metrics.cashFlowMonthly)}
                      </span>
                      <Badge
                        tone={
                          deal.latest.recommendation.action === "BUY"
                            ? "buy"
                            : deal.latest.recommendation.action === "PASS"
                              ? "pass"
                              : "negotiate"
                        }
                      >
                        {deal.latest.recommendation.action}
                      </Badge>
                    </>
                  ) : (
                    <Badge>No run</Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
