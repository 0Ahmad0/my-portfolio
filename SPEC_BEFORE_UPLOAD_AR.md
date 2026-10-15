# ملف المواصفات النهائي — قبل التنفيذ ✍️

> **قراراتك المعتمدة:**
> 1. ✅ دقة الصور: **WebP — أقصى عرض 1600px — جودة 80%**
> 2. ✅ التثبيت (Pin): **للمشاريع فقط**
> 3. ✅ الترتيب العشوائي: **مفعّل افتراضياً**
>
> **الاتفاق:** أكتب هذا الملف → تقرأه وتعدّل ما تشاء → تعتمده → أبدأ التنفيذ
> → ثم الرفع (Commit/Push) بعد موافقتك النهائية.

---

## 🎯 نظرة عامة على المنتج النهائي

### الميزة 1 — «استوديو الصور» داخل لوحة التحكم
واجهة جديدة موحدة لأي صورة في الموقع، بتصميم مميز يتكون من:

```
┌──────────────────────────────────────────────────────────┐
│  🖼️ صور المشروع — أضف بالرفع أو بالرابط                  │
│ ┌─────────────┬──────────────────────────────────────┐   │
│ │  [ رفع من   │  الحالة: جاهز — WebP · 1600px · 80%  │   │
│ │   الجهاز ]  │  (تظهر بعد الرفع: 4.2MB → 187KB ✅)  │   │
│ ├─────────────┼──────────────────────────────────────┤   │
│ │  [ تبويب:   │  ▸ الغلاف: صورة مصغّرة + شارة Cover   │   │
│ │  الرابط  ]  │  ▸ كل صورة: [معاينة] [حذف] [نقل]      │   │
│ └─────────────┴──────────────────────────────────────┘   │
│  💡 ضغط تلقائي قبل الرفع — أعلى دقة بأقل حجم            │
└──────────────────────────────────────────────────────────┘
```

**آلية العمل:**
- **خيار أ (رفع):** اختيار ملف → ضغط فوري في المتصفح → رفع إلى Supabase Storage → الرابط الدائم يُضاف تلقائياً لقائمة الصور.
- **خيار ب (رابط):** تبويب يبقي الحقل القديم كما هو حرّاً (لا تغيير على البيانات القديمة).
- **زر حذف** لكل صورة يزيلها من القائمة (وليس من الـ Storage — للحفاظ على الروابط البديلة).
- نفس الوحدة تُستخدم في: صور المشروع · صورة الرأي · الصورة الشخصية (بنسخة مصغّرة Single).

**الحالات الخاصة:**
- صورة رُفعت سابقاً ثم حُذفت من القائمة → الرابط يبقى في السجل كـ `deletedFiles` اختياري؟ → **لا**، نبقيها بسيطة: الحذف من القائمة فقط.
- فشل الرفع (انقطاع/صلاحية) → رسالة خطأ داخل البطاقة + بقاء الرابط الحالي سليماً.
- المتصفح لا يدعم WebP → fallback تلقائي إلى JPEG جودة 82%.

### الميزة 2 — «الترتيب العشوائي الذكي»

```
الزيارة 1:  [📌 مثبت] [📌 مثبت] [D] [A] [C] [B]
الزيارة 2:  [📌 مثبت] [📌 مثبت] [B] [D] [A] [C]
الزيارة 3:  [📌 مثبت] [📌 مثبت] [C] [B] [D] [A]
                 ▲ دائماً أولاً، بترتيب ثابت      ▲ يُخلط كل تحميل
```

- ينطبق على: **المشاريع، الخبرات، التعليم، الشهادات، الآراء** (كل الأقسام).
- **التثبيت للمشاريع فقط** — زر 📌 يظهر بجانب كل مشروع (بيان لونه: ذهبي).
- **المفتاح:** مفتاح Switch واحد في تبويب «المشاريع» أعلى القائمة:
  > «الترتيب العشوائي عند كل زيارة — مفعّل 🔀»
- **منطق الخلط:** Fisher-Yates Shuffle بسيط في المتصفح بعد جلب البيانات
  (يُعاد الخلط عند كل تحميل/تنقّل للصفحة الرئيسية — لا يُحفظ، دائماً جديد).
- **عند الإطفاء:** يعود الترتيب المحفوظ حسب `sort_order` (نفس السلوك الحالي 100%).
- **الأدمن دائماً يرى الترتيب المحفوظ** في لوحته (الخلط يخص الموقع العام فقط).

---

## 📦 التعديلات على Supabase (مرة واحدة في SQL Editor)

```sql
-- ═══ 1) تثبيت المشاريع (المشاريع فقط حسب قرارك) ═══
alter table portfolio_projects
  add column if not exists is_pinned boolean not null default false;

-- ═══ 2) جدول الإعدادات العامة ═══
create table if not exists portfolio_settings (
  id                   integer primary key default 1 check (id = 1),
  random_order_enabled boolean not null default true,   -- مفعّل افتراضياً ✅
  updated_at           timestamptz not null default now()
);
insert into portfolio_settings (id, random_order_enabled)
values (1, true)
on conflict (id) do nothing;

-- ═══ 3) RLS على الإعدادات ═══
alter table portfolio_settings enable row level security;

drop policy if exists "public read settings" on portfolio_settings;
create policy "public read settings"
  on portfolio_settings for select using (true);

drop policy if exists "admins write settings" on portfolio_settings;
create policy "admins write settings"
  on portfolio_settings for all
  using (exists (select 1 from portfolio_admins where user_id = auth.uid()))
  with check (exists (select 1 from portfolio_admins where user_id = auth.uid()));

-- ═══ 4) باكيت الصور (قراءة عامة) ═══
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- ═══ 5) سياسات الرفع/القراءة/الحذف ═══
drop policy if exists "public read portfolio images" on storage.objects;
create policy "public read portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "admins upload portfolio images" on storage.objects;
create policy "admins upload portfolio images"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );

drop policy if exists "admins update portfolio images" on storage.objects;
create policy "admins update portfolio images"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );

drop policy if exists "admins delete portfolio images" on storage.objects;
create policy "admins delete portfolio images"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-images'
    and exists (select 1 from portfolio_admins where user_id = auth.uid())
  );
```

| # | التعديل | سببه |
|---|---|---|
| 1 | عمود `portfolio_projects.is_pinned` | تثبيت مشاريع أعلى القائمة |
| 2 | جدول `portfolio_settings` (صف واحد) | مفتاح الترتيب العشوائي (مفعّل افتراضياً) |
| 3 | RLS: قراءة للجميع / كتابة للأدمن | أمان الإعدادات |
| 4 | Bucket `portfolio-images` عام | تخزين الصور بروابط دائمة |
| 5 | 4 سياسات `storage.objects` | قراءة عامة + رفع/تعديل/حذف للأدمن فقط |

> 📌 يُنشأ أيضاً نسخة `supabase/migrations/20261015120000_random_order_and_image_storage.sql`
> لتوثيق تاريخي — لكن **التنفيذ الفعلي يكون بلصق الكود أعلاه في SQL Editor يدوياً**.

---

## 🗂️ التعديلات على الكود (ملف بملف)

### 1) `src/utils/image-upload.ts` — **جديد**
وحدة معالجة الصور المستقلة:

```ts
// المخرجات: Blob مضغوط جاهز للرفع
export async function compressImage(file: File): Promise<Blob>
//   - يقرأ عبر createImageBitmap / Image
//   - يُعيد التحجيم: أقصى عرض 1600px (بدون تكبير لو أصغر)
//   - يصدّر WebP بجودة 0.8 (fallback: image/jpeg بجودة 0.82 إن رفض المتصفح)
//   - يحافظ على اتجاه EXIF (orientation) عبر createsImageBitmap: 'from-image'

export async function uploadImage(file: File, folder: "projects" | "testimonials" | "avatars"): Promise<string>
//   - compressImage(file)
//   - رفع إلى: portfolio-images/{folder}/{Date.now()}-{rand(6)}.webp
//   - يرجع: supabase.storage.from("portfolio-images").getPublicUrl(path).data.publicUrl
//   - يرمي خطأ عربي/إنجليزي واضح عند الفشل

export async function uploadImageBlob(blob: Blob, folder): Promise<string>  // للنسخ المصغّر
```

### 2) `src/components/dashboard/ImageManager.tsx` — **جديد** ⭐ (قلب الميزة)
مكون قابل لإعادة الاستخدام:

```tsx
<ImageManager
  images={string[]}              // قائمة الروابط الحالية
  onChange={(imgs) => ...}       // عند الإضافة/الحذف/الترتيب
  mode="multiple" | "single"     // مشروع = multiple / أفاتار ورأي = single
  coverLabel="الغلاف"
  uploadLabel="رفع من الجهاز"
  urlLabel="لصق رابط"
  folder="projects"
  showStats={true}               // عرض: "4.2MB → 187KB" بعد كل رفع
/>
```

**المميزات:**
- تبويبان أنيقان: `⬆ رفع` | `🔗 رابط`.
- سحب وإفلات لترتيب الصور (الصفحة الأولى = الغلاف تلقائياً + شارة).
- شريط تقدّم أثناء الرفع + معاينة فورية.
- عرض نسبة الضغط لكل صورة مرفوعة (تفخر بالنتيجة 📉).
- معالجة أخطاء داخلية مع Toast واضح.

### 3) `src/pages/dashboard/DashboardEditors.tsx`
- **ProjectDialog:** استبدال حقل الروابط النصي بـ `<ImageManager mode="multiple">`
  (يحتفظ بنفس النص الخلفي: `images[]` و `imageUrl = images[0]`).
- **TestimonialDialog:** استبدال حقل `imageUrl` بـ `<ImageManager mode="single">`.
- إضافة شارة/تنبيه داخل المشروع عند تثبيته؟ → لا، التثبيت من القائمة فقط.

### 4) `src/pages/dashboard/PersonalInfoEditor.tsx`
- استبدال حقل `avatarUrl` بنسخة `mode="single" folder="avatars"` + معاينة دائرية.

### 5) `src/pages/dashboard/DashboardSections.tsx`
- **ProjectsSection:**
  - مفتاح Switch جديد أعلى القائمة:
    `الترتيب العشوائي عند كل زيارة` + وصف صغير «يخلط باقي المشاريع المنشورة — المثبتة تبقى أولاً».
  - زر 📌 `Pin` لكل مشروع داخل بطاقته (Icon: `Pin` من lucide، لون ذهبي `text-amber-500` عند التفعيل).
  - التثبيت يُحفظ فوراً: `updateProject(id, { isPinned: !isPinned })`.
  - تعطيل السحب/الإفلات عند التثبيت؟ → نبقي السحب طبيعياً (الترتيب المحفوظ للأدمن).
- **بقية الأقسام:** بدون تغيير (الخلط يطبق تلقائياً من السياق).

### 6) `src/contexts/portfolio-data.ts`
```ts
// Project type + إضافة:
isPinned?: boolean;

// mapProject  + projectPayload:
is_pinned: row.is_pinned ?? false   /   is_pinned: project.isPinned

// نوع جديد:
export type SiteSettings = { randomOrderEnabled: boolean };
```

### 7) `src/contexts/PortfolioContext.tsx`
```ts
// جلب جديد أثناء التحميل:
load(
  supabase.from("portfolio_settings").select("*").eq("id", 1).limit(1)
           .abortSignal(controller.signal),
  (rows) => setRandomOrderEnabled(rows[0]?.random_order_enabled ?? true),
)

// دالة مزدوجة للعرض العام:
const shuffle = <T>(arr: T[]): T[] => { /* Fisher-Yates */ };

// في الاستعلام: عند تفعيل العشوائي يُطبق الخلط بعد الجلب للنسخة العامة فقط:
// → نبقي السياق يحمل "الترتيب المحفوظ" ويُخلط عند التمرير للموقع العام
//   (عبر useMemo محسوب عند تغيير البيانات أو زر Refresh)

// واجهة جديدة:
randomOrderEnabled: boolean
setRandomOrderEnabled: (v: boolean) => Promise<void>   // UPDATE portfolio_settings

// togglePin مدمج في updateProject القائم
```

**قرار تنفيذي دقيق:** يتم الخلط في `PortfolioProvider` بعد الجلب
(مرة واحدة لكل تحميل للصفحة) مع الإبقاء على النسخة الأصلية للمعرفة
لأن لوحة التحكم نفسها تعيش في نفس الـ Context.
→ **الحل:** لوحة التحكم تطلب دائماً الترتيب الأصلي عبر حالة منفصلة
`orderedProjects` (أو نخلط فقط عند وجود علامة `isPublicView`).
*سأنفّذ بأبسط طريقة آمنة: خلط يُطبق عند تحميل الصفحة فقط إن كان المفتاح مفعّلاً،
والـ Dashboard يعيد ترتيب عناصره حسب `sort_order` المحفوظ مباشرة من الاستعلام —
بدون أي تأثير على السحب والإفلات.*

### 8) `src/pages/Dashboard.tsx`
- لا يتغير هيكله — المفاتيح تُدار داخل `ProjectsSection`.

### 9) `src/lib/i18n.ts` — نصوص جديدة (عربي + إنجليزي)
```ts
upload: {
  tabUpload: "رفع من الجهاز" / "Upload file",
  tabUrl: "لصق رابط" / "Paste URL",
  dropHint: "أو اسحب وأفلت الصور هنا",
  compressing: "جاري الضغط…" / "Compressing…",
  uploaded: "تم الرفع — {from} ← {to}" / "Uploaded — {from} ← {to}",
  cover: "الغلاف" / "Cover",
  deleteImage: "حذف الصورة",
  errorUpload: "فشل الرفع — تحقق من الاتصال أو الصلاحيات",
  hint: "ضغط تلقائي: WebP · 1600px · 80% — أعلى دقة بأقل حجم",
},
pin: {
  action: "تثبيت في الأعلى" / "Pin to top",
  unpin: "إلغاء التثبيت" / "Unpin",
  pinned: "مثبّت" / "Pinned",
},
randomOrder: {
  title: "الترتيب العشوائي عند كل زيارة",
  description: "يخلط ترتيب الظهور في الموقع العام كل تحميل — المشاريع المثبتة تبقى دائماً أولاً.",
  on: "مفعّل" / "Enabled",
  off: "مطفأ" / "Disabled",
},
```

---

## 🔐 الأمان والحدود

| البند | القرار |
|---|---|
| رفع الصور | مقيد بسياسة RLS = عضو `portfolio_admins` فقط |
| قراءة الصور | عامة (bucket public) — زائر بلا حساب يراها |
| حد حجم الملف | 10MB قبل الضغط (رفض واضح بعدها) |
| الأنواع المقبولة | jpeg / png / webp / gif (تُعالَج كصورة ثابتة) |
| CSP | لا يحتاج تعديل — نطاق Supabase موجود في `vercel.json` |
| البيانات القديمة | الروابط الخارجية القديمة تبقى تعمل كما هي (لا مиграة إجبارية) |

---

## ✅ قائمة التحقق قبل الرفع (Definition of Done)

**تم فحصه آلياً (أُنجز):**
- [x] `pnpm typecheck` داخل `artifacts/portfolio` بدون أخطاء ✅
- [x] `pnpm build:deploy` ينجح (مع `optimize-images.mjs`) ✅
- [x] `pnpm test` — 4/4 اختبارات تنجح ✅
- [x] خيار الرابط الخارجي يعمل كما كان (نفس البنية: `images[]` + `imageUrl`) ✅
- [x] نصوص عربية وإنجليزية كاملة لكل عنصر جديد ✅
- [x] سحب/إفلات الأدمن لم يتغير (الخلط يخص الموقع العام فقط — `siteProjects`) ✅

**يتطلب تشغيل SQL أولاً ثم فحصاً يدوياً في المتصفح:**
- [ ] لصق كود SQL في Supabase SQL Editor وتشغيله (القسم الثاني أعلاه)
- [ ] رفع صورة في المتصفح → رابط `portfolio-images` يظهر ويُحفظ في القاعدة
- [ ] الصورة المرفوعة تظهر في الموقع العام بعد الحفظ
- [ ] زر التثبيت 📌 يظهر في تبويب المشاريع ويحفظ فوراً
- [ ] المفتاح يُطفأ/يُفعّل → إعادة تحميل الموقع تعكس التغيير
- [ ] عند التفعيل: كل تحميل ترتيب جديد + المثبتة أولاً
- [ ] عند الإطفاء: الترتيب المحفوظ كما هو بالضبط

---

## 🚀 ترتيب التنفيذ المقترح

| مرحلة | المحتوى |
|---|---|
| 1 | ملف الـ migration + التحقق منه |
| 2 | `image-upload.ts` + `ImageManager.tsx` (قلب الميزة) |
| 3 | ربطه بـ: نموذج المشروع، نموذج الرأي، الأفاتار |
| 4 | التثبيت (Pin) + المفتاح في `ProjectsSection` |
| 5 | منطق الخلط في `PortfolioContext` + جلب `portfolio_settings` |
| 6 | النصوص i18n (عربي/إنجليزي) |
| 7 | typecheck + build + مراجعة |
| 8 | **الانتظار لموافقتك → ثم الرفع (Commit/Push)** |

---

## ❓ نقطة واحدة تحتاج تأكيدك قبل البدء

> **ملاحظة مهمة:** ملفات `.env.local` تحتوي مفاتيح Supabase الحقيقية ومُعلنة في
> المستودع مسبقاً (وضعك الحالي — publishable key فقط، وهي مصممة للعموم مع RLS).
> **سأتركها كما هي** لأن الموقع يعمل بها حالياً — فقط أنبّهك لأعرف.
> هل تود تغييرها لاحقاً أم نكمل كما هي؟

---

**⏳ بانتظار ردك: «موافق» أو أي تعديل على الملف — ثم أبدأ التنفيذ فوراً.**
