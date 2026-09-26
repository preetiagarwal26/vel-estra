import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv) {
    return <AppShell>{children}</AppShell>;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  return (
    <AppShell email={String(data.claims.email ?? "")}>{children}</AppShell>
  );
}
