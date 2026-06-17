-- Drivers and delivery scheduling

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  delivery_date date not null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  delivery_address text not null,
  items_description text,
  notes text,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'out_for_delivery', 'delivered', 'cancelled')),
  source text not null default 'manual'
    check (source in ('website', 'manual')),
  sort_order integer not null default 0,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists delivery_jobs_date_idx on public.delivery_jobs (delivery_date);
create index if not exists delivery_jobs_driver_date_idx on public.delivery_jobs (driver_id, delivery_date);
create index if not exists delivery_jobs_order_idx on public.delivery_jobs (order_id);

alter table public.drivers enable row level security;
alter table public.delivery_jobs enable row level security;

-- Service role used by Next.js API routes handles all access

insert into public.drivers (name, email)
values
  ('Driver One', 'driver1@sofex.furniture'),
  ('Driver Two', 'driver2@sofex.furniture')
on conflict (email) do nothing;
