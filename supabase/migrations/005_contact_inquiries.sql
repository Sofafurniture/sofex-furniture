-- Contact form submissions

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;

create policy "No public reads on contact inquiries"
  on public.contact_inquiries for select
  to anon, authenticated
  using (false);
