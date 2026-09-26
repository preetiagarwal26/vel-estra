import { AdvisorChat } from "@/components/advisor-chat";
import { Card } from "@/components/ui";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function AdvisorPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string }>;
}) {
  const params = await searchParams;
  if (!hasSupabaseEnv) {
    return <Card>Connect Supabase to use the advisor on saved deals.</Card>;
  }

  const supabase = await createClient();
  const { data: deals } = await supabase
    .from("deals")
    .select("id, address_line")
    .order("updated_at", { ascending: false });
  const dealId = params.deal ?? deals?.[0]?.id;
  const { data: messages } = dealId
    ? await supabase
        .from("advisor_messages")
        .select("role, content")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <div>
      <h1 className="mb-2 text-4xl">AI buy advisor</h1>
      <p className="mb-6 text-[#5d6b75]">
        Answers are grounded in the latest calculated analysis. The advisor never invents numbers.
      </p>
      <AdvisorChat
        deals={deals ?? []}
        initialDealId={dealId}
        initialMessages={(messages ?? []) as Array<{ role: "user" | "assistant"; content: string }>}
      />
    </div>
  );
}
