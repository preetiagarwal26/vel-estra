# Vel-Estra

AI-powered property intelligence for residential investors. Phase 1 and Phase 2 ship a buy-decision workspace:

- Analyze a deal and get **BUY / PASS / NEGOTIATE**
- See cash-on-cash, cap rate, DSCR, max offer, and explanations
- Save deals to a pipeline, compare them, set investor criteria, and ask a grounded advisor

GitHub: [preetiagarwal26/vel-estra](https://github.com/preetiagarwal26/vel-estra)  
Supabase: `https://xvwokbuhmhnyxmevfprb.supabase.co`

## Stack

- Next.js 16 + React 19 on Vercel
- Supabase Auth + Postgres + RLS
- Clean architecture in `src/domain`, `src/application`, `src/infrastructure`

## Local setup

```bash
npm install
copy .env.example .env.local
```

Fill these from the Supabase project **Connect** dialog:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the legacy anon key)

Then apply the schema:

1. Open the Supabase SQL Editor
2. Run `supabase/migrations/20260926171010_init_schema.sql`

```bash
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and analyze an address such as `123 Main St, Austin, TX 78704`.

Without RentCast or FRED keys, the app uses a mock property adapter and a 6.5% rate fallback.

## Deploy on Vercel

1. Import `preetiagarwal26/vel-estra`
2. Add the same environment variables
3. Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL
4. In Supabase Auth, add that URL to allowed redirect URLs

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [Product roadmap](PRODUCT_ROADMAP_BUY_FIRST.md)
