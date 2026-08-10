-- Fixes "infinite recursion detected in policy for relation user_profiles".
-- Cause: an existing policy on user_profiles checks is_admin by querying
-- user_profiles itself, which re-triggers the same policy recursively.
-- Fix: move the is_admin check into a SECURITY DEFINER function, which runs
-- with elevated privileges and bypasses RLS for that one lookup, breaking
-- the loop. Any other table's "admin can do X" policies that reference
-- user_profiles are fixed by this too, since they hit the same recursion.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.user_profiles where id = auth.uid()),
    false
  );
$$;

-- Drop every existing policy on user_profiles (names unknown/inconsistent)
-- and replace with a clean, non-recursive set.
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles'
  loop
    execute format('drop policy %I on public.user_profiles', pol.policyname);
  end loop;
end $$;

alter table public.user_profiles enable row level security;

create policy "user_profiles_select" on public.user_profiles
  for select
  using (auth.uid() = id or public.is_admin());

create policy "user_profiles_update_own" on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id and (is_admin = false or public.is_admin()));
