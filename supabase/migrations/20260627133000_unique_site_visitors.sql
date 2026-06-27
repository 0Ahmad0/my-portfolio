alter table site_visits
add column if not exists first_visit timestamptz not null default now(),
add column if not exists last_visit timestamptz not null default now(),
add column if not exists visit_count integer not null default 1,
add column if not exists device_type text,
add column if not exists browser_info text;

delete from site_visits a
using site_visits b
where a.visitor_hash = b.visitor_hash
  and a.id > b.id;

create unique index if not exists site_visits_visitor_hash_unique
on site_visits (visitor_hash);

drop policy if exists "public update site_visits" on site_visits;
create policy "public update site_visits" on site_visits
  for update using (true)
  with check (true);
