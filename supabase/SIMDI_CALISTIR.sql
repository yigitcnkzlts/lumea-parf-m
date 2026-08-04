-- ============================================================
-- BEE KOZMETİK — Supabase'te ŞİMDİ çalıştır
-- Yol: Dashboard → SQL Editor → New query → Yapıştır → Run
-- ============================================================

-- 1) Faz 3 tablolar + görsel bucket
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null references public.products (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null default '',
  body text not null,
  photo_urls text[] not null default '{}',
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_product_idx
  on public.product_reviews (product_id, created_at desc);

create table if not exists public.stock_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null references public.products (id) on delete cascade,
  email text not null,
  user_id uuid references public.profiles (id) on delete set null,
  notified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, email)
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'site',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.product_reviews enable row level security;
alter table public.stock_alerts enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "reviews_public_select" on public.product_reviews;
create policy "reviews_public_select"
  on public.product_reviews for select
  using (is_approved = true);

drop policy if exists "reviews_auth_insert" on public.product_reviews;
create policy "reviews_auth_insert"
  on public.product_reviews for insert
  to authenticated
  with check (true);

drop policy if exists "reviews_admin_all" on public.product_reviews;
create policy "reviews_admin_all"
  on public.product_reviews for all
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_service_write" on storage.objects;
create policy "product_images_service_write"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- 2) ADMIN YAP — alttaki maili KENDİ giriş mailinle değiştir, sonra bu satırları çalıştır
-- update public.profiles
-- set role = 'admin'
-- where email = 'senin@mail.com';

-- 3) Kontrol
select id, name, public from storage.buckets where id = 'product-images';
select email, role from public.profiles order by created_at desc;
