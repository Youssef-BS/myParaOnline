-- Stores one-time 6-digit codes emailed to users during signup verification.
-- Only ever read/written by server code using the service_role key, so no
-- anon/authenticated policies are defined — RLS is enabled with zero grants,
-- locking the table down from the client-side API entirely.
create table if not exists public.email_verification_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_verification_codes_email_idx
  on public.email_verification_codes (email);

alter table public.email_verification_codes enable row level security;
