# Architecture

Vel-Estra follows clean architecture inside a Next.js App Router app.

```
src/domain            Entities and deterministic financial rules
src/application       Ports and use cases
src/infrastructure    Supabase, RentCast, FRED, mock adapters
src/app               Presentation: routes, server actions, UX
src/components        Shared UI
src/lib               Framework helpers (env, supabase clients)
```

## Rules

- Domain code does not import Next.js, Supabase, or fetch.
- The recommendation engine calculates numbers. The advisor only explains those numbers.
- External API keys stay on the server.
- Every exposed Supabase table has RLS. Users can only read their own rows.

## Decision flow

1. User enters an address.
2. Property adapter enriches attributes (RentCast if keyed, otherwise mock).
3. FRED supplies a mortgage-rate benchmark, or 6.5% is used.
4. User edits buy assumptions.
5. Domain engine returns BUY / PASS / NEGOTIATE, scenarios, and sensitivity.
6. Save writes deal, assumptions, analysis run, alert, and audit log.
