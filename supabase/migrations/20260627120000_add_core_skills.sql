alter table portfolio_personal_info
  add column if not exists core_skills text[] not null default '{}'::text[];

update portfolio_personal_info
set core_skills = array['React','Flutter','Next.js','TypeScript','Node.js','Python','C++','Dart','Android','Kotlin','Swift','Figma','Tailwind','Docker','MongoDB','PostgreSQL','Firebase','Git']
where core_skills = '{}'::text[];
