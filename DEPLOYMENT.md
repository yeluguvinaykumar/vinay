# VINAY — Deployment Guide

This guide covers deploying VINAY to **Vercel** (frontend + API) with a managed **PostgreSQL** database (Supabase, Neon, or Railway). The same steps apply to any Node.js host.

---

## 1. Database

Create a PostgreSQL 14+ database on your provider of choice and copy the connection string.

### Supabase (free)

1. Create a project at https://supabase.com
2. Go to **Project Settings → Database → Connection string**
3. Copy the URI-style string: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### Neon (free)

1. Create a project at https://neon.tech
2. Copy the pooled connection string from the dashboard.

### Railway / Heroku

Use the connection string the platform provides (`DATABASE_URL`).

> **Note:** if the provider URL uses `?sslmode=require` keep it — Prisma supports it.

## 2. Prepare the database schema

From your local machine (with `DATABASE_URL` pointing to production):

```bash
DATABASE_URL="<prod-url>" npx prisma migrate deploy
```

Seed the admin user and sample content:

```bash
DATABASE_URL="<prod-url>" npm run db:seed
```

> Change the admin password immediately after first login.

## 3. Vercel

### 3.1 Push the code

```bash
git add -A
git commit -m "Deploy VINAY"
git push origin main
```

### 3.2 Import the repo

1. Go to https://vercel.com/new and import the repository.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: keep the default (`prisma generate && next build`).
4. Install command: `npm install` (or `npm ci`).

### 3.3 Environment variables

Add every variable from `.env.example`:

| Variable                  | Required | Example                                   |
| ------------------------- | -------- | ----------------------------------------- |
| `DATABASE_URL`            | ✅       | `postgresql://…`                          |
| `JWT_SECRET`              | ✅       | a long random string                      |
| `NEXT_PUBLIC_SITE_URL`    | ✅       | `https://your-domain.vercel.app`          |
| `COOKIE_NAME`             | optional | `vinay_token`                             |
| `SMTP_HOST`               | optional | `smtp.resend.com`                         |
| `SMTP_PORT`               | optional | `465`                                     |
| `SMTP_USER`               | optional |                                           |
| `SMTP_PASS`               | optional |                                           |
| `MAIL_FROM`               | optional | `VINAY <no-reply@your-domain.com>`        |
| `ADMIN_EMAIL`             | optional | admin account used by the seed            |
| `ADMIN_PASSWORD`          | optional | admin password used by the seed           |
| `S3_*`                    | optional | only needed if using S3-compatible uploads|

### 3.4 Deploy

Click **Deploy**. On success, visit:

- Website: `https://<project>.vercel.app`
- Admin: `https://<project>.vercel.app/admin`

## 4. Custom domain & email

- Add your domain under **Vercel → Project → Settings → Domains**.
- Set `NEXT_PUBLIC_SITE_URL` to the custom domain afterwards.
- For password-reset emails, use a transactional provider (Resend, SendGrid, Mailgun…) and point the SMTP vars at it. Without SMTP vars the app logs emails to the server console instead.

## 5. Uploads

By default, uploads are written to the local filesystem (`public/uploads`) — this is fine for single-instance Vercel functions in development, but files are **ephemeral** on serverless. For production:

1. Create a bucket on S3 (or Cloudflare R2).
2. Set `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT` (R2/other) and credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
3. The upload API automatically switches to S3 when those variables are set.

## 6. Rate limiting & caching notes

- The built-in rate limiter is **in-memory** (per instance). For multi-instance deployments, extend `lib/rate-limit.ts` to a shared store (Redis) or rely on a WAF/edge rate limiter.
- `getSiteSettings()` caches settings in memory for the instance lifetime; restart after changing settings if you don't want to wait.

## 7. Post-deploy checklist

- [ ] `https://<url>/sitemap.xml` returns 200 and lists your pages
- [ ] `https://<url>/robots.txt` returns 200
- [ ] Admin login works (`/admin`)
- [ ] A lead submitted from a property page appears in `/admin/leads`
- [ ] Image upload in `/admin/media` works and the URL is publicly reachable
- [ ] `https://<url>/api/search?q=villa` returns JSON results
