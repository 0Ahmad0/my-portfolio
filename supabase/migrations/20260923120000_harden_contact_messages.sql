-- ============================================================================
-- Harden contact_messages: payload validation + per-IP rate limiting at the DB
-- ============================================================================
-- The production contact path inserts directly from the browser using the
-- publishable (anon) key, so the client-side Zod validation is trivially
-- bypassable. Every protection therefore lives here, where the live path cannot
-- avoid it. The api-server (service role) bypasses RLS and is hardened
-- separately in code.
-- ============================================================================

alter table contact_messages
  add column if not exists ip_hash text;

-- Stamp ip_hash and enforce the per-IP rate limit.
--
-- The rate limit lives in a trigger, not in the RLS WITH CHECK: PostgreSQL
-- policy expressions can reference NEW only at the top level, never inside a
-- subquery ("missing FROM-clause entry for table new"). A trigger can both
-- read NEW and query the table freely.
--
-- pgcrypto (digest) is enabled in the base schema. The salt only prevents
-- casual reversal of the hash; it is not a secret.
create or replace function set_contact_ip_hash()
returns trigger language plpgsql as $$
declare
  headers json;
  ip text;
  recent integer;
begin
  if new.ip_hash is null then
    headers := nullif(current_setting('request.headers', true), '')::json;
    ip := coalesce(headers->>'x-forwarded-for', headers->>'x-real-ip', 'unknown');
    new.ip_hash := encode(digest(ip || ':' || 'my-portfolio-contact-v1', 'sha256'), 'hex');
  end if;

  select count(*) into recent
  from contact_messages cm
  where cm.ip_hash = new.ip_hash
    and cm.created_at > now() - interval '1 hour';

  -- Max 5 messages per IP per hour. Bump here if legitimate shared-IP traffic
  -- (offices/NAT) ever gets blocked.
  if recent >= 5 then
    raise exception 'Too many messages from this address, please try again later';
  end if;

  return new;
end;
$$;

drop trigger if exists set_contact_ip_hash on contact_messages;
create trigger set_contact_ip_hash
before insert on contact_messages
for each row execute function set_contact_ip_hash();

-- Payload bounds. Top-level NEW references are fine in a policy; only
-- subqueries cannot see NEW, so the bounds stay here and the rate limit
-- moved to the trigger above.
drop policy if exists "public create contact messages" on contact_messages;

create policy "public create contact messages" on contact_messages
  for insert with check (
    -- Bound the payload: oversized/garbage bodies are the cheapest flood vector.
    char_length(name) between 1 and 120
    and char_length(email) between 3 and 255
    and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(message) between 1 and 5000
  );