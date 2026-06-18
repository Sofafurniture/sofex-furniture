-- Expected cash to collect on manual cash deliveries

alter table public.delivery_jobs
  add column if not exists cash_due_pence integer;
