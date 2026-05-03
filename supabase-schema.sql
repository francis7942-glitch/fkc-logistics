-- ================================================================
-- FKC Logistics — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ================================================================

-- ── USERS ────────────────────────────────────────────────────────
create table if not exists users (
  id text primary key,
  name text not null,
  username text not null unique,
  password text not null,
  role text not null default 'personnel',
  active boolean not null default true
);

-- ── CLIENTS ──────────────────────────────────────────────────────
create table if not exists clients (
  id text primary key,
  name text not null,
  contact text,
  email text,
  address text
);

-- ── LOCATIONS ────────────────────────────────────────────────────
create table if not exists locations (
  id text primary key,
  name text not null,
  description text
);

-- ── ITEMS ────────────────────────────────────────────────────────
create table if not exists items (
  id text primary key,
  client_id text references clients(id) on delete cascade,
  name text not null,
  code text,
  storage_type text not null default 'frozen',
  notes text
);

-- ── TRANSACTIONS ─────────────────────────────────────────────────
create table if not exists transactions (
  id text primary key,
  type text not null check (type in ('IN','OUT')),
  client_id text references clients(id),
  item_id text references items(id),
  item_name text not null,
  location_id text references locations(id),
  kg numeric not null,
  ref_no text,
  date date not null,
  notes text,
  encoded_by text,
  created_at timestamptz default now()
);

-- ── RATES ────────────────────────────────────────────────────────
create table if not exists rates (
  id serial primary key,
  storage_per_kg_per_day numeric not null default 2.50,
  handling_in_per_kg numeric not null default 1.00,
  handling_out_per_kg numeric not null default 1.00
);

-- ── DRY STORAGE CONTRACTS ────────────────────────────────────────
create table if not exists contracts (
  id text primary key,
  client_id text references clients(id),
  ref_no text,
  location_id text references locations(id),
  description text,
  start_date date not null,
  end_date date not null,
  status text default 'active',
  escalation_type text not null default 'fixed_pct',
  escalation_pct numeric default 0,
  base_flat_fee numeric default 0,
  base_slot_rate numeric default 0,
  base_slots integer default 0,
  notes text,
  created_at timestamptz default now()
);

-- Contract periods (one row per year/period per contract)
create table if not exists contract_periods (
  id serial primary key,
  contract_id text references contracts(id) on delete cascade,
  label text,
  start_date date not null,
  end_date date not null,
  flat_fee numeric not null default 0,
  slot_rate numeric not null default 0,
  slots_occupied integer not null default 0
);

-- ── SPARE PARTS ──────────────────────────────────────────────────
create table if not exists sp_machines (
  id text primary key,
  name text not null,
  type text,
  location text,
  asset_tag text,
  status text default 'active',
  notes text
);

create table if not exists sp_parts (
  id text primary key,
  name text not null,
  part_no text not null,
  unit text default 'pcs',
  category text,
  min_stock numeric default 0,
  current_stock numeric default 0,
  supplier text,
  unit_cost numeric default 0,
  machine_ids text[] default '{}',
  location text,
  notes text
);

create table if not exists sp_movements (
  id text primary key,
  type text not null,
  part_id text references sp_parts(id),
  part_name text,
  machine_id text,
  machine_name text,
  qty numeric not null,
  ref_no text,
  notes text,
  encoded_by text,
  date timestamptz default now()
);

create table if not exists sp_purchase_requests (
  id text primary key,
  part_id text references sp_parts(id),
  part_name text,
  qty numeric not null,
  supplier text,
  unit_cost numeric default 0,
  status text default 'open',
  priority text default 'normal',
  requested_by text,
  requested_at timestamptz default now(),
  notes text,
  received_qty numeric default 0
);

-- ── DISABLE ROW LEVEL SECURITY (app handles auth) ────────────────
alter table users disable row level security;
alter table clients disable row level security;
alter table locations disable row level security;
alter table items disable row level security;
alter table transactions disable row level security;
alter table rates disable row level security;
alter table contracts disable row level security;
alter table contract_periods disable row level security;
alter table sp_machines disable row level security;
alter table sp_parts disable row level security;
alter table sp_movements disable row level security;
alter table sp_purchase_requests disable row level security;

-- ── SEED DATA ─────────────────────────────────────────────────────
-- Default admin user (change password after first login!)
insert into users (id, name, username, password, role, active)
values ('USR001', 'Admin', 'admin', 'admin123', 'admin', true)
on conflict do nothing;

-- Default rates
insert into rates (storage_per_kg_per_day, handling_in_per_kg, handling_out_per_kg)
values (2.50, 1.00, 1.00)
on conflict do nothing;

-- Default locations
insert into locations (id, name, description) values
('LOC001', 'Cold Storage 1', 'Main frozen area, Rack A–D'),
('LOC002', 'Cold Storage 2', 'Secondary frozen area, Rack E–H'),
('LOC003', 'Chiller Room',   'Chilled/fresh products'),
('LOC004', 'Dry Storage',    'Ambient temperature goods')
on conflict do nothing;

-- ================================================================
-- Done! Now copy your Project URL and anon key from
-- Project Settings → API and add them to your Netlify env vars.
-- ================================================================
