# Database

Project URL: `https://xvwokbuhmhnyxmevfprb.supabase.co`

Apply `supabase/migrations/20260926171010_init_schema.sql` in the Supabase SQL Editor, or run `supabase db push` after linking the project.

## Tables

| Table | Purpose |
|---|---|
| `profiles` | Display name, created by auth trigger |
| `investor_criteria` | Default CoC target and markets |
| `deals` | Property + pipeline status |
| `deal_assumptions` | Versioned assumption payloads |
| `analysis_runs` | Recommendation snapshots |
| `deal_status_history` | Pipeline moves |
| `alerts` | Recommendation and threshold notices |
| `advisor_messages` | Grounded Q&A |
| `audit_log` | User actions |

All tables in `public` have RLS enabled. The new-user trigger lives in the private schema.
