alter table portfolio_personal_info
  add column if not exists primary_color text not null default '#6D28D9',
  add column if not exists color_rotation_enabled boolean not null default false;

update portfolio_personal_info
set primary_color = '#6D28D9'
where primary_color is null
   or primary_color !~ '^#[0-9A-Fa-f]{6}$';

update portfolio_personal_info
set color_rotation_enabled = false
where color_rotation_enabled is null;

alter table portfolio_personal_info
  alter column primary_color set default '#6D28D9',
  alter column primary_color set not null,
  alter column color_rotation_enabled set default false,
  alter column color_rotation_enabled set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'portfolio_personal_info'::regclass
      and conname = 'portfolio_personal_info_primary_color_hex'
  ) then
    alter table portfolio_personal_info
      add constraint portfolio_personal_info_primary_color_hex
      check (primary_color ~ '^#[0-9A-Fa-f]{6}$');
  end if;
end
$$;
