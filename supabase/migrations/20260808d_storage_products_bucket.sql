-- The "products" storage bucket exists (created via the Storage API) but
-- uploads still fail with "new row violates row-level security policy"
-- because storage.objects has its own RLS, separate from the bucket's
-- public/private flag. The public flag only affects anonymous downloads;
-- inserts/updates/deletes still need explicit policies.

create policy "products_bucket_public_read" on storage.objects
  for select
  using (bucket_id = 'products');

create policy "products_bucket_admin_insert" on storage.objects
  for insert
  with check (bucket_id = 'products' and public.is_admin());

create policy "products_bucket_admin_update" on storage.objects
  for update
  using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());

create policy "products_bucket_admin_delete" on storage.objects
  for delete
  using (bucket_id = 'products' and public.is_admin());
