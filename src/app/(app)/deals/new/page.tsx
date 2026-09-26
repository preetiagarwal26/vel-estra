import { DealWizard } from "@/components/deal-wizard";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function NewDealPage() {
  let defaultMinCoC = 8;
  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("investor_criteria")
      .select("min_cash_on_cash_percent")
      .maybeSingle();
    if (data?.min_cash_on_cash_percent) {
      defaultMinCoC = Number(data.min_cash_on_cash_percent);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl">New buy analysis</h1>
      <DealWizard defaultMinCoC={defaultMinCoC} />
    </div>
  );
}
