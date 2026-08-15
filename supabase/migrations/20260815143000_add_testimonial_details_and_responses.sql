alter table portfolio_testimonials
  add column if not exists company text,
  add column if not exists company_ar text,
  add column if not exists country_code text not null default 'SA' check (country_code in ('SA', 'SY')),
  add column if not exists highlight text,
  add column if not exists highlight_ar text;

insert into portfolio_testimonials (
  id, name, name_ar, role, role_ar, company, company_ar, country_code,
  text, text_ar, highlight, highlight_ar, rating, image_url, sort_order, is_published
) values
(
  '10000000-0000-4000-8000-000000000001', 'Abeer Alharbi', 'عبير الحربي', 'Project Manager', 'مدير مشروع', 'Map Key', 'ماب كي', 'SA',
  'Excellent, fast, and professional work. I recommend working with him.',
  'ممتاز وسريع وشغله احترافي انصح بالعمل معه',
  'Understanding', 'متفهم', 5, '', 0, true
),
(
  '10000000-0000-4000-8000-000000000002', 'Aljoharah', 'الجوهرة', 'Software Developer', 'مطور برمجيات', null, null, 'SA',
  'Simple and clear explanations.',
  'شرح بسيط وواضح',
  '', '', 5, '', 1, true
),
(
  '10000000-0000-4000-8000-000000000003', 'Nada', 'ندى', 'Project Manager', 'مدير مشروع', null, null, 'SA',
  'Ahmad is cooperative and one of the rare people who combine excellent character with strong professional and practical skills. I met him after asking about a problem in a public group; he immediately offered help and stayed with me until it was solved. We later worked together, and the task I assigned him was completed perfectly and delivered in record time. His respectful attitude and cooperation with the team are beyond evaluation, and he is a strong, inspiring addition wherever he works.',
  'أحمد متعاون ومن الشخصيات النادره التي تجمع بين الأخلاق العالية والمهارات القوية المهنيه والعملية ، تعرفت عليه من مشكله حصلت لي وارسلت سؤال في قروب عام فتفضل وبادر بمساعدتي إلى ان حل لي هذه المشكلة ، كذلك جمعني به عمل واسندت له مهمة لينجزها فكانت في قمه الاتقان وتم تسليمها في وقت قياسي وأخلاقه مع الأعضاء وتعاونه فوق التقيم وهو أضافه قوية وملهمة لأي مكان يدخله .',
  'Ethics · Cooperation · Expertise', 'الأخلاق · التعاون · الخبرة', 5, '', 2, true
),
(
  '10000000-0000-4000-8000-000000000004', 'Yousef', 'يوسف', 'Software Developer', 'مطور برمجيات', null, null, 'SA',
  'Engineer Ahmad is a man of excellent character, and I was pleased to work with him. He performs his tasks very well, communicates effectively, solves problems, and delivers a final result that satisfies both parties. He also remains committed to deadlines despite difficulties.',
  'م. احمد رجل ذو اخلاق ومسرور بالعمل معه فاهو ممتاز في تأدية مهماته والتواصل وايضا حل المشاكل وتقديم نتيجة نهائية ترضي الطرفين. الالتزام بالمواعيد فاهو يلتزم بها رغم المصاعب.',
  'Perseverance · Good character · Humility', 'الإصرار · حسن الأخلاق · التواضع', 5, '', 3, true
),
(
  '10000000-0000-4000-8000-000000000005', 'Client', 'عميل', 'Client', 'عميل', null, null, 'SA',
  'The experience was excellent. He showed complete commitment to deadlines and delivered high-quality work. His clear and effective communication made the workflow easier, and he handled problems flexibly and professionally, leading to a final result that exceeded expectations.',
  'كانت التجربة جيدة للغاية لانه أظهر التزامًا تامًا بالمواعيد وجودة عالية في مخرجات العمل يتميز بمهارات تواصل واضحة وفعالة تُسهّل سير العمل، إلى جانب قدرته على التعامل مع المشكلات وحلّها بمرونة واحترافية، مما أدى إلى الوصول لنتيجة نهائية ممتازة تفوق التوقعات.',
  'Accuracy', 'دقة العمل', 5, '', 4, true
),
(
  '10000000-0000-4000-8000-000000000006', 'Malak Awair', 'ملاك عوير', 'Software Developer', 'مطور برمجيات', null, null, 'SY',
  'The work was excellent in quality and professionalism, with full commitment to deadlines. Our project team lead was highly cooperative and supported us throughout, making communication smooth and effective. The final result was satisfying and exceeded my expectations.',
  'كان العمل ممتازًا من حيث الجودة والاحترافية، حيث التزمنا بالمواعيد المحددة. وكان رئيس فريق مشروعنا كان متعاونًا جدًا وساعدنا في كل شيء، مما جعل التواصل سلسًا وفعالًا. النتيجة النهائية كانت مرضية وتفوقت على توقعاتي.',
  'Teamwork · Communication · Organization', 'التعاون · التواصل · التنظيم', 5, '', 5, true
),
(
  '10000000-0000-4000-8000-000000000007', 'Client', 'عميل', 'Client', 'عميل', null, null, 'SA',
  'Engineer Ahmad is very cooperative and available most of the time.',
  'مهندس أحمد شخص متعاون جدًا ومتواجد في اغلب الوقت',
  'Availability · Support · Clear explanations', 'التواجد · الدعم · وضوح الشرح', 5, '', 6, true
),
(
  '10000000-0000-4000-8000-000000000008', 'Client', 'عميل', 'Client', 'عميل', null, null, 'SA',
  'Beyond excellent, God bless. He is extremely cooperative, generous with information, answers every question, and reassures you at every stage. Thank you for never falling short.',
  'فوق التقييم لاقوة الا بالله متعاون جدا لأبعد حد معطاء في المعلومات وتجاوب على كل سؤال وتطمئن الواحد في مرحله وسؤال يعطيك العافيه الصراحه ما في كلام يوفي حقك مره شكرا انك ما قصرت معايا',
  'Fast responses · Comprehensive explanations · Clear steps', 'سرعة الإجابة · الشرح الشامل · وضوح الخطوات', 5, '', 7, true
),
(
  '10000000-0000-4000-8000-000000000009', 'Ahlam', 'أحلام', 'Project Manager', 'مدير مشروع', 'Startup Company', 'شركة ناشئة', 'SA',
  'Working with Engineer Ahmad was very professional. He is dependable by every measure, masters his work, and treats it as if it were his own. You can hand him a task and feel completely at ease.',
  'ما شاء الله تبارك الله .. التعامل مع م/أحمد جدا راقي.. وشخص فعلا يعتمد عليه بكل المقاييس... ويتقن الشغل تبعه وكان الشغل له... فالصراحة... أنه شخص يقدر الواحد يسلم له الشغل وهو مرتاح',
  'Quality', 'جودة العمل', 5, '', 8, true
),
(
  '10000000-0000-4000-8000-000000000010', 'Maimonah', 'ميمونة', 'Company Founder', 'مؤسس شركة', null, null, 'SA',
  'The work was excellent in every respect, with great attention to detail. Every note or issue was handled professionally and cooperatively to reach the best result. The final outcome was wonderful and met expectations. Thank you, Engineer Ahmad Alhariri.',
  'العمل ممتازًا من جميع النواحي، مع اهتمام بالتفاصيل، تم التعامل مع أي ملاحظات أو مشكلات باحترافية وتعاون للوصول لافضل النتائج و النتيجة النهائية كانت رائعة ولبّت التوقعات مشكور مهندس احمد الحريري',
  'Continuous cooperation · Smooth communication', 'التعاون المستمر · سلاسة التعامل', 5, '', 9, true
),
(
  '10000000-0000-4000-8000-000000000011', 'Manal', 'منال', 'Client', 'عميل', null, null, 'SA',
  'It was a wonderful experience with Engineer Ahmad. He never hesitated to help us and support us at every step. He is proficient, dedicated, and highly professional. I wish him continued success.',
  'كانت تجربه رائعه مع المهندس احمد، لم يتردد في مساعدتنا وتوفير الدعم في جميع الخطوات. متقن ومتفاني في عمله والتعامل معه احترافي للغايه، أتمنى له كل التوفيق والنجاح.',
  'Cooperation · Support', 'التعاون · الدعم', 5, '', 10, true
)
on conflict (id) do nothing;
