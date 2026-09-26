import { saveCriteriaAction } from "@/app/actions/deals";
import { Button, Card, Input, Label } from "@/components/ui";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  let min = 8;
  let maxPrice = "";
  let markets = "";

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { data } = await supabase.from("investor_criteria").select("*").maybeSingle();
    if (data) {
      min = Number(data.min_cash_on_cash_percent ?? 8);
      maxPrice = data.max_offer_price ? String(data.max_offer_price) : "";
      markets = (data.target_markets ?? []).join(", ");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl">Investor criteria</h1>
      <Card>
        <form
          className="grid max-w-xl gap-4"
          action={async (formData) => {
            "use server";
            const max = Number(formData.get("maxOfferPrice"));
            await saveCriteriaAction({
              minCashOnCashPercent: Number(formData.get("minCashOnCashPercent")),
              maxOfferPrice: Number.isFinite(max) && max > 0 ? max : null,
              targetMarkets: String(formData.get("targetMarkets") ?? ""),
            });
          }}
        >
          <div>
            <Label>Minimum cash-on-cash %</Label>
            <Input name="minCashOnCashPercent" type="number" step="0.1" defaultValue={min} />
          </div>
          <div>
            <Label>Max offer price</Label>
            <Input name="maxOfferPrice" type="number" defaultValue={maxPrice} />
          </div>
          <div>
            <Label>Target markets</Label>
            <Input name="targetMarkets" defaultValue={markets} placeholder="Austin, Dallas" />
          </div>
          <Button type="submit">Save criteria</Button>
        </form>
      </Card>
    </div>
  );
}
