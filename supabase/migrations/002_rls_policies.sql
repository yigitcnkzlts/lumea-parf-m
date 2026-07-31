-- Bee Parfüm Faz 1 — RLS + admin helpers

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_events enable row level security;
alter table public.stock_reservations enable row level security;
alter table public.notification_jobs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

-- Profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Products: public read active; admin write
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (is_active = true or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Addresses
drop policy if exists "addresses_own_all" on public.addresses;
create policy "addresses_own_all"
  on public.addresses for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- Orders
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- Customers may request cancel/refund on own unpaid/paid orders via limited update is handled by service role APIs.
-- No broad customer update policy on orders (prevents status tampering).

-- Order items
drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
  on public.order_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Payment events: admin read only (writes via service role)
drop policy if exists "payment_events_admin_select" on public.payment_events;
create policy "payment_events_admin_select"
  on public.payment_events for select
  using (public.is_admin());

-- Stock reservations: admin read
drop policy if exists "stock_reservations_admin_select" on public.stock_reservations;
create policy "stock_reservations_admin_select"
  on public.stock_reservations for select
  using (public.is_admin());

-- Notification jobs: admin read
drop policy if exists "notification_jobs_admin_select" on public.notification_jobs;
create policy "notification_jobs_admin_select"
  on public.notification_jobs for select
  using (public.is_admin());

-- Service role bypasses RLS by default in Supabase.
-- Checkout / payment / stock mutations MUST use service role on the server only.
