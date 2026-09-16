# معرض أعمال أحمد الحريري

موقع شخصي ثنائي اللغة لعرض المشاريع والخبرات والتعليم والشهادات وآراء العملاء، مع لوحة تحكم محمية لإدارة المحتوى وإعدادات هوية الموقع.

الموقع مبني باستخدام React وTypeScript وVite، ويستخدم Supabase للمحتوى والمصادقة ورسائل التواصل.

## المميزات

- دعم كامل للغتين العربية والإنجليزية.
- اتجاه `RTL` للعربية و`LTR` للإنجليزية.
- وضع فاتح وداكن.
- تصميم متجاوب مع الهاتف والتابلت وسطح المكتب.
- قائمة هاتف جانبية تفتح من اليمين بالعربية ومن اليسار بالإنجليزية.
- رابط مباشر لآراء العملاء في الهيدر وقائمة الهاتف.
- بطاقات هندسية مستوحاة من واجهات البرمجة ومخططات الدوائر.
- لوحة تحكم تعتمد على Supabase Auth وRLS.
- إدارة المشاريع والخبرات والتعليم والشهادات وآراء العملاء.
- إدارة البيانات الشخصية وروابط التواصل والسيرة الذاتية.
- إدارة المهارات الأساسية والأيقونات المتحركة حول الصورة الشخصية.
- نموذج تواصل مع تحقق من المدخلات ورسائل نجاح وفشل واضحة.
- صور WebP متجاوبة وخطوط محلية وتحسينات للأداء والوصول.

## آخر التحديثات

### نظام ألوان ديناميكي

أصبحت هوية الموقع قابلة للتخصيص من لوحة التحكم:

- 10 ألوان جاهزة ومتناسقة.
- Color Picker لاختيار لون مخصص.
- معاينة مباشرة قبل الحفظ.
- وضع لون ثابت.
- وضع تلقائي ينتقل بين الألوان العشرة كل دقيقة.
- حساب تلقائي للون النص فوق اللون الأساسي لضمان التباين.
- توليد درجات مناسبة للوضعين الفاتح والداكن من اللون المختار.

يعتمد النظام على الحقلين التاليين في جدول `portfolio_personal_info`:

- `primary_color`
- `color_rotation_enabled`

### تحسين الوضع الفاتح

تمت إعادة تصميم درجات الوضع الفاتح لتوفير:

- خلفية هادئة تفصل المحتوى عن البطاقات.
- بطاقات بيضاء وحدود واضحة وغير ثقيلة.
- حقول إدخال أكثر وضوحًا.
- ظلال متوازنة.
- نصوص ثانوية بتباين أفضل.
- ألوان focus وaccent مرتبطة باللون الأساسي المختار.

### حركة أيقونات الصورة الشخصية

تتحرك أيقونات المهارات حول الصورة بحركة CSS خفيفة تشمل الارتفاع والانخفاض والدوران. تتوقف الحركة تلقائيًا عند تفعيل `prefers-reduced-motion` في نظام المستخدم.

### قائمة الهاتف الجانبية

- تفتح من الجهة المناسبة للغة.
- تدعم الإغلاق من زر الإغلاق، أو خارج القائمة، أو زر `Escape`، أو رابط التنقل.
- تحصر تركيز لوحة المفاتيح داخلها أثناء فتحها.
- تعيد التركيز إلى زر القائمة بعد الإغلاق.
- تغلق تلقائيًا عند الانتقال إلى عرض سطح المكتب.

## التقنيات المستخدمة

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Radix UI
- Framer Motion
- React Hook Form وZod
- Supabase Auth وPostgreSQL وRLS
- pnpm workspaces
- Vercel

## بنية المشروع

```text
my-portfolio/
├── artifacts/
│   ├── portfolio/                 تطبيق الواجهة الرئيسي
│   │   ├── public/                الصور والخطوط والملفات العامة
│   │   ├── scripts/               تحسين الصور واختبارات المشروع
│   │   └── src/
│   │       ├── components/        مكونات الواجهة
│   │       ├── contexts/          البيانات وحالة الموقع
│   │       ├── hooks/             React hooks
│   │       ├── lib/               الترجمة والأدوات ونظام الألوان
│   │       └── pages/             الموقع ولوحة التحكم
│   └── api-server/                خادم API اختياري
├── lib/                           حزم مشتركة وقاعدة بيانات الخادم
├── supabase/
│   ├── migrations/               تغييرات مخطط Supabase
│   ├── config.toml               إعداد Supabase المحلي
│   └── seed.sql                  بيانات البداية
├── README.md                     دليل المشروع
├── supabase-schema.md            مرجع مخطط قاعدة البيانات
├── pnpm-workspace.yaml           إعداد مساحة العمل
└── vercel.json                   إعداد النشر من جذر المستودع
```

## المتطلبات

- Node.js `20.19` أو أحدث.
- pnpm بالإصدار المحدد في `package.json`، حاليًا `10.33.2`.
- Git.
- مشروع Supabase.
- حساب Vercel عند النشر على Vercel.

## تثبيت المشروع

```bash
git clone https://github.com/0Ahmad0/my-portfolio.git
cd my-portfolio
corepack enable
pnpm install
```

استخدم pnpm فقط؛ يحتوي المشروع على فحص يمنع التثبيت باستخدام npm أو Yarn.

## متغيرات البيئة

أنشئ ملفًا محليًا باسم:

```text
artifacts/portfolio/.env.local
```

وأضف:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

متغير اختياري عند استخدام خادم منفصل لنموذج التواصل:

```env
VITE_API_URL=https://api.example.com
```

إذا لم يوجد `VITE_API_URL` يرسل نموذج التواصل مباشرة إلى جدول `contact_messages` في Supabase.

> لا تضع `service_role` أو أي مفتاح سري داخل متغير يبدأ بـ `VITE_`، لأن متغيرات Vite تصبح متاحة داخل المتصفح.

## إعداد Supabase

### مشروع جديد

طبّق ملفات `supabase/migrations` بالترتيب، ثم أضف بيانات البداية عند الحاجة من `supabase/seed.sql`.

عند استخدام Supabase CLI بعد ربط المشروع:

```bash
supabase db push
```

يمكن أيضًا فتح Supabase Dashboard ثم SQL Editor وتشغيل ملفات migrations بالترتيب.

### تحديث مشروع موجود لنظام الألوان

طبّق الملف التالي:

```text
supabase/migrations/20260916120000_add_theme_color_settings.sql
```

يضيف الملف:

- `primary_color` مع تحقق من صيغة اللون `#RRGGBB`.
- `color_rotation_enabled` لتفعيل التغيير التلقائي.

لن يتمكن زر الحفظ في لوحة التحكم من حفظ إعدادات اللون الجديدة قبل تطبيق هذا migration على قاعدة البيانات المنشورة.

### تحديث مشروع موجود لشكل الزوايا

من لوحة التحكم (المعلومات الشخصية ← شكل الزوايا) يمكن اختيار زوايا مقصوصة (الافتراضي) أو زوايا دائرية للبطاقات والأزرار والحقول في الموقع كله. يُحفظ الاختيار في الحقل `corner_style`، فطبّق الملف التالي قبل الحفظ:

```text
supabase/migrations/20260916150000_add_corner_style.sql
```

### إعداد مستخدم لوحة التحكم

1. أنشئ المستخدم من Supabase Dashboard ضمن Authentication.
2. انسخ `user_id` الخاص به.
3. أضفه إلى جدول `portfolio_admins`:

```sql
insert into portfolio_admins (user_id)
values ('USER_UUID_HERE')
on conflict (user_id) do nothing;
```

لا توجد كلمة مرور ثابتة داخل الكود. تسجيل الدخول يتم بواسطة Supabase Auth، وسياسات RLS تسمح بالكتابة للمستخدمين المسجلين في `portfolio_admins` فقط.

## تشغيل المشروع

### تشغيل الواجهة للتطوير

```bash
pnpm --filter @workspace/portfolio run dev
```

العنوان الافتراضي:

```text
http://localhost:5173
```

لوحة التحكم:

```text
http://localhost:5173/dashboard
```

### فحص TypeScript

```bash
pnpm run typecheck
```

### تشغيل اختبارات الواجهة الأساسية

```bash
pnpm --filter @workspace/portfolio test
```

### بناء نسخة التطوير

```bash
pnpm --filter @workspace/portfolio run build
```

### بناء نسخة النشر

```bash
pnpm run build:deploy
```

يُشغّل بناء النشر تحسين الصور أولًا، ثم يضع الناتج داخل:

```text
artifacts/portfolio/dist
```

## تحسين الصور

لتحسين الصور الجديدة وإنشاء نسخ WebP متجاوبة:

```bash
pnpm --filter @workspace/portfolio run images:optimize
```

إذا تغيرت الصورة مع بقاء الرابط نفسه:

```bash
pnpm --filter @workspace/portfolio run images:optimize --refresh
```

راجع تغييرات `src/assets/images.json` و`public/images` قبل رفعها. توجد تفاصيل إضافية في `artifacts/portfolio/PERFORMANCE.md`.

## إدارة لون الموقع

1. افتح `/dashboard` وسجّل الدخول.
2. انتقل إلى قسم المعلومات الشخصية.
3. ابحث عن قسم **هوية ألوان الموقع**.
4. اختر أحد الألوان العشرة أو استخدم Color Picker.
5. اختر بين اللون الثابت والتبديل التلقائي كل دقيقة.
6. راجع المعاينة المباشرة.
7. اضغط زر حفظ التغييرات.

في الوضع التلقائي يستخدم الموقع فترة زمنية مشتركة مدتها دقيقة واحدة، لذلك يظهر اللون نفسه لجميع الزوار خلال الفترة نفسها.

## النشر على Vercel

إعداد `vercel.json` في جذر المشروع يستخدم:

- أمر التثبيت: `corepack enable && pnpm install --no-frozen-lockfile`
- أمر البناء: `pnpm run build:deploy`
- مجلد الناتج: `artifacts/portfolio/dist`

خطوات النشر:

1. ارفع المستودع إلى GitHub.
2. أضف مشروعًا جديدًا في Vercel واربط المستودع.
3. اترك Root Directory على جذر المستودع عند استخدام `vercel.json` الحالي.
4. أضف `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY` في Environment Variables.
5. انشر المشروع.
6. اختبر الصفحة الرئيسية و`/dashboard` ونموذج التواصل بعد النشر.

## قائمة تحقق قبل الرفع إلى GitHub

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @workspace/portfolio test
pnpm run build:deploy
git diff --check
git status --short
```

تحقق يدويًا من التالي:

- تطبيق migrations الجديدة على Supabase أو تجهيزها لتُطبق قبل نشر الواجهة.
- عدم وجود `.env` أو مفاتيح أو كلمات مرور ضمن الملفات المراد رفعها.
- عدم رفع `node_modules` أو `dist` أو `tmp` أو `.pnpm-store`.
- مراجعة الوضعين الفاتح والداكن.
- تجربة العربية والإنجليزية.
- تجربة قائمة الهاتف ونموذج التواصل.
- التأكد من أن حفظ اللون يعمل بعد تطبيق migration.
- مراجعة أي صور محسنة أضافها `build:deploy`.

يوجد دليل محلي مؤقت أكثر تفصيلًا في:

```text
tmp/README_BEFORE_GITHUB_AR.md
```

هذا الملف داخل `tmp`، لذلك لن يُرفع إلى GitHub.

## الأمان

- تعتمد لوحة التحكم على Supabase Auth، وليس على كلمة مرور مكتوبة داخل الواجهة.
- تعتمد صلاحيات الكتابة على RLS وجدول `portfolio_admins`.
- يتحقق نموذج التواصل من البيانات باستخدام Zod.
- لا يجب استخدام مفتاح Supabase `service_role` في الواجهة.
- ملفات `.env` متجاهلة بواسطة Git.
- توجد رؤوس حماية أساسية ضمن `vercel.json`.

## الأداء والوصول

- صور WebP متجاوبة مع أبعاد محفوظة.
- خطوط Inter وCairo مستضافة محليًا.
- تحميل كسول للوحة التحكم ونموذج التواصل.
- دعم لوحة المفاتيح وإدارة التركيز في الحوارات وقائمة الهاتف.
- احترام `prefers-reduced-motion`.
- تخزين مؤقت طويل للصور والخطوط والملفات ذات الأسماء المشفرة على Vercel.

راجع `artifacts/portfolio/PERFORMANCE.md` لمعلومات القياس والصيانة.

## حل المشكلات

### فشل حفظ إعدادات اللون

تأكد من تطبيق:

```text
supabase/migrations/20260916120000_add_theme_color_settings.sql
```

ثم تحقق من وجود العمودين `primary_color` و`color_rotation_enabled` داخل `portfolio_personal_info`.

### عدم ظهور بيانات الموقع

- تحقق من متغيرات Supabase.
- راجع Network وConsole في المتصفح.
- تأكد من تطبيق migrations وسياسات القراءة العامة.

### تعذر تسجيل الدخول أو الحفظ

- تحقق من وجود المستخدم في Supabase Auth.
- تحقق من إضافة `user_id` إلى `portfolio_admins`.
- راجع سياسات RLS.

### فشل البناء

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build:deploy
```

إذا كانت المشكلة في صورة خارجية، راجع المضيف والرابط وقواعد تحسين الصور في `artifacts/portfolio/PERFORMANCE.md`.

## صاحب المشروع

أحمد الحريري — [GitHub @0Ahmad0](https://github.com/0Ahmad0)

## الترخيص

المشروع معرّف بترخيص MIT في ملفات الحزم. أضف ملف `LICENSE` مستقلًا إذا كنت تريد إظهار نص الترخيص كاملًا في GitHub.
