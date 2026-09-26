import { Card } from "@/components/ui";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function ActivityPage() {
  const events = hasSupabaseEnv
    ? await (async () => {
        const supabase = await createClient();
        const { data } = await supabase
          .from("audit_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        return data ?? [];
      })()
    : [];

  return (
    <div>
      <h1 className="mb-6 text-4xl">Activity</h1>
      <div className="grid gap-3">
        {events.length === 0 ? <Card>No audit events yet.</Card> : null}
        {events.map((event) => (
          <Card key={event.id}>
            <p className="text-xs uppercase tracking-wide text-[#5d6b75]">
              {new Date(event.created_at).toLocaleString()}
            </p>
            <p className="mt-1">
              {event.action} · {event.entity_type}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
