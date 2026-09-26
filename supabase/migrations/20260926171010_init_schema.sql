create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.investor_criteria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  min_cash_on_cash_percent numeric not null default 8,
  max_offer_price numeric,
  target_markets text[] not null default '{}',
  property_types text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  address_line text not null,
  city text not null default '',
  state text not null default '',
  zip text not null default '',
  status text not null default 'analyzing'
    check (status in ('analyzing', 'offer', 'passed', 'bought')),
  watched boolean not null default false,
  property_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deal_assumptions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  model_version text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table public.deal_status_history (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  from_status text,
  to_status text not null,
  created_at timestamptz not null default now()
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.advisor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index deals_user_id_idx on public.deals (user_id, updated_at desc);
create index analysis_runs_deal_id_idx on public.analysis_runs (deal_id, created_at desc);
create index alerts_user_id_idx on public.alerts (user_id, created_at desc);
create index audit_log_user_id_idx on public.audit_log (user_id, created_at desc);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  insert into public.investor_criteria (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.investor_criteria enable row level security;
alter table public.deals enable row level security;
alter table public.deal_assumptions enable row level security;
alter table public.analysis_runs enable row level security;
alter table public.deal_status_history enable row level security;
alter table public.alerts enable row level security;
alter table public.advisor_messages enable row level security;
alter table public.audit_log enable row level security;

create policy "profiles_own_select" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_own_update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "criteria_own_all" on public.investor_criteria
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "deals_own_all" on public.deals
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "assumptions_via_deal" on public.deal_assumptions
  for all to authenticated
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_id and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = deal_id and d.user_id = auth.uid()
    )
  );

create policy "analysis_own_all" on public.analysis_runs
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "status_history_own_all" on public.deal_status_history
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "alerts_own_all" on public.alerts
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "advisor_own_all" on public.advisor_messages
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "audit_own_all" on public.audit_log
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
