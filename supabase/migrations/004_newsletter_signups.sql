-- Newsletter signups for first-order discount

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  discount_code text not null,
  source text not null default 'popup',
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

create policy "No public reads on newsletter"
  on public.newsletter_signups for select
  to anon, authenticated
  using (false);
