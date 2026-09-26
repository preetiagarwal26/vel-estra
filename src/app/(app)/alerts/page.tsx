import { markAlertReadAction } from "@/app/actions/deals";
import { Button, Card } from "@/components/ui";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function AlertsPage() {
  const alerts = hasSupabaseEnv
    ? await (async () => {
        const supabase = await createClient();
        const { data } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false });
        return data ?? [];
      })()
    : [];

  return (
    <div>
      <h1 className="mb-6 text-4xl">Alerts</h1>
      <div className="grid gap-3">
        {alerts.length === 0 ? <Card>No alerts yet. Save an analysis to create the first one.</Card> : null}
        {alerts.map((alert) => (
          <Card key={alert.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#5d6b75]">{alert.kind}</p>
              <h2 className="mt-1 text-xl">{alert.title}</h2>
              <p className="mt-1 text-sm text-[#5d6b75]">{alert.body}</p>
            </div>
            {!alert.read_at ? (
              <form
                action={async () => {
                  "use server";
                  await markAlertReadAction(alert.id);
                }}
              >
                <Button variant="ghost" type="submit">
                  Mark read
                </Button>
              </form>
            ) : (
              <p className="text-xs text-[#5d6b75]">Read</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
