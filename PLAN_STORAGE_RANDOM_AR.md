# خطة التعديلات — رفع الصور + الترتيب العشوائي

> ملف توضيحي كامل قبل البدء بالتنفيذ. اقرأه وأخبرني بالموافقة أو أي تعديل.

---

## أولاً: الوضع الحالي للمستودع

| العنصر | الحالة |
|---|---|
| التقنية | Vite + React 19 + TypeScript + Tailwind v4 (SPA) |
| قاعدة البيانات | **Supabase مفعّل ومربوط فعلياً** (البيانات تُقرأ منه مباشرة) |
| الأقسام | مشاريع، خبرات، تعليم، شهادات، آراء — كلها جداول في Supabase |
| لوحة التحكم | موجودة كاملة على `/dashboard` (دخول بـ Supabase Auth) |
| **رفع الصور** | **غير موجود إطلاقاً** — كل الصور روابط خارجية (Unsplash وغيره) |
| ضغط الصور | سكربت بناء (`optimize-images.mjs`) يحمّل الروابط ويحوّلها لـ WebP محلي |
| الترتيب | ثابت حسب `sort_order` + سحب وإفلات من الأدمن |

### أهم الملفات
- `artifacts/portfolio/src/contexts/portfolio-data.ts` — الأنواع والتحويلات (map/payload)
- `artifacts/portfolio/src/contexts/PortfolioContext.tsx` — جلب/حفظ البيانات
- `artifacts/portfolio/src/pages/dashboard/DashboardEditors.tsx` — نماذج الإضافة/التعديل
- `artifacts/portfolio/src/pages/dashboard/DashboardSections.tsx` — قوائم الأقسام + الترتيب
- `artifacts/portfolio/src/pages/dashboard/PersonalInfoEditor.tsx` — تعديل الصورة الشخصية
- `artifacts/portfolio/src/lib/i18n.ts` — النصوص العربية/الإنجليزية
- `supabase/migrations/` — ملفات تعديل قاعدة البيانات

---

## ثانياً: التعديل المطلوب الأول — رفع الصور إلى Supabase Storage

### الفكرة
بدل الروابط الخارجية، خيارين داخل لوحة التحكم لكل صورة:

1. **رفع من الجهاز** → يُضغط تلقائياً ثم يُرفع إلى Storage في Supabase → يرجع الرابط الدائم ويُحفظ في الجدول.
2. **رابط خارجي (الوضع الحالي)** → يبقى كما هو بدون أي تغيير.

> أي عندك تبويبان/زران: «رفع صور» و«لصق رابط» — الاثنان يعملان معاً.

### ضغط الصور: أعلى دقة بأقل حجم
المعالجة تتم **في المتصفح قبل الرفع** (بدون مكتبات جديدة، بـ Canvas):

| الإعداد | القيمة | السبب |
|---|---|---|
| الصيغة | **WebP** | أصغر من JPEG بـ 25-35% بنفس الجودة |
| أقصى عرض | **1600px** | دقة عالية للشاشات الحديثة (Retina) |
| جودة | **80%** | لا فرق بصري ملحوظ، حجم صغير جداً |
| النتيجة المتوقعة | صورة 4MB → **~150-300KB** | توفير كبير في المساحة |
| الحد الأقصى للملف | 10MB قبل المعالجة | حماية |

*ملاحظة: لو أردت دقة أعلى للصور الطويلة (سكرينشوت تطبيق) نرفع العرض إلى 1920px — قلّ لي.*

### أماكن الصور التي سيدعم الرفع
1. صور المشروع (غلاف + صور متعددة) — `ProjectDialog`
2. صورة الرأي/التعليق — `TestimonialDialog`
3. الصورة الشخصية (أفاتار) — `PersonalInfoEditor`

### البنية الجديدة
```
storage bucket: portfolio-images   (عام للقراءة، الكتابة للأدمن فقط)
   └── projects/{timestamp}-{random}.webp
   └── testimonials/{timestamp}-{random}.webp
   └── avatars/{timestamp}-{random}.webp
```

---

## ثالثاً: التعديل المطلوب الثاني — الترتيب العشوائي + التثبيت

### الفكرة
- كل زيارة للموقع **ترتيب مختلف** لـ: المشاريع، الخبرات، الشهادات، الآراء، (وأيضاً التعليم).
- **مفتاح تفعيل/تعطيل من الأدمن** (صفحة داخل لوحة التحكم).
- **تثبيت عناصر** (Pin) تظهر **دائماً أول شيء**، والباقي يُخلط عشوائياً.
- التثبيت يدعم أكثر من عنصر (مثلاً 3 مشاريع مثبتة تظهر أولاً بترتيبها المثبت، والباقي خلط).

### سلوك الترتيب

```
┌─ المفتاح مطفأ ─┐        ┌─ المفتاح مفعّل ─┐
│ الترتيب المحفوظ │        │ العناصر المثبتة أولاً │
│ (كما هو الآن)   │        │ ثم باقي العناصر      │
│                 │        │ مخلوطة عشوائياً      │
│                 │        │ (كل تحميل صفحة =     │
│                 │        │  ترتيب جديد)         │
└─────────────────┘        └──────────────────────┘
```

- **من الأدمن**: تبقى القوائم مرتبة بالسحب والإفلات كالعادة (الترتيب المحفوظ هو الأساس عند إطفاء العشوائي).
- المفتاح يُحفظ في جدول جديد `portfolio_settings`.

---

## رابعاً: التعديلات اللازمة على Supabase ⚠️

### ⚠️ هذه هي الأهم — يجب تنفيذها مرة واحدة في SQL Editor داخل Supabase

```sql
-- 1) عمود تثبيت المشاريع (والشهادات/الآراء/الخبرات/التعليم للتعميم)
alter table portfolio_projects   add column if not exists is_pinned boolean not null default false;
alter table portfolio_experience add column if not exists is_pinned boolean not null default false;
alter table portfolio_education  add column if not exists is_pinned boolean not null default false;
alter table portfolio_certificates add column if not exists is_pinned boolean not null default false;
alter table portfolio_testimonials add column if not exists is_pinned boolean not null default false;

-- 2) جدول الإعدادات العامة (مفتاح الترتيب العشوائي)
create table if not exists portfolio_settings (
  id                    integer primary key default 1 check (id = 1),
  random_order_enabled  boolean not null default true,
  updated_at            timestamptz not null default now()
);
insert into portfolio_settings (id) values (1) on conflict (id) do nothing;

-- 3) RLS: القراءة للجميع، الكتابة للأدمن فقط
alter table portfolio_settings enable row level security;
drop policy if exists "public read settings" on portfolio_settings;
drop policy if exists "admins write settings" on portfolio_settings;
create policy "public read settings" on portfolio_settings
  for select using (true);
create policy "admins write settings" on portfolio_settings
  for all using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

-- 4) إنشاء البакيت الخاص بالصور (عام للقراءة)
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- 5) سياسات التخزين: أي شخص يقرأ، والأدمن فقط يرفع/يحذف
drop policy if exists "public read portfolio images" on storage.objects;
create policy "public read portfolio images" on storage.objects
  for select using (bucket_id = 'portfolio-images');

drop policy if exists "admins upload portfolio images" on storage.objects;
create policy "admins upload portfolio images" on storage.objects
  for insert with check (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );

drop policy if exists "admins update portfolio images" on storage.objects;
create policy "admins update portfolio images" on storage.objects
  for update using (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );

drop policy if exists "admins delete portfolio images" on storage.objects;
create policy "admins delete portfolio images" on storage.objects
  for delete using (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );
```

### ملخص التعديلات على Supabase

| # | التعديل | الغرض |
|---|---|---|
| 1 | 5 أعمدة `is_pinned` جديدة | تثبيت العناصر في الأقسام |
| 2 | جدول `portfolio_settings` + RLS | مفتاح الترتيب العشوائي |
| 3 | Storage bucket `portfolio-images` | تخزين الصور المرفوعة |
| 4 | 4 سياسات على `storage.objects` | قراءة عامة + رفع للأدمن فقط |

> **ملحوظة:** لا حاجة لتعديل CSP في `vercel.json` — نطاق Supabase موجود فيه مسبقاً.
> **ملحوظة 2:** الباقية من التعديلات كلها في كود الواجهة، وملف الـ migration
> سيُنشأ في `supabase/migrations/` لتاريخ الإدارة، لكن **يجب لصق الكود أعلاه يدوياً في
> Supabase SQL Editor وتشغيله** لأننا لا نملك صلاحية الوصول المباشر لمشروعك.

---

## خامساً: قائمة ملفات الواجهة التي ستُعدّل

| الملف | التعديل |
|---|---|
| `src/utils/image-upload.ts` **(جديد)** | ضغط الصور (Canvas → WebP 1600px جودة 80) + رفعها إلى Supabase Storage |
| `src/pages/dashboard/DashboardEditors.tsx` | إضافة واجهة رفع الصور في نموذج المشروع والرأي (خياران: رفع / رابط) + حقل التثبيت |
| `src/pages/dashboard/PersonalInfoEditor.tsx` | زر رفع للأفاتار بجانب حقل الرابط |
| `src/pages/dashboard/DashboardSections.tsx` | زر تثبيت (📌) لكل عنصر + مفتاح الترتيب العشوائي في تبويب المشاريع |
| `src/contexts/portfolio-data.ts` | إضافة `isPinned` للأنواع + تحويلاتها + جلب `portfolio_settings` |
| `src/contexts/PortfolioContext.tsx` | جلب الإعدادات + خلط عشوائي (pinned أولاً ثم shuffle) + حفظ التثبيت والمفتاح |
| `src/pages/Dashboard.tsx` | ربط مفتاح الإعدادات الجديد |
| `src/lib/i18n.ts` | نصوص عربية/إنجليزية جديدة (رفع صور، تثبيت، الترتيب العشوائي…) |
| `supabase/migrations/2026xxxx_random_order_and_storage.sql` **(جديد)** | نسخة SQL من التعديلات أعلاه |

---

## سادساً: خطوات التنفيذ

1. ✅ إنشاء ملف الـ migration في `supabase/migrations/`
2. ✅ كود ضغط ورفع الصور + الواجهة (خياران: رفع/رابط)
3. ✅ التثبيت (Pin) للأقسام من لوحة التحكم
4. ✅ الترتيب العشوائي + مفتاح التفعيل/التعطيل
5. ✅ النصوص العربية والإنجليزية
6. ✅ `pnpm typecheck` والتأكد من سلامة البناء
7. **⚠️ أنت:** لصق كود SQL في Supabase SQL Editor وتشغيله (القسم الرابع)

---

## سابعاً: أسئلة تحتاج قرارك

1. **دقة الصور:** هل 1600px جودة 80% مقبولة؟ أم تحتاج 1920px (للسكرينشوت الطويلة)؟
2. **التثبيت:** هل التثبيت للمشاريع فقط، أم لكل الأقسام كما هو مقترح أعلاه؟
3. **الترتيب العشوائي:** هل يُفعّل افتراضياً (default = true) أم مطفأ افتراضياً؟

---

*بعد موافقتك أبدأ التنفيذ مباشرة.*
