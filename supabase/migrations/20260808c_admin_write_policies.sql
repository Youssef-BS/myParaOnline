-- categories and products have RLS enabled with a public SELECT policy but
-- no INSERT/UPDATE/DELETE policy at all, so every admin write is rejected
-- with "new row violates row-level security policy". Add admin-gated write
-- access using the is_admin() helper from 20260808b_fix_user_profiles_rls.sql.

create policy "categories_admin_write" on public.categories
  for insert
  with check (public.is_admin());

create policy "categories_admin_update" on public.categories
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_admin_delete" on public.categories
  for delete
  using (public.is_admin());

create policy "products_admin_write" on public.products
  for insert
  with check (public.is_admin());

create policy "products_admin_update" on public.products
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete" on public.products
  for delete
  using (public.is_admin());
