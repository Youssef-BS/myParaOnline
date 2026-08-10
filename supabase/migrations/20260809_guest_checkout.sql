-- Guest checkout: customers no longer have accounts, so orders are created
-- with user_id = null by an anonymous (unauthenticated) client. The existing
-- insert policy on orders only allows auth.uid() = user_id, which anonymous
-- requests can never satisfy. Add a permissive policy for the guest case
-- (Postgres OR-combines multiple permissive policies for the same command,
-- so this doesn't replace the existing one). order_items has no owner
-- column of its own — insert is left open, integrity is enforced by its
-- foreign key to orders.

create policy "orders_guest_insert" on public.orders
  for insert
  with check (user_id is null);

create policy "order_items_insert" on public.order_items
  for insert
  with check (true);
