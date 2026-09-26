import { loadDeals, updateDealStatusAction } from "@/app/actions/deals";
import { Badge, Card, Select } from "@/components/ui";
import type { DealPipelineStatus } from "@/domain/deal/types";
import { hasSupabaseEnv } from "@/lib/env";
import { pct } from "@/lib/format";

const columns: DealPipelineStatus[] = ["analyzing", "offer", "passed", "bought"];

export default async function PipelinePage() {
  const deals = hasSupabaseEnv ? await loadDeals().catch(() => []) : [];

  return (
    <div>
      <h1 className="mb-6 text-4xl">Pipeline</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {columns.map((status) => (
          <div key={status}>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[#5d6b75]">{status}</p>
            <div className="grid gap-3">
              {deals
                .filter((deal) => deal.status === status)
                .map((deal) => (
                  <Card key={deal.id}>
                    <p className="font-medium">{deal.address_line}</p>
                    <p className="mt-1 text-xs text-[#5d6b75]">
                      {deal.city}, {deal.state}
                    </p>
                    {deal.latest ? (
                      <div className="mt-3">
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
                        <p className="mt-2 text-xs">{pct(deal.latest.metrics.cashOnCashPercent)}</p>
                      </div>
                    ) : null}
                    <form
                      className="mt-3"
                      action={async (formData) => {
                        "use server";
                        await updateDealStatusAction(
                          deal.id,
                          String(formData.get("status")) as DealPipelineStatus,
                        );
                      }}
                    >
                      <Select name="status" defaultValue={deal.status}>
                        {columns.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                      <button className="mt-2 text-xs underline" type="submit">
                        Update
                      </button>
                    </form>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
