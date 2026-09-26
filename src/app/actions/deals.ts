"use server";

import { revalidatePath } from "next/cache";
import { analyzeDeal } from "@/domain/analysis/recommendation-engine";
import type {
  AnalysisResult,
  DealAssumptions,
  DealPipelineStatus,
  PropertySnapshot,
} from "@/domain/deal/types";
import { createPropertyDataAdapter } from "@/infrastructure/property-data/rentcast-adapter";
import { FredRateSource } from "@/infrastructure/rates/fred-rate-source";
import { createClient } from "@/lib/supabase/server";

export async function enrichPropertyAction(address: string) {
  const adapter = createPropertyDataAdapter();
  const property = await adapter.enrich(address);
  const rate = await new FredRateSource().getBenchmarkMortgageRate();
  return { property, rate };
}

export async function previewAnalysisAction(assumptions: DealAssumptions) {
  const rate = await new FredRateSource().getBenchmarkMortgageRate();
  return analyzeDeal(assumptions, rate);
}

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) throw new Error("You must be signed in.");
  return { supabase, userId: String(userId) };
}

async function writeAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  payload: Record<string, unknown> = {},
) {
  await supabase.from("audit_log").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    payload,
  });
}

export async function saveDealAnalysisAction(input: {
  dealId?: string;
  property: PropertySnapshot;
  assumptions: DealAssumptions;
}) {
  const { supabase, userId } = await requireUser();
  const analysis = await previewAnalysisAction(input.assumptions);

  let dealId = input.dealId;
  if (!dealId) {
    const { data, error } = await supabase
      .from("deals")
      .insert({
        user_id: userId,
        address_line: input.property.addressLine,
        city: input.property.city,
        state: input.property.state,
        zip: input.property.zip,
        status: "analyzing",
        property_snapshot: input.property,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    dealId = data.id;
  } else {
    await supabase
      .from("deals")
      .update({
        property_snapshot: input.property,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dealId);
  }

  const { error: assumptionError } = await supabase.from("deal_assumptions").insert({
    deal_id: dealId,
    payload: input.assumptions,
  });
  if (assumptionError) throw new Error(assumptionError.message);

  const { error: runError } = await supabase.from("analysis_runs").insert({
    deal_id: dealId,
    user_id: userId,
    model_version: analysis.modelVersion,
    result: analysis,
  });
  if (runError) throw new Error(runError.message);

  await supabase.from("alerts").insert({
    user_id: userId,
    deal_id: dealId,
    kind: "recommendation",
    title: `${analysis.recommendation.action} on ${input.property.addressLine}`,
    body: analysis.recommendation.headline,
  });

  await writeAudit(supabase, userId, "analyze_deal", "deal", dealId, {
    action: analysis.recommendation.action,
  });

  revalidatePath("/dashboard");
  revalidatePath("/pipeline");
  revalidatePath("/alerts");
  return { dealId, analysis };
}

export async function updateDealStatusAction(
  dealId: string,
  status: DealPipelineStatus,
) {
  const { supabase, userId } = await requireUser();
  const { data: current } = await supabase
    .from("deals")
    .select("status")
    .eq("id", dealId)
    .single();

  const { error } = await supabase
    .from("deals")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", dealId);
  if (error) throw new Error(error.message);

  await supabase.from("deal_status_history").insert({
    deal_id: dealId,
    user_id: userId,
    from_status: current?.status ?? null,
    to_status: status,
  });
  await writeAudit(supabase, userId, "update_status", "deal", dealId, { status });
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
}

export async function toggleWatchAction(dealId: string, watched: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("deals").update({ watched }).eq("id", dealId);
  if (error) throw new Error(error.message);
  revalidatePath("/pipeline");
  revalidatePath(`/deals/${dealId}`);
}

export async function markAlertReadAction(alertId: string) {
  const { supabase } = await requireUser();
  await supabase
    .from("alerts")
    .update({ read_at: new Date().toISOString() })
    .eq("id", alertId);
  revalidatePath("/alerts");
}

export async function saveCriteriaAction(input: {
  minCashOnCashPercent: number;
  maxOfferPrice: number | null;
  targetMarkets: string;
}) {
  const { supabase, userId } = await requireUser();
  const { error } = await supabase.from("investor_criteria").upsert(
    {
      user_id: userId,
      min_cash_on_cash_percent: input.minCashOnCashPercent,
      max_offer_price: input.maxOfferPrice,
      target_markets: input.targetMarkets
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export type SavedDeal = {
  id: string;
  address_line: string;
  city: string;
  state: string;
  zip: string;
  status: DealPipelineStatus;
  watched: boolean;
  property_snapshot: PropertySnapshot;
  created_at: string;
  latest?: AnalysisResult | null;
};

export async function loadDeals(): Promise<SavedDeal[]> {
  const { supabase } = await requireUser();
  const { data: deals, error } = await supabase
    .from("deals")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  const ids = (deals ?? []).map((d) => d.id);
  const { data: runs } = ids.length
    ? await supabase
        .from("analysis_runs")
        .select("deal_id, result, created_at")
        .in("deal_id", ids)
        .order("created_at", { ascending: false })
    : { data: [] };

  const latestByDeal = new Map<string, AnalysisResult>();
  for (const run of runs ?? []) {
    if (!latestByDeal.has(run.deal_id)) {
      latestByDeal.set(run.deal_id, run.result as AnalysisResult);
    }
  }

  return (deals ?? []).map((deal) => ({
    ...deal,
    latest: latestByDeal.get(deal.id) ?? null,
  })) as SavedDeal[];
}
