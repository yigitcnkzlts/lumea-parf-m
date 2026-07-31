-- Bee Parfüm Faz 1 — core schema
-- Apply in Supabase SQL editor or via supabase db push

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum (
    'pending',
    'awaiting_payment',
    'paid',
    'preparing',
    'shipped',
    'delivered',
    'cancelled',
    'refund_requested',
    'refunded',
    'payment_failed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'not_started',
    'initialized',
    'pending_3ds',
    'success',
    'failed',
    'cancelled',
    'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.reservation_status as enum (
    'active',
    'consumed',
    'released',
    'expired'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_channel as enum ('email', 'sms');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_status as enum (
    'queued',
    'processing',
    'sent',
    'failed',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  favorite_product_ids integer[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id integer primary key,
  slug text not null unique,
  brand text not null,
  name text not null,
  category text not null check (category in ('Kadın', 'Erkek', 'Unisex')),
  scent_family text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  sale_price numeric(12, 2) not null check (sale_price >= 0),
  images text[] not null default '{}',
  rating numeric(3, 2) not null default 0,
  review_count integer not null default 0,
  stock integer not null default 0 check (stock >= 0),
  sizes integer[] not null default '{30,50,100}',
  top_notes text[] not null default '{}',
  heart_notes text[] not null default '{}',
  base_notes text[] not null default '{}',
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_brand_idx on public.products (brand);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (is_active);

-- ---------------------------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null default 'Ev',
  full_name text not null,
  phone text not null,
  city text not null,
  district text not null,
  address_line text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'not_started',
  currency text not null default 'TRY',
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  shipping_fee numeric(12, 2) not null default 0 check (shipping_fee >= 0),
  total numeric(12, 2) not null check (total >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_city text not null,
  shipping_district text not null,
  shipping_address text not null,
  note text not null default '',
  cargo_company text,
  tracking_number text,
  shipped_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  refund_reason text,
  refunded_at timestamptz,
  iyzico_conversation_id text,
  iyzico_payment_id text,
  iyzico_token text,
  payment_provider text not null default 'iyzico',
  idempotency_key text unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_number_idx on public.orders (order_number);
create index if not exists orders_iyzico_payment_idx on public.orders (iyzico_payment_id);

-- ---------------------------------------------------------------------------
-- Order items (price snapshot at checkout time)
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id integer not null references public.products (id),
  product_slug text not null,
  brand text not null,
  name text not null,
  size_ml integer not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  line_total numeric(12, 2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists order_items_product_idx on public.order_items (product_id);

-- ---------------------------------------------------------------------------
-- Payment events (audit / idempotency — NEVER store card data)
-- ---------------------------------------------------------------------------
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  provider text not null default 'iyzico',
  event_type text not null,
  provider_payment_id text,
  provider_conversation_id text,
  status text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create unique index if not exists payment_events_idempotency_idx
  on public.payment_events (provider, provider_payment_id, event_type)
  where provider_payment_id is not null;

create index if not exists payment_events_order_idx on public.payment_events (order_id);

-- ---------------------------------------------------------------------------
-- Stock reservations
-- ---------------------------------------------------------------------------
create table if not exists public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id integer not null references public.products (id),
  quantity integer not null check (quantity > 0),
  status public.reservation_status not null default 'active',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists stock_reservations_order_idx on public.stock_reservations (order_id);
create index if not exists stock_reservations_product_idx on public.stock_reservations (product_id);
create index if not exists stock_reservations_active_idx
  on public.stock_reservations (product_id, status)
  where status = 'active';

-- ---------------------------------------------------------------------------
-- Notification jobs (email / SMS queue)
-- ---------------------------------------------------------------------------
create table if not exists public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  user_id uuid references public.profiles (id) on delete set null,
  channel public.notification_channel not null,
  template_key text not null,
  recipient text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.notification_status not null default 'queued',
  attempts integer not null default 0,
  last_error text,
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notification_jobs_status_idx on public.notification_jobs (status, scheduled_at);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists addresses_updated_at on public.addresses;
create trigger addresses_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists notification_jobs_updated_at on public.notification_jobs;
create trigger notification_jobs_updated_at
  before update on public.notification_jobs
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Available stock = stock - active reservations
create or replace function public.product_available_stock(p_product_id integer)
returns integer
language sql
stable
as $$
  select greatest(
    coalesce((select stock from public.products where id = p_product_id), 0)
    - coalesce((
        select sum(quantity)::integer
        from public.stock_reservations
        where product_id = p_product_id
          and status = 'active'
          and expires_at > now()
      ), 0),
    0
  );
$$;
