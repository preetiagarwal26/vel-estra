import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { hasSupabaseEnv } from "@/lib/env";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#163247] text-[#f6f1e8]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <BrandLogo />
        <div className="flex gap-4 text-sm">
          <Link href="/login">Sign in</Link>
          <Link href="/signup" className="rounded-full bg-[#c9842a] px-4 py-2 text-[#163247]">
            Create account
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-6 md:grid-cols-2">
        <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[#c9842a]">
          Property intelligence
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-tight">
          Should you buy this property at this price — and why?
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#d7cbb8]">
          Vel-Estra is a decision layer for residential investors. Enter a deal you already found.
          Get an explainable BUY, PASS, or NEGOTIATE recommendation grounded in your numbers.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={hasSupabaseEnv ? "/signup" : "/deals/new"}
            className="rounded-lg bg-[#c9842a] px-5 py-3 text-[#163247]"
          >
            Analyze a deal
          </Link>
          <Link href="/login" className="rounded-lg border border-[#c9842a] px-5 py-3">
            Open workspace
          </Link>
        </div>
        </div>
        <BrandLogo href="/" size="lg" showWordmark={false} className="justify-center" />
        <div className="mt-6 grid gap-4 md:col-span-2 md:grid-cols-3">
          {[
            ["Phase 1", "Single-deal analyzer with cash-on-cash, DSCR, max offer, and explanation."],
            ["Phase 2", "Pipeline, comparison, alerts, investor criteria, and a grounded advisor."],
            ["Trust", "Deterministic models calculate. The product explains. You stay in control."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-[#2b4a5f] p-5">
              <p className="text-[#c9842a]">{title}</p>
              <p className="mt-2 text-[#d7cbb8]">{copy}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
