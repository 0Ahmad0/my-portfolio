alter table portfolio_projects
add column if not exists android_url text,
add column if not exists ios_url text;
