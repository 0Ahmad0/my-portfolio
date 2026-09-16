alter table portfolio_personal_info
  add column if not exists corner_style text not null default 'cut';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'portfolio_personal_info'::regclass
      and conname = 'portfolio_personal_info_corner_style_check'
  ) then
    alter table portfolio_personal_info
      add constraint portfolio_personal_info_corner_style_check
      check (corner_style in ('cut', 'rounded'));
  end if;
end
$$;
