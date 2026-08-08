# Ashish Kumar — Portfolio

A production-grade personal portfolio and headless CMS. Next.js 15 App Router, React 19,
TypeScript, Tailwind v4, MongoDB. Every piece of content on the public site is editable
from `/admin` without touching code.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional — the site runs without it
npm run dev
```

Open <http://localhost:3000>.

**It works with no configuration at all.** With no `MONGODB_URI`, every page renders from
`src/constants/seed-data.ts` — content extracted from the resume. Add a database when you
want to edit content through the admin panel instead of in code.

### To enable the admin panel

1. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`.
2. `npm run seed` — copies the seed content into MongoDB (or click **Run seeder** on the
   admin dashboard).
3. Sign in at `/admin/login`.

The seeder is idempotent — re-running it updates records rather than duplicating them.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (4GB heap — see note below) |
| `npm run seed` | Copy seed content into MongoDB |
| `node scripts/generate-assets.mjs` | Regenerate the placeholder SVG imagery |

---

## Architecture

```
src/
├── app/
│   ├── (site)/            Public site — its own layout, cursor, smooth scroll
│   │   ├── page.tsx       Landing page
│   │   ├── about/ experience/ projects/ skills/
│   │   ├── achievements/ resume/ blog/ contact/
│   │   └── privacy/ terms/
│   ├── admin/
│   │   ├── login/
│   │   └── (dashboard)/   Session-guarded CMS
│   │       ├── dashboard/ analytics/ media/ messages/
│   │       └── [resource]/[id]/   One route serves every content type
│   ├── api/
│   │   ├── contact/ analytics/ og/
│   │   └── admin/         auth · content CRUD · upload · revalidate · seed
│   ├── sitemap.ts robots.ts manifest.ts rss.xml/
│   └── layout.tsx globals.css not-found.tsx error.tsx
│
├── components/
│   ├── ui/                Primitives (shadcn-style, Radix + CVA)
│   ├── motion/            Reveal, TextReveal, Magnetic, TiltCard, Marquee, Parallax
│   ├── layout/            Navbar, footer, cursor, command palette, intro
│   ├── home/              Landing sections + the WebGL hero
│   ├── shared/            Cross-page: project card, timeline, skill grid, markdown
│   ├── projects/ blog/ contact/ resume/
│   ├── admin/             Form engine, table, inbox, dashboard, media
│   └── providers/         Theme, React Query, Redux, Lenis
│
├── config/                Fonts, admin field definitions
├── constants/             Site config + resume-derived seed content
├── hooks/                 Shared React hooks
├── lib/                   utils · db · auth · api · seo · crud registry
├── models/                Mongoose schemas (14 collections)
├── schemas/               Zod validation — shared by API and forms
├── services/              Server data access, GitHub, mail, admin client
├── store/                 Redux Toolkit (UI state only)
└── types/                 Domain types
```

### Three ideas hold it together

**1. Content degrades, it never breaks.**
`src/services/content.service.ts` reads from MongoDB and falls back to seed data on every
query. A missing database, an unreachable cluster or an empty collection all produce a
complete, correct page. A fresh `git clone` renders identically to production.

**2. One CRUD engine, not fifteen.**
`src/lib/crud.ts` is a registry mapping each content type to its model, Zod schema, sort
order, searchable fields and revalidation paths. Two route files serve all of them. Adding
a content type is a registry entry plus a field definition — no new endpoints.

**3. One form engine, not fifteen.**
`src/config/admin-fields.ts` declares every admin form as data: field type, label, span,
validation hints, nested groups. `<ResourceForm>` renders any of them, and API validation
errors map back onto the fields that produced them.

### A note on type-check memory

Type checking this project needs roughly 4GB of heap. If `next build` runs out of memory
on your machine:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
# or, to skip the in-build check and verify separately:
SKIP_TYPE_CHECK=1 npm run build && npm run typecheck
```

Two patterns in this codebase were originally responsible for far worse — both are worth
knowing about, because they're easy to reintroduce:

- **`model<T>(name, schema)`** instantiates Mongoose's five-parameter `Model<…>` generic at
  every call site. Across seventeen models that alone exhausted a 6GB heap. `src/models/index.ts`
  calls the non-generic `model()` and casts instead.
- **`satisfies Record<string, ResourceConfig>`** on the resource registry forced TypeScript
  to infer and retain the full literal type, including thirteen deeply-nested Zod schema
  types. `src/lib/crud.ts` uses an explicit annotation so each schema widens on assignment.

---

## Content model

| Collection | Purpose |
| --- | --- |
| `heroes` `abouts` `seos` `settings` | Singletons — one document each |
| `projects` | Case studies with gallery, architecture, challenges, metrics, snippets |
| `experiences` `educations` `skills` `achievements` `testimonials` | Résumé content |
| `blogs` | Markdown articles with SEO overrides |
| `socials` `resumes` | Links and the downloadable PDF |
| `messages` | Contact form submissions |
| `analytics` | First-party page views and events |
| `users` | Admin accounts (bcrypt, role-based) |

---

## Security

- **Sessions** — JWT via `jose` (Edge-compatible), HTTP-only `SameSite=Lax` cookie.
- **Two guards** — Edge middleware redirects unauthenticated `/admin/**` requests and 401s
  `/api/admin/**`; the dashboard layout re-verifies server-side so no admin page can render
  without a session.
- **Roles** — `viewer` < `editor` < `admin`, enforced per resource in the CRUD registry.
- **Passwords** — bcrypt, cost 12, `select: false` so they never leave the database by accident.
- **Rate limiting** — sliding window on login (5 / 5 min), contact (3 / 10 min), analytics
  (60 / min). Swap the in-memory store for Redis if you scale beyond one instance.
- **Contact form** — honeypot, rate limit, Zod validation, HTML-escaped email output.
- **Headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## Performance

- Static generation with hourly ISR; `revalidatePath` fires on every admin save, so edits
  publish immediately rather than waiting out the window.
- `next/font` self-hosts all three faces — no external request, no layout shift.
- The WebGL hero is `dynamic(… { ssr: false })`: ~90KB of three.js stays out of the
  critical path, and its render loop pauses when off-screen or in a background tab.
- The canvas particle field scales its count to viewport area and caps DPR at 2.
- Markdown, syntax highlighting and JSON-LD are server-only — no parser ships to the client.
- Every animation is transform/opacity, so nothing forces layout.
- `prefers-reduced-motion` disables smooth scroll, the cursor, the intro and all
  decorative motion.

---

## Accessibility

Skip link, visible focus rings, semantic landmarks, `aria-current` on active navigation,
labelled form controls with `role="alert"` errors, keyboard-navigable gallery lightbox
(arrows + Escape), live regions on filtered result counts, and a custom cursor that never
replaces a real focus indicator.

---

## SEO

Per-page metadata through one `buildMetadata()` helper, Open Graph and Twitter cards, a
dynamic edge-rendered OG image at `/api/og`, JSON-LD for Person / WebSite / BreadcrumbList /
SoftwareApplication / BlogPosting / FAQPage, `sitemap.xml`, `robots.txt`, `rss.xml`, a web
manifest, and canonical URLs everywhere.

---

## Environment variables

Everything is optional except where noted. See `.env.example`.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URLs, OG images, sitemap |
| `MONGODB_URI` | For the CMS | Without it, the site serves seed content |
| `JWT_SECRET` | For the CMS | 32+ random characters |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | For the CMS | Also the pre-seed login fallback |
| `CLOUDINARY_*` | For uploads | Otherwise reference files in `/public` |
| `SMTP_*`, `CONTACT_TO_EMAIL` | For email | Messages are still stored without it |
| `GITHUB_USERNAME` / `GITHUB_TOKEN` | Optional | Token unlocks the contribution graph |

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import it in Vercel — the framework preset is detected automatically.
3. Add the environment variables above.
4. Deploy, then run the seeder from the admin dashboard.

MongoDB Atlas needs `0.0.0.0/0` in its network access list for Vercel's serverless
functions, or Vercel's static IPs if you're on a plan that provides them.

---

## Replacing the placeholder assets

| Path | Replace with |
| --- | --- |
| `public/images/avatar.svg` | A square professional photo (`avatar.jpg`, then update the hero) |
| `public/images/about.svg` | A 4:5 portrait for the about page |
| `public/images/projects/*/` | Real screenshots — filenames are referenced in seed data |
| `public/resume/Ashish-Kumar-Resume.pdf` | Already your real resume |

`public/images/projects/ebease/gallery-1.png` is a real Ebease screenshot and is already
used as that project's cover.

---

## Licence

Code is available for reference and reuse. The written content, case studies and personal
imagery are © Ashish Kumar.
