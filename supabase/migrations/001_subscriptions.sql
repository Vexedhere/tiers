create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('free','plus','pro','premium')),
  status text not null default 'pending' check (status in ('pending','active','cancelled','expired')),
  amount_inr integer not null default 0,
  payment_method text,
  payment_reference text,
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

alter table public.subscriptions enable row level security;
create policy "Users can read their own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can create their own pending subscriptions" on public.subscriptions for insert with check (auth.uid() = user_id and status = 'pending');
