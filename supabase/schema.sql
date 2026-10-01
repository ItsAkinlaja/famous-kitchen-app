-- =========================================================
-- Famous Kitchen — Supabase Database Schema
-- Run this in the Supabase SQL editor to set up your database
-- =========================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── PROFILES ──────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── MENU ITEMS ────────────────────────────────────────────
create table if not exists public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10, 2) not null check (price >= 0),
  image_url   text,
  is_available boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists menu_items_sort_order_idx on public.menu_items(sort_order);

-- ─── ORDERS ────────────────────────────────────────────────
create table if not exists public.orders (
  id                        uuid primary key default gen_random_uuid(),
  order_number              text not null unique,
  customer_name             text not null,
  phone                     text not null,
  email                     text not null,
  order_type                text not null check (order_type in ('pickup', 'delivery')),
  delivery_location         text,
  delivery_note             text,
  subtotal                  numeric(10, 2) not null check (subtotal >= 0),
  takeaway_fee              numeric(10, 2) not null default 0 check (takeaway_fee >= 0),
  delivery_fee              numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  total                     numeric(10, 2) not null check (total >= 0),
  payment_status            text not null default 'pending'
                              check (payment_status in ('pending', 'verified', 'rejected')),
  order_status              text not null default 'pending'
                              check (order_status in (
                                'pending', 'confirmed', 'preparing', 'ready',
                                'out_for_delivery', 'completed', 'cancelled'
                              )),
  receipt_url               text,
  payment_rejection_reason  text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_order_status_idx on public.orders(order_status);
create index if not exists orders_payment_status_idx on public.orders(payment_status);

-- ─── ORDER ITEMS ───────────────────────────────────────────
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name    text not null,
  unit_price   numeric(10, 2) not null check (unit_price >= 0),
  quantity     integer not null check (quantity > 0),
  subtotal     numeric(10, 2) not null check (subtotal >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- ─── SETTINGS ──────────────────────────────────────────────
create table if not exists public.settings (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ─── DEFAULT SETTINGS ──────────────────────────────────────
insert into public.settings (key, value) values
  ('business_name',          'Famous Kitchen'),
  ('phone_1',                '08164969794'),
  ('phone_2',                '09127380726'),
  ('whatsapp',               '08164969794'),
  ('email',                  'ayoadeokiki94@gmail.com'),
  ('opening_hours',          '7:00 AM – 10:00 PM'),
  ('opay_account_name',      'AYOADE OKIKI'),
  ('opay_account_number',    '8109840858'),
  ('payment_provider',       'OPay'),
  ('takeaway_fee',           '200'),
  ('delivery_fee',           '0'),
  ('delivery_enabled',       'true'),
  ('camp_delivery_fee',      '0'),
  ('camp_delivery_enabled',  'true'),
  ('location_instructions',  'We deliver around NYSC camp, Imo State. Select your preferred pickup or delivery location at checkout.')
on conflict (key) do nothing;

-- ─── DEFAULT MENU ITEMS ────────────────────────────────────
insert into public.menu_items (name, price, is_available, sort_order) values
  ('Spaghetti',            1500.00, true,  1),
  ('Noodles',              1700.00, true,  2),
  ('Yam and Egg Sauce',    2000.00, true,  3),
  ('Plantain and Egg Sauce', 2000.00, true, 4),
  ('Toasted Bread',        1500.00, true,  5),
  ('Tea',                   800.00, true,  6),
  ('Coffee',                500.00, true,  7),
  ('Salad',                1000.00, true,  8),
  ('Chicken',              1500.00, true,  9),
  ('Beef',                  500.00, true,  10),
  ('Takeaway Packaging',    200.00, true,  11)
on conflict do nothing;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles    enable row level security;
alter table public.menu_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.settings    enable row level security;

-- ─── PROFILES RLS ─────────────────────────────────────────
-- Admins can see their own profile
create policy "Admins can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- ─── MENU ITEMS RLS ───────────────────────────────────────
-- Anyone (public) can read available menu items
create policy "Public can read menu items"
  on public.menu_items for select
  using (true);

-- Only authenticated admins can insert/update/delete
create policy "Admins can manage menu items"
  on public.menu_items for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ─── ORDERS RLS ───────────────────────────────────────────
-- Anyone can insert an order (customer ordering)
create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

-- Customers can only read their own order by id (for confirmation page — via service role)
-- Admins (authenticated) can read all orders
create policy "Admins can read all orders"
  on public.orders for select
  using (auth.uid() is not null);

-- Admins can update orders
create policy "Admins can update orders"
  on public.orders for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ─── ORDER ITEMS RLS ──────────────────────────────────────
-- Anyone can insert order items (created server-side during order)
create policy "Anyone can create order items"
  on public.order_items for insert
  with check (true);

-- Admins can read all order items
create policy "Admins can read all order items"
  on public.order_items for select
  using (auth.uid() is not null);

-- ─── SETTINGS RLS ─────────────────────────────────────────
-- Anyone can read settings (needed for customer pages — prices, hours, etc.)
create policy "Public can read settings"
  on public.settings for select
  using (true);

-- Only admins can update settings
create policy "Admins can manage settings"
  on public.settings for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
