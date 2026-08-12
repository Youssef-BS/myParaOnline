-- Optional per-category image, shown on the homepage category grid, the
-- category filter pills, and the category detail page banner. Reuses the
-- existing public "products" storage bucket (and its admin-write RLS
-- policies from 20260808d_storage_products_bucket.sql) under a
-- "categories/" path prefix, rather than provisioning a second bucket.
alter table public.categories add column if not exists image_url text;
