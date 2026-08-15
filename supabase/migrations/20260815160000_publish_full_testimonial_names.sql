update portfolio_testimonials as testimonial
set name = names.name,
    name_ar = names.name_ar
from (values
  ('10000000-0000-4000-8000-000000000001'::uuid, 'Abeer Alharbi', 'عبير الحربي'),
  ('10000000-0000-4000-8000-000000000002'::uuid, 'Aljoharah Mohammed', 'الجوهره محمد'),
  ('10000000-0000-4000-8000-000000000003'::uuid, 'Nada Alshamrani', 'ندى الشمراني'),
  ('10000000-0000-4000-8000-000000000004'::uuid, 'Yousef Salman', 'يوسف سلمكان التليدي'),
  ('10000000-0000-4000-8000-000000000005'::uuid, 'Bader', 'بدر آل دويس'),
  ('10000000-0000-4000-8000-000000000006'::uuid, 'Malak', 'عوير'),
  ('10000000-0000-4000-8000-000000000007'::uuid, 'Nada Alharbi', 'ندى الحربي'),
  ('10000000-0000-4000-8000-000000000008'::uuid, 'Al-Danah', 'الدانه'),
  ('10000000-0000-4000-8000-000000000009'::uuid, 'Ahlam Ghanem Saleh Zayed', 'احلام غانم صالح زايد'),
  ('10000000-0000-4000-8000-000000000010'::uuid, 'Maimonah', 'ميمونة'),
  ('10000000-0000-4000-8000-000000000011'::uuid, 'Manal', 'منال')
) as names(id, name, name_ar)
where testimonial.id = names.id;

update portfolio_testimonials
set role = 'Company Founder',
    role_ar = 'مؤسس شركة',
    company = 'Wadi Makkah Company',
    company_ar = 'شركة وادي مكة'
where id = '10000000-0000-4000-8000-000000000008';
