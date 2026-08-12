-- Optional per-product discount. When an admin sets discount_price on a
-- product (and it's lower than price), the storefront shows the original
-- price struck through next to the discounted price, and that discounted
-- price becomes the actual price added to cart / charged on the order.
alter table public.products add column if not exists discount_price numeric;
