# تطبيق تعديل الدولة على Supabase

**الملف المقابل:** `supabase/migrations/20260816120000_allow_any_testimonial_country.sql`

## ليش

عمود `country_code` بجدول `portfolio_testimonials` كان عليه قيد:

```sql
check (country_code in ('SA', 'SY'))
```

الداشبورد صار يسمح باختيار أي دولة (قائمة بحث فيها ١٩٥ دولة) أو كتابة دولة يدوياً. بدون حذف القيد، أي دولة غير السعودية وسوريا **بترفضها الداتابيس** ورح تطلع رسالة خطأ عند الحفظ.

## الخطوات

### ١) احذف القيد

من لوحة Supabase → **SQL Editor** → الصق وشغّل:

```sql
do $$
declare constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'portfolio_testimonials'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%country_code%'
  loop
    execute format('alter table portfolio_testimonials drop constraint %I', constraint_name);
  end loop;
end $$;
```

القيد انكتب بدون اسم فبوستجرس ولّدله اسم تلقائي — الكود فوق بيلاقيه بالبحث ويحذفه مهما كان اسمه. آمن لو انعاد تشغيله أكتر من مرة.

**البديل:** `npx supabase db push` بيعمل نفس الإشي من الترمنال.

### ٢) تأكد إنه انحذف

```sql
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'portfolio_testimonials'::regclass and contype = 'c';
```

المطلوب: ما يرجع ولا سطر فيه `country_code`.

### ٣) جرّب من الداشبورد

أضف تقييم بدولة جديدة (مثلاً الأردن) → لازم ينحفظ. البيانات القديمة ما بتتأثر، بتضل مخزّنة `SA` / `SY`.

## شو بينحفظ بالعمود بعد التعديل

| الحالة | القيمة المخزّنة | العرض بالموقع |
|---|---|---|
| دولة من القائمة | كود ISO مثل `JO` | اسمها بلغة الزائر (`الأردن` / `Jordan`) |
| دولة مكتوبة يدوياً | النص زي ما انكتب | نفس النص بالعربي والإنجليزي |

أسماء الدول بتيجي من المتصفح عبر `Intl.DisplayNames` (ملف `artifacts/portfolio/src/lib/countries.ts`) — ما في جدول أسماء بالداتابيس.

## التراجع

```sql
alter table portfolio_testimonials
  add constraint portfolio_testimonials_country_code_check
  check (country_code in ('SA', 'SY'));
```

⚠️ بيفشل لو في صفوف بدول تانية — لازم تعدّلها أو تحذفها الأول.
