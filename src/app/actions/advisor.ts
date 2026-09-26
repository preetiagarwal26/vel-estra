"use server";

import { revalidatePath } from "next/cache";
import { answerAdvisor } from "@/application/use-cases/answer-advisor";
import type { AnalysisResult, DealAssumptions } from "@/domain/deal/types";
import { createClient } from "@/lib/supabase/server";

export async function askAdvisorAction(dealId: string, question: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) throw new Error("You must be signed in.");

  const { data: assumptionRow } = await supabase
    .from("deal_assumptions")
    .select("payload")
    .eq("deal_id", dealId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: run } = await supabase
    .from("analysis_runs")
    .select("result")
    .eq("deal_id", dealId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assumptionRow || !run) {
    throw new Error("Analyze this deal first so the advisor can use real numbers.");
  }

  const answer = answerAdvisor(
    question,
    assumptionRow.payload as DealAssumptions,
    run.result as AnalysisResult,
  );

  await supabase.from("advisor_messages").insert([
    { user_id: userId, deal_id: dealId, role: "user", content: question },
    { user_id: userId, deal_id: dealId, role: "assistant", content: answer },
  ]);

  revalidatePath("/advisor");
  return answer;
}
