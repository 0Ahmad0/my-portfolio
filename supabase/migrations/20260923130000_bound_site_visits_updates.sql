-- ============================================================================
-- site_visits: bound the public UPDATE policy
-- ============================================================================
-- The old policy was `for update using (true) with check (true)`, so anyone
-- could rewrite any visitor row: arbitrary visit_count values, or junk
-- browser_info on someone else's row.
--
-- Integrity is enforced with a trigger rather than an RLS WITH CHECK: RLS
-- policies can only see the new row in WITH CHECK, so "visit_count must equal
-- old.visit_count + 1" is not expressible there. A trigger sees both OLD and
-- NEW. The permissive policy still grants the anon role permission to update
-- (the counter needs it); the trigger constrains the shape of the change.
-- ============================================================================

drop policy if exists "public update site_visits" on site_visits;

create policy "public update site_visits" on site_visits
  for update using (true)
  with check (true);

create or replace function guard_site_visit_update()
returns trigger language plpgsql as $$
begin
  -- Counter may only advance by one: no inflation to huge values, no resets.
  if new.visit_count is distinct from old.visit_count + 1 then
    raise exception 'visit_count may only advance by 1';
  end if;
  -- Identity must stay fixed; the client targets its own generated hash.
  if new.visitor_hash is distinct from old.visitor_hash then
    raise exception 'visitor_hash may not change';
  end if;
  -- browser_info is informational; match the client's 200-char cap.
  if char_length(coalesce(new.browser_info, '')) > 200 then
    raise exception 'browser_info exceeds 200 characters';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_site_visit_update on site_visits;
create trigger guard_site_visit_update
before update on site_visits
for each row execute function guard_site_visit_update();