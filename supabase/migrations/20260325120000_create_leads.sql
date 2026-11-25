-- Phase 1: CRM lead capture for public consultation enquiries.
-- Access is default-deny via RLS. Inserts occur only through the
-- privileged server client (secret key) from the Next.js API route.

create extension if not exists pgcrypto;

create type public.lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'converted',
  'closed',
  'spam'
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null
    constraint leads_full_name_length check (char_length(trim(full_name)) between 2 and 120),
  email text not null
    constraint leads_email_format check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text
    constraint leads_phone_length check (phone is null or char_length(trim(phone)) between 7 and 32),
  country text
    constraint leads_country_length check (country is null or char_length(trim(country)) between 2 and 80),
  project_type text
    constraint leads_project_type_length check (project_type is null or char_length(trim(project_type)) between 2 and 80),
  location text
    constraint leads_location_length check (location is null or char_length(trim(location)) between 2 and 120),
  budget_range text
    constraint leads_budget_range_length check (budget_range is null or char_length(trim(budget_range)) between 2 and 80),
  message text not null
    constraint leads_message_length check (char_length(trim(message)) between 10 and 4000),
  source text not null default 'landing_consultation'
    constraint leads_source_length check (char_length(trim(source)) between 2 and 80),
  status public.lead_status not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_email_idx on public.leads (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.leads force row level security;

-- No anon/authenticated policies: public cannot read or write leads directly.
-- Authorized staff access and notifications land in Phase 2+.

revoke all on table public.leads from anon, authenticated;
grant select, insert, update, delete on table public.leads to service_role;

comment on table public.leads is
  'Public consultation enquiries. Mutated only via privileged server routes.';
