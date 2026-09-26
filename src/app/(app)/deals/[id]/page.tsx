import Link from "next/link";
import { notFound } from "next/navigation";
import { toggleWatchAction } from "@/app/actions/deals";
import { AnalysisResultView } from "@/components/analysis-result";
import { Button, Card } from "@/components/ui";
import type { AnalysisResult, PropertySnapshot } from "@/domain/deal/types";
import { createClient } from "@/lib/supabase/server";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: deal } = await supabase.from("deals").select("*").eq("id", id).maybeSingle();
  if (!deal) notFound();

  const { data: run } = await supabase
    .from("analysis_runs")
    .select("result, created_at")
    .eq("deal_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const property = deal.property_snapshot as PropertySnapshot;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#c9842a]">{deal.status}</p>
          <h1 className="mt-2 text-4xl">{deal.address_line}</h1>
          <p className="text-[#5d6b75]">
            {deal.city}, {deal.state} {deal.zip}
          </p>
        </div>
        <div className="flex gap-3">
          <form
            action={async () => {
              "use server";
              await toggleWatchAction(id, !deal.watched);
            }}
          >
            <Button variant="ghost" type="submit">
              {deal.watched ? "Unwatch" : "Watch"}
            </Button>
          </form>
          <Link href={`/advisor?deal=${id}`}>
            <Button>Ask advisor</Button>
          </Link>
        </div>
      </div>

      <Card>
        <p className="text-sm text-[#5d6b75]">
          {property.beds} bd · {property.baths} ba · {property.sqFt?.toLocaleString()} sq ft ·{" "}
          {property.dataSource} as of {property.asOf}
        </p>
      </Card>

      {run ? (
        <AnalysisResultView analysis={run.result as AnalysisResult} />
      ) : (
        <Card>No analysis run saved yet.</Card>
      )}
    </div>
  );
}
