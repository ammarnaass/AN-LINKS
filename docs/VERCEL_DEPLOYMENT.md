# دليل رفع ونشر منصة AN LINKS على منصة Vercel 🚀

دليل شامل ومهني لرفع ونشر منصة **AN LINKS** (منصة الروابط الذكية وبطاقات NFC والتجارة الرقمية) على شبكة الحوسبة السحابية **Vercel** بأعلى كفاءة واستقرار بيئة الإنتاج.

---

## 📑 فهرس المحتويات
1. [المتطلبات المسبقة للبنية التحتية](#1-المتطلبات-المسبقة-للبنية-التحتية)
2. [قائمة المتغيرات البيئية (Environment Variables)](#2-قائمة-المتغيرات-البيئية-environment-variables)
3. [الطريقة الأولى: الرفع عبر لوحة تحكم Vercel (الموصى بها)](#3-الطريقة-الأولى-الرفع-عبر-لوحة-تحكم-vercel-الموصى-بها)
4. [الطريقة الثانية: الرفع عبر سطر الأوامر (Vercel CLI)](#4-الطريقة-الثانية-الرفع-عبر-سطر-الأوامر-vercel-cli)
5. [تهيئة قاعدة البيانات السحابية وبذر البيانات الأولي](#5-تهيئة-قاعدة-البيانات-السحابية-وبذر-البيانات-الأولي)
6. [إعداد النطاق المخصص والنطاقات الفرعية الشاملة (Wildcard DNS)](#6-إعداد-النطاق-المخصص-والنطاقات-الفرعية-الشاملة-wildcard-dns)
7. [معالجة المشاكل الشائعة وحلولها (Troubleshooting)](#7-معالجة-المشاكل-الشائعة-وحلولها-troubleshooting)

---

## 1. المتطلبات المسبقة للبنية التحتية

قبل البدء بالرفع، تأكد من توفر الخدمات السحابية التالية:

| الخدمة | الغرض | المزودون الموصى بهم |
|---|---|---|
| **مستودع الكود (Git Repo)** | تخزين الكود والتحديث التلقائي مع كل `git push` | GitHub / GitLab / Bitbucket |
| **قاعدة بيانات PostgreSQL** | تخزين المستخدمين، الروابط، بوابات الدفع، والمشتركين | [Neon Serverless Postgres](https://neon.tech) أو [Supabase](https://supabase.com) |
| **تخزين الملفات السحابي** | حفظ الصور الرمزية والأغلفة (نظام ملفات Vercel مؤقت) | [Cloudflare R2](https://www.cloudflare.com/products/r2/) أو AWS S3 |
| **بوابة البريد الإلكتروني** | إرسال النشرات البريدية واستعادة كلمة المرور | [Resend](https://resend.com) |

> [!IMPORTANT]
> بما أن دوال Vercel Serverless Functions تعمل بنظام ملفات قراءة فقط (`Read-Only Ephemeral FileSystem`)، فإن رفع الصور يعتمد على إعداد متغيرات تخزين S3 أو Cloudflare R2 (المدمجة مسبقاً في `src/lib/storage.ts` عبر SigV4 دون الحاجة لمكتبات إضافية).

---

## 2. قائمة المتغيرات البيئية (Environment Variables)

قم بنسخ هذه المتغيرات وتعبئة قيم الإنتاج داخل لوحة Vercel (**Settings > Environment Variables**):

```env
# -------------------------------------------------------------
# 1. قاعدة البيانات (PostgreSQL Connection Pooling)
# -------------------------------------------------------------
# إذا كنت تستخدم Neon أو Supabase، استخدم الرابط المجمّع (Pooled - Port 6543)
DATABASE_URL="postgresql://user:password@pooler-host:6543/an_links?sslmode=require&pgbouncer=true"

# الرابط المباشر لتشغيل Migrations بدون وسيط التجميع (اختياري مع Supabase)
DIRECT_URL="postgresql://user:password@direct-host:5432/an_links?sslmode=require"

# -------------------------------------------------------------
# 2. أمان الجلسات والمصادقة (NextAuth.js)
# -------------------------------------------------------------
# رابط النطاق الأساسي لموقعك المنشور على Vercel
NEXTAUTH_URL="https://anlinks.dev"

# مفتاح التشفير لجلسات JWT (قم بتوليده عبر: openssl rand -base64 32)
NEXTAUTH_SECRET="your-production-high-entropy-nextauth-secret-here"

# -------------------------------------------------------------
# 3. تشفير بوابات الدفع (AES-256-GCM)
# -------------------------------------------------------------
# مفتاح تشفير بيانات اعتماد البوابات (سلسلة 64 حرف Hex: openssl rand -hex 32)
PAYMENT_ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# -------------------------------------------------------------
# 4. خدمة البريد الإلكتروني والنشرة البريدية (Resend API)
# -------------------------------------------------------------
RESEND_API_KEY="re_123456789_abcdefghijklmnopqrstuvwxyz"
EMAIL_FROM="AN LINKS <noreply@anlinks.dev>"

# -------------------------------------------------------------
# 5. التخزين السحابي للصور (Cloudflare R2 أو AWS S3)
# -------------------------------------------------------------
S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
S3_BUCKET="anlinks-media"
S3_ACCESS_KEY_ID="your-r2-access-key-id"
S3_SECRET_ACCESS_KEY="your-r2-secret-access-key"
S3_REGION="auto"
S3_PUBLIC_URL="https://media.anlinks.dev"

# -------------------------------------------------------------
# 6. تسجيل الدخول الاجتماعي عبر Google (اختياري)
# -------------------------------------------------------------
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## 3. الطريقة الأولى: الرفع عبر لوحة تحكم Vercel (الموصى بها)

### الخطوة 1: استيراد المشروع في Vercel
1. توجّه إلى [لوحة تحكم Vercel](https://vercel.com/dashboard).
2. اضغط على زر **Add New...** ثم اختر **Project**.
3. اختر مستودع GitHub الخاص بالمشروع (`AN-LINKS`).
4. اضغط على **Import**.

### الخطوة 2: مراجعة إعدادات البناء (Build Configuration)
يقوم Vercel تلقائياً باكتشاف تطبيق Next.js، تأكد من الإعدادات التالية:
- **Framework Preset:** `Next.js`
- **Root Directory:** `./`
- **Build Command:** `next build`  
  *(لاحظ: سطر `package.json` يحتوي على `"postinstall": "prisma generate"`، مما يضمن توليد عميل بريزما تلقائياً قبل البناء)*.
- **Output Directory:** `.next`
- **Node.js Version:** `20.x` أو `22.x` (من تبويب General في إعدادات المشروع لاحقاً).

### الخطوة 3: إضافة المتغيرات البيئية
1. في قسم **Environment Variables** أثناء الاستيراد، أضف المتغيرات المذكورة في [القسم 2](#2-قائمة-المتغيرات-البيئية-environment-variables).
2. تأكد من تحديد نطاق التطبيق على **Production**, **Preview**, و **Development**.

### الخطوة 4: النشر والتشغيل (Deploy)
1. اضغط على زر **Deploy**.
2. انتظر حوالي 1-2 دقيقة حتى يكتمل البناء وتظهر شاشة الاحتفال مع رابط النطاق الخاص بك (مثلاً `https://an-links.vercel.app`).

---

## 4. الطريقة الثانية: الرفع عبر سطر الأوامر (Vercel CLI)

إذا كنت تفضل النشر السريع عبر الطرفية (Terminal):

```bash
# 1. تثبيت Vercel CLI عالمياً (إذا لم يكن مثبتاً)
npm i -g vercel

# 2. تسجيل الدخول إلى حسابك في Vercel
vercel login

# 3. ربط المجلد المحلي بمشروع Vercel
vercel link --repo

# 4. إرسال أو إضافة المتغيرات البيئية
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add PAYMENT_ENCRYPTION_KEY production

# 5. نشر نسخة تجريبية للمعاينة (Preview)
vercel

# 6. نشر نسخة الإنتاج النهائية (Production)
vercel --prod
```

---

## 5. تهيئة قاعدة البيانات السحابية وبذر البيانات الأولي

عند ربط قاعدة بيانات PostgreSQL سحابية جديدة لأول مرة:

### 1. تطبيق جداول المخطط (Schema Migration)
من جهازك المحلي (مع ضبط رابط `DATABASE_URL` السحابي مؤقتاً في ملف `.env`):
```bash
npx prisma db push
```

### 2. بذر البيانات الإدارية والافتراضية (Seeding)
لتشغيل بذر الحسابات الافتراضية، بوابات الدفع، العملات، وخطط الاشتراكات:
```bash
npx prisma db seed
```
> سيؤدي هذا إلى إنشاء:
> - حساب مدير النظام الرئيسي: `admin@anlinks.dev` باسم مستخدم `@sysadmin`
> - حساب العميل التجريبي: `client@anlinks.dev` باسم مستخدم `@faisal_client`
> - بوابات الدفع المدعومة (Tap, Moyasar, Stripe, PayPal, Paddle, وغيرها)
> - الخطط التسعيرية والعملات ومعدلات التحويل

---

## 6. إعداد النطاق المخصص والنطاقات الفرعية الشاملة (Wildcard DNS)

لكي تعمل ميزات **الروابط المخصصة للبايو** والنطاقات الفرعية مثل `https://sysadmin.anlinks.dev` أو النطاق العام `https://anlinks.dev`:

### 1. إضافة النطاق في Vercel
1. في مشروع Vercel، اذهب إلى **Settings > Domains**.
2. أضف النطاق الرئيسي: `anlinks.dev` (مع تحويل `www.anlinks.dev` إليه).
3. أضف النطاق الشامل (Wildcard): `*.anlinks.dev`.

### 2. ضبط سجلات DNS في مزود النطاق (Cloudflare أو Namecheap وغيرهما)

| النوع (Type) | الاسم (Name) | القيمة (Target / Value) | ميزة Proxy في Cloudflare |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | DNS Only (رمادي) أو Proxied |
| **CNAME** | `www` | `cname.vercel-dns.com` | DNS Only (رمادي) |
| **CNAME** | `*` | `cname.vercel-dns.com` | DNS Only (رمادي) لشهادات SSL التلقائية |

---

## 7. معالجة المشاكل الشائعة وحلولها (Troubleshooting)

### المشكلة 1: `PrismaClientInitializationError: Can't reach database server`
- **السبب:** عدد اتصالات الدوال بدون خادم (Serverless Functions) تجاوز الحد المسموح لقاعدة البيانات.
- **الحل:** تأكد من استخدام رابط مجمع الاتصالات (Connection Pooler) مثل `port 6543` في Supabase أو رابط Neon المجمّع مع إضافة `?pgbouncer=true` في نهاية رابط `DATABASE_URL`.

### المشكلة 2: خطأ `EROFS: read-only file system` عند رفع الصور الرمزية
- **السبب:** نظام ملفات Vercel لا يسمح بالكتابة الدائمة في المجلد المحلي `public/uploads`.
- **الحل:** قم بملء متغيرات Cloudflare R2 / S3 (`S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`)؛ وسيقوم النظام فوراً بتوجيه الرفع إلى السحابة مع تحسين صيغ WebP وضغط الصور تلقائياً.

### المشكلة 3: خطأ في إعادة توجيه تسجيل الدخول (Invalid Callback URL / CSRF)
- **السبب:** عدم تطابق قيمة `NEXTAUTH_URL` مع النطاق الفعلي للموقع.
- **الحل:** اضبط `NEXTAUTH_URL="https://اسم-نطاقك.com"` داخل متغيرات بيئة Vercel للإنتاج.

---

> تم إعداد وتوثيق هذا الدليل خصيصاً لمشروع **AN LINKS** ومتوافق بنسبة 100% مع Next.js 15 و Prisma ORM.
