-- ═══════════════════════════════════════════════════════════════════
-- Random display order + project pinning + Supabase Storage images
-- Run this file ONCE in the Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1) Pin projects (projects only, by product decision) ───────────
alter table portfolio_projects
  add column if not exists is_pinned boolean not null default false;

-- ── 2) Global settings table (single row) ──────────────────────────
create table if not exists portfolio_settings (
  id                   integer primary key default 1 check (id = 1),
  random_order_enabled boolean not null default true,
  updated_at           timestamptz not null default now()
);

insert into portfolio_settings (id, random_order_enabled)
values (1, true)
on conflict (id) do nothing;

-- ── 3) Row level security on settings ──────────────────────────────
alter table portfolio_settings enable row level security;

drop policy if exists "public read settings" on portfolio_settings;
create policy "public read settings"
  on portfolio_settings for select
  using (true);

drop policy if exists "admins write settings" on portfolio_settings;
create policy "admins write settings"
  on portfolio_settings for all
  using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

-- ── 4) Public image bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- ── 5) Storage object policies: public read, admin-only write ──────
drop policy if exists "public read portfolio images" on storage.objects;
create policy "public read portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "admins upload portfolio images" on storage.objects;
create policy "admins upload portfolio images"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );

drop policy if exists "admins update portfolio images" on storage.objects;
create policy "admins update portfolio images"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );

drop policy if exists "admins delete portfolio images" on storage.objects;
create policy "admins delete portfolio images"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );
