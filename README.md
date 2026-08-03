# VINAY — Real Estate Platform

A complete, production-ready real estate website built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Prisma ORM** and **PostgreSQL**.

![VINAY](public/og.png)

## Features

- **Public website** — animated landing page (hero, categories, featured & latest listings, stats, testimonials, CTA), property listings with advanced filters, property detail pages (gallery, amenities, nearby places, Google Maps, mortgage calculator, booking dialog, reviews), agents directory, blog with comments, about/contact/FAQ pages, wishlist & compare (localStorage), dark mode, floating WhatsApp button.
- **Admin dashboard** at `/admin` — analytics & charts, full CRUD for properties, agents, categories, blog posts, testimonials; inbox for leads, appointments, messages, reviews, newsletter subscribers; media library with uploads; site-wide settings (contact info, social links, SEO defaults).
- **Auth** — JWT in httpOnly cookies, bcrypt hashing, role-based access (ADMIN), password reset flow with emailed links.
- **SEO** — per-page metadata, JSON-LD structured data (RealEstateListing / Organization), sitemap, robots.txt, PWA manifest, Open Graph images.
- **Extras** — in-memory rate limiting, disk uploads (S3-ready), email via SMTP (nodemailer) with console fallback, Redis-ready caching.

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Next.js 15 (App Router) + React 19          |
| Language   | TypeScript (strict)                         |
| Styling    | Tailwind CSS 3 + CSS variables + dark mode  |
| UI         | Radix UI primitives, shadcn-style, Lucide   |
| Animation  | Framer Motion, Recharts                     |
| ORM        | Prisma 6 + PostgreSQL                       |
| Validation | Zod + React Hook Form                       |
| Auth       | JSON Web Tokens + bcryptjs                  |

## Getting Started

### 1. Prerequisites

- Node.js 20+ (built against 24.x)
- PostgreSQL 14+ (local, Docker, or a cloud instance like Supabase/Neon)

### 2. Install & configure

```bash
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vinay"
JWT_SECRET="a-long-random-string"
```

### 3. Database

```bash
npx prisma migrate dev          # apply the SQL migration
npm run db:seed                 # sample data + admin account
```

The seed creates the demo admin account:

```
Email:    admin@vinay.com
Password: Admin@123
```

### 4. Run

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

### 5. Build for production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for the full list with comments. Highlights:

| Variable                  | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `DATABASE_URL`            | PostgreSQL connection string                     |
| `JWT_SECRET`              | Signing secret for auth tokens                   |
| `COOKIE_NAME`             | Cookie name for the session (default `vinay_token`) |
| `NEXT_PUBLIC_SITE_URL`    | Canonical site URL (SEO/sitemap)                 |
| `SMTP_HOST/PORT/USER/PASS`| Transactional email (reset links, lead alerts)   |
| `S3_*`                    | Optional S3-compatible uploads (falls back to disk) |
| `ADMIN_EMAIL/PASSWORD`    | Used by the seed script for the admin user       |

## Scripts

```bash
npm run dev          # dev server
npm run build        # prisma generate + production build
npm run start        # serve production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run db:seed      # seed / reset sample data
```

## Project Structure

```
app/                  # App Router pages + API routes
  api/                #   REST endpoints (auth, properties, leads, admin…)
  admin/              #   admin dashboard (guarded)
  properties/         #   listing + detail
  agents/ blog/       #   directory + content
components/
  ui/                 # shadcn-style primitives
  shared/             # property card, filters, forms, calculators…
  sections/home/      # homepage sections
  admin/              # admin shell, forms, charts, uploaders
  layout/             # navbar, footer, providers
lib/                  # prisma, auth, validations, mail, uploads…
prisma/
  schema.prisma       # 14 models
  migrations/         # SQL migration
  seed.ts             # sample data
public/               # static assets + uploads
```

## Deployment

A full step-by-step guide (Vercel + managed PostgreSQL, env setup, migration steps) is in [DEPLOYMENT.md](DEPLOYMENT.md).

## License

Private project — all rights reserved.
