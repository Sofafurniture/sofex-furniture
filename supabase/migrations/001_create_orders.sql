-- Run this in your Supabase SQL editor or via `supabase db push`

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  customer_name text not null,
  shipping_address text not null,
  configuration jsonb not null,
  total_pence integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'failed')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_stripe_session_idx on public.orders (stripe_session_id);

alter table public.orders enable row level security;

-- Allow anonymous inserts for checkout (service role used server-side for updates)
create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Only service role can read/update orders (no public select policy)
create policy "No public reads"
  on public.orders for select
  to anon, authenticated
  using (false);
