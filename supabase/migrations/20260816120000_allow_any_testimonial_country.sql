-- country_code was limited to ('SA','SY'); the dashboard can now pick or type any country.
-- Dropped by lookup, not by name: the original constraint was created unnamed, so its name is generated.
do $$
declare constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'portfolio_testimonials'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%country_code%'
  loop
    execute format('alter table portfolio_testimonials drop constraint %I', constraint_name);
  end loop;
end $$;
