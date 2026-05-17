create extension if not exists "pgcrypto";

-- Admins
create table if not exists portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Personal info (single row)
create table if not exists portfolio_personal_info (
  id uuid primary key default gen_random_uuid(),
  is_primary boolean not null default true,
  name text not null,
  name_ar text,
  bio text,
  bio_ar text,
  email text,
  location text,
  location_ar text,
  github text,
  linkedin text,
  twitter text,
  telegram text,
  whatsapp text,
  instagram text,
  facebook text,
  cv_url text,
  avatar_url text,
  floating_skills text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists portfolio_personal_info_single
  on portfolio_personal_info (is_primary) where is_primary;

-- Projects
create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_ar text,
  description text not null,
  description_ar text,
  category text not null check (category in ('Web','Mobile','Design')),
  tags text[] not null default '{}'::text[],
  image_url text,
  images text[] not null default '{}'::text[],
  live_url text,
  github_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_projects_sort
  on portfolio_projects (sort_order, created_at desc);

-- Experience
create table if not exists portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  role_ar text,
  period text not null,
  description text not null,
  description_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Education
create table if not exists portfolio_education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  institution_ar text,
  degree text not null,
  degree_ar text,
  field text not null,
  field_ar text,
  period text not null,
  gpa text,
  description text,
  description_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Certificates
create table if not exists portfolio_certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_ar text,
  issuer text not null,
  issuer_ar text,
  date text not null,
  credential_url text,
  badge_color text not null default '#6C63FF',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Testimonials
create table if not exists portfolio_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  role text not null,
  role_ar text,
  text text not null,
  text_ar text,
  rating integer not null check (rating between 1 and 5),
  image_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact messages
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_personal_info on portfolio_personal_info;
create trigger set_updated_at_personal_info
before update on portfolio_personal_info
for each row execute function set_updated_at();

drop trigger if exists set_updated_at_projects on portfolio_projects;
create trigger set_updated_at_projects
before update on portfolio_projects
for each row execute function set_updated_at();

drop trigger if exists set_updated_at_experience on portfolio_experience;
create trigger set_updated_at_experience
before update on portfolio_experience
for each row execute function set_updated_at();

drop trigger if exists set_updated_at_education on portfolio_education;
create trigger set_updated_at_education
before update on portfolio_education
for each row execute function set_updated_at();

drop trigger if exists set_updated_at_certificates on portfolio_certificates;
create trigger set_updated_at_certificates
before update on portfolio_certificates
for each row execute function set_updated_at();

drop trigger if exists set_updated_at_testimonials on portfolio_testimonials;
create trigger set_updated_at_testimonials
before update on portfolio_testimonials
for each row execute function set_updated_at();

-- RLS
alter table portfolio_admins enable row level security;
alter table portfolio_personal_info enable row level security;
alter table portfolio_projects enable row level security;
alter table portfolio_experience enable row level security;
alter table portfolio_education enable row level security;
alter table portfolio_certificates enable row level security;
alter table portfolio_testimonials enable row level security;
alter table contact_messages enable row level security;

-- Admins: allow admin to read own row
drop policy if exists "admins can read own row" on portfolio_admins;
create policy "admins can read own row"
  on portfolio_admins for select
  using (user_id = auth.uid());

-- Public read policies
drop policy if exists "public read personal info" on portfolio_personal_info;
create policy "public read personal info" on portfolio_personal_info
  for select using (true);
drop policy if exists "public read projects" on portfolio_projects;
create policy "public read projects" on portfolio_projects
  for select using (true);
drop policy if exists "public read experience" on portfolio_experience;
create policy "public read experience" on portfolio_experience
  for select using (true);
drop policy if exists "public read education" on portfolio_education;
create policy "public read education" on portfolio_education
  for select using (true);
drop policy if exists "public read certificates" on portfolio_certificates;
create policy "public read certificates" on portfolio_certificates
  for select using (true);
drop policy if exists "public read testimonials" on portfolio_testimonials;
create policy "public read testimonials" on portfolio_testimonials
  for select using (true);

-- Admin write policies
drop policy if exists "admin write personal info" on portfolio_personal_info;
create policy "admin write personal info" on portfolio_personal_info
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

drop policy if exists "admin write projects" on portfolio_projects;
create policy "admin write projects" on portfolio_projects
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

drop policy if exists "admin write experience" on portfolio_experience;
create policy "admin write experience" on portfolio_experience
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

drop policy if exists "admin write education" on portfolio_education;
create policy "admin write education" on portfolio_education
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

drop policy if exists "admin write certificates" on portfolio_certificates;
create policy "admin write certificates" on portfolio_certificates
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

drop policy if exists "admin write testimonials" on portfolio_testimonials;
create policy "admin write testimonials" on portfolio_testimonials
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

-- Contact messages: public insert, admin read/update
drop policy if exists "public create contact messages" on contact_messages;
create policy "public create contact messages" on contact_messages
  for insert with check (true);

drop policy if exists "admin manage contact messages" on contact_messages;
create policy "admin manage contact messages" on contact_messages
  for select using (exists (select 1 from portfolio_admins where user_id = auth.uid()));
drop policy if exists "admin update contact messages" on contact_messages;
create policy "admin update contact messages" on contact_messages
  for update using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));
