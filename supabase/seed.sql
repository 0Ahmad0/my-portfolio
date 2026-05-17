insert into portfolio_personal_info (
  is_primary,
  name,
  name_ar,
  bio,
  bio_ar,
  email,
  location,
  location_ar,
  github,
  linkedin,
  twitter,
  telegram,
  whatsapp,
  instagram,
  facebook,
  cv_url,
  avatar_url,
  floating_skills
) values (
  true,
  'Ahmad Alhariri',
  'أحمد الحريري',
  'Motivated Software Engineer with over four years of experience in mobile application development using Flutter. Skilled in designing, building, and optimizing cross-platform applications.',
  'مهندس برمجيات طموح لديه أكثر من أربع سنوات من الخبرة في تطوير تطبيقات الموبايل باستخدام Flutter. ماهر في تصميم وبناء وتحسين التطبيقات.',
  'mr.ahmed.alhariri@gmail.com',
  'Syria - Daraa',
  'سوريا - درعا',
  'https://github.com/0Ahmad0',
  'https://www.linkedin.com/in/ahmadhariri',
  'https://x.com/AhmadAl45892861',
  'https://t.me/Ahmad_Alhariri',
  'https://wa.me/+963954872922',
  'https://www.instagram.com/dev.ahm',
  'https://www.facebook.com/ahmad.alhariri.56027',
  '#',
  '/avatar.jpg',
  array['Flutter','Dart','C++','Firebase','Git']
);

insert into portfolio_projects (
  title,
  title_ar,
  description,
  description_ar,
  category,
  tags,
  image_url,
  images,
  sort_order
) values
(
  'Tigre',
  'تيغري',
  'Ultimate destination for food enthusiasts and restaurant discovery.',
  'الوجهة النهائية لعشاق الطعام واكتشاف المطاعم.',
  'Mobile',
  array['Flutter','Dart','Firebase'],
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60',
  array['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60'],
  1
),
(
  'Vivafone',
  'فيفافون',
  'An app for selling eSIM cards with a seamless user experience.',
  'تطبيق لبيع بطاقات eSIM مع تجربة مستخدم سلسة.',
  'Mobile',
  array['Flutter','Dart','REST API'],
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
  array['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60'],
  2
),
(
  'Enjaz',
  'إنجاز',
  'Tracking and managing university projects with supervisor support.',
  'تتبع وإدارة المشاريع الجامعية مع دعم المشرفين.',
  'Mobile',
  array['Flutter','Dart','Firebase'],
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60',
  array['https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'],
  3
),
(
  'Mardod App',
  'تطبيق مردود',
  'AI-powered app exploring Saudi Arabia through chat.',
  'تطبيق مدعوم بالذكاء الاصطناعي لاستكشاف السعودية عبر الدردشة.',
  'Mobile',
  array['Flutter','Dart','AI'],
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60',
  array['https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60'],
  4
);

insert into portfolio_experience (
  company,
  role,
  role_ar,
  period,
  description,
  description_ar,
  sort_order
) values
(
  'York British Academy',
  'Mobile Developer',
  'مطور موبايل',
  '2023 - Present',
  'Developed government-level mobile applications using Flutter.',
  'تطوير تطبيقات موبايل على مستوى حكومي باستخدام Flutter.',
  1
),
(
  'Future X',
  'Mobile Developer',
  'مطور موبايل',
  '2023 - Present',
  'Built food delivery and social media management applications.',
  'بناء تطبيقات توصيل طعام وإدارة وسائل التواصل الاجتماعي.',
  2
),
(
  'Smart Life',
  'Mobile Developer',
  'مطور موبايل',
  '2023',
  'Restructured and optimized CRM applications.',
  'إعادة هيكلة وتحسين تطبيقات إدارة علاقات العملاء (CRM).',
  3
);

insert into portfolio_education (
  institution,
  institution_ar,
  degree,
  degree_ar,
  field,
  field_ar,
  period,
  gpa,
  description,
  description_ar,
  sort_order
) values (
  'Damascus University',
  'جامعة دمشق',
  'Bachelor''s of Software Engineering',
  'بكالوريوس في هندسة البرمجيات',
  'Software Engineering',
  'هندسة البرمجيات',
  '2018 - 2023',
  'Good',
  'Studied software engineering fundamentals, system analysis, algorithms, and mobile application development.',
  'دراسة أساسيات هندسة البرمجيات وتحليل الأنظمة والخوارزميات وتطوير تطبيقات الموبايل.',
  1
);

insert into portfolio_certificates (
  title,
  title_ar,
  issuer,
  issuer_ar,
  date,
  credential_url,
  badge_color,
  sort_order
) values
(
  'Agile Project Management',
  'إدارة المشاريع Agile',
  'HP LIFE',
  'HP LIFE',
  '2023',
  '#',
  '#0096D6',
  1
),
(
  'Fundamentals of Technical Project Management',
  'أساسيات إدارة المشاريع التقنية',
  'PMI',
  'PMI',
  '2023',
  '#',
  '#E4002B',
  2
),
(
  'Volunteer Certificate',
  'شهادة تطوع',
  'RBCs Team',
  'فريق RBCs',
  '2023',
  '#',
  '#00897B',
  3
);
