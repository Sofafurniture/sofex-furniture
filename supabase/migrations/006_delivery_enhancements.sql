-- Delivery enhancements: distance, driver remarks, cash orders, unable to deliver

alter table public.delivery_jobs
  add column if not exists distance_miles numeric(6, 1),
  add column if not exists driver_remarks text,
  add column if not exists unable_to_deliver_notes text,
  add column if not exists is_cash_order boolean not null default false,
  add column if not exists cash_received_pence integer;

alter table public.delivery_jobs drop constraint if exists delivery_jobs_status_check;
alter table public.delivery_jobs add constraint delivery_jobs_status_check
  check (status in ('scheduled', 'out_for_delivery', 'delivered', 'cancelled', 'unable_to_deliver'));
