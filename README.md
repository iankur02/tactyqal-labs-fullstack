# Tactyqal Labs — Full Stack Application

A production-style monorepo built for the **Tactyqal Labs Full Stack Developer Hire-a-thon**.

Redesigns the Tactyqal Labs homepage and replaces the standalone WordPress blog with a
custom CMS: a React + Vite frontend, an Express + MongoDB API, and a secure admin dashboard.

> **Assignment:** [tactyqal.com](https://tactyqal.com/) · Redesign homepage · Ship a complete blog backend · Demonstrate real-world full-stack engineering.

---

## 📌 Table of Contents

1. [Live Demo](#-live-demo)
2. [Screenshots](#-screenshots)
3. [Features](#-features)
4. [Tech Stack](#-tech-stack)
5. [Architecture](#-architecture)
6. [Key Design Decisions](#-key-design-decisions)
7. [API Reference](#-api-reference)
8. [Database Schema](#-database-schema)
9. [Quick Start](#-quick-start)
10. [Admin Setup](#-admin-setup)
11. [Testing](#-testing)
12. [Deployment](#-deployment)
13. [Environment Variables](#-environment-variables)
14. [Project Structure](#-project-structure)
15. [Known Limitations](#-known-limitations)
16. [Roadmap](#-roadmap)
17. [License](#-license)

---

## 🌐 Live Demo

| Service | URL |
| :--- | :--- |
| **Frontend (Vercel)** | [https://tactyqal-labs.vercel.app] |
| **Backend API (Render)** | [https://tactyqal-labs-fullstack.onrender.com/api/health]|
| **Admin Dashboard** | [https://tactyqal-labs.vercel.app/admin/login] |

## 🖼️ Screenshots

| Homepage | Admin Dashboard |
|:---:|:---:|
| ![Homepage](./docs/screenshots/home.png) | ![Admin Dashboard](./docs/screenshots/admin.png) |

| Public Blog | Blog Detail |
|:---:|:---:|
| ![Blog](./docs/screenshots/blog.png) | ![Blog Detail](./docs/screenshots/blog-detail.png) |

## ✨ Features

### Public site
- **Redesigned homepage** with hero, about, services, process, blog preview, and CTA — all copy derived from verified Tactyqal Labs sources (About page, LinkedIn, Product Hunt, Indie Hackers).
- **Sticky, scroll-aware navbar** with mobile drawer, active states, and smooth-scroll anchors.
- **Framer Motion** page transitions and section reveals, disabled under `prefers-reduced-motion`.
- **Public blog** at `/blog` with:
  - URL-synced search, category filters, and pagination (shareable, back-button friendly)
  - Debounced search that updates the URL without spamming history
  - "Clear filters" affordance
- **Blog detail** at `/blog/:slug` with:
  - Sanitized HTML (DOMPurify) and hardened external links (`rel="noreferrer noopener"`)
  - Reading time, author, category badge, related posts
  - Per-post SEO: dynamic `<title>`, description, OG image, canonical, and `Article` JSON-LD
- **Branded 404** and empty states everywhere.

### Admin CMS
- **JWT authentication** — 15-minute access token in memory, 7-day refresh token in an `httpOnly` `SameSite=None; Secure` cookie, rotated on every refresh.
- **Role-based access** — `admin` and `editor` roles; `protect` + `restrictTo` middleware on every protected route.
- **Dashboard** with post counts, published/draft split, category count, and recently-updated list.
- **Posts management** — search, status filter, pagination, and per-row view/edit/delete.
- **Post editor** — title, auto-slug (with manual override), excerpt, rich text content, tags, category, SEO fields, featured image, save-as-draft, publish.
- **Categories manager** — create, edit, delete; the API refuses to delete categories still referenced by posts.
- **Image upload** — Multer memory storage, MIME whitelist (`jpeg`/`png`/`webp`), 5 MB cap, Cloudinary in production, `/uploads` fallback in dev.
- **Confirmation dialogs** on every destructive action.
- **Global toast notifications** (react-hot-toast) for success and error states.

### Engineering
- **40+ tests** (Jest + Supertest + `mongodb-memory-server`): auth, posts, categories, upload.
- **Security-first**: Helmet, CORS allowlist, rate limiting, `express-mongo-sanitize`, regex-escaped search, bcrypt cost 12, bcrypt-timing-safe login, JWT rotation.
- **Consistent API envelope**: `{ success, message, data?, meta?, errors? }` on every response.
- **Typed boundaries via Zod** on the backend for every mutation and list query.
- **Code splitting** via React lazy routes + Vite manual chunks (admin is a separate bundle never loaded by public visitors).
- **React Query** for server state with per-resource invalidation; cache cleared on logout to prevent cross-user leaks.

---

## 🛠️ Tech Stack

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 (custom design tokens) |
| Routing | React Router DOM 6 |
| Data fetching | TanStack React Query 5 + Axios |
| Animation | Framer Motion 11 (`useReducedMotion` aware) |
| Forms & validation | React Hook Form + Zod |
| Icons | Lucide React |
| Sanitization | DOMPurify |
| Dates | date-fns |
| Toasts | react-hot-toast |
| Editor | Custom `contentEditable` (no external dep) |

### Backend
| Concern | Choice |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (`jsonwebtoken`), bcrypt cost 12 |
| Validation | Zod |
| Uploads | Multer (memory) + Cloudinary |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize |
| Env | dotenv + Zod-validated schema (`src/config/env.js`) |
| Testing | Jest + Supertest + `mongodb-memory-server` |

### Tooling
- **Monorepo:** npm workspaces
- **Lint:** ESLint (backend: `eslint:recommended`; frontend: + `react`, `react-hooks`)
- **Format:** Prettier
- **CI:** GitHub Actions (keep-alive for Render free tier)
- **Hosting plan:** Vercel (frontend) · Render (backend) · MongoDB Atlas · Cloudinary

---

## 🏗️ Architecture

```
┌─────────────────────────┐           ┌─────────────────────────┐
│   Vercel (Static SPA)   │           │  Render (Express API)   │
│  React + Vite + RQ      │──HTTPS───▶│  JWT · Zod · Mongoose   │
│  Tailwind · Framer      │◀──HTTPS───│  Multer · Cloudinary    │
└─────────────────────────┘           └────────────┬────────────┘
       │                                           │
       │ (Bearer in memory,                        │
       │  httpOnly refresh cookie)                 │
       │                                           ▼
       │                          ┌─────────────────────────────┐
       │                          │      MongoDB Atlas          │
       │                          │  users · posts · categories │
       │                          └─────────────────────────────┘
       │                                          │
       │                                          ▼
       │                          ┌─────────────────────────────┐
       │                          │        Cloudinary           │
       │                          │      Featured images        │
       │                          └─────────────────────────────┘
```

### Frontend layers

| Layer | Responsibility |
|---|---|
| `api/` | Axios client (token injection, transparent refresh, error normalization) + per-resource modules |
| `context/` | `AuthContext` — token lifecycle, restore-on-mount, logout cache clear |
| `hooks/` | `useAuth`, `useDebounce`, `useDebouncedSearchInput`, `useDocumentTitle`, `useMotionSafe` |
| `routes/` | `ProtectedRoute`, `PublicOnlyRoute`, `RequireRole` |
| `layouts/` | `PublicLayout` (Navbar + skip link + Footer), `AdminLayout` (sidebar + mobile drawer) |
| `features/` | Vertical slices: `homepage/`, `blog/`, `admin/` — each owns its pages and internal components |
| `components/ui/` | Design-system primitives: `Button`, `Container`, `Section`, `SectionHeading`, `FormField`, `Modal`, `Spinner`, `Badge`, `Skeleton` |
| `components/shared/` | `Navbar`, `Footer`, `SkipToContent` |
| `components/Seo.jsx` | Declarative document-head manager (title, meta, OG, canonical, JSON-LD) |
| `constants/content.js` | Single source of truth for verified marketing copy |
| `utils/` | `formatDate`, `readingTime`, `sanitize`, `resolveImageUrl`, `baseSlug` |

### Backend layers

| Layer | Responsibility |
|---|---|
| `config/` | `env.js` (Zod-validated, fails fast), `db.js`, `cloudinary.js` |
| `models/` | Mongoose schemas with indexes + hooks (bcrypt, `publishedAt` sync) |
| `validators/` | Zod schemas per resource — shared by routes and tests |
| `middleware/` | `auth` (protect + roles), `validate` (body/query/params), `upload`, `rateLimiter`, `errorHandler`, `notFound` |
| `controllers/` | Business logic only — no schema definitions, no route setup |
| `routes/` | Composition: apply middleware + validate + controller |
| `utils/` | `AppError`, `catchAsync`, `apiResponse`, `jwt`, `slugify` |
| `seed/` | Idempotent admin + default-category creation |

**Why these boundaries?** Each layer has a single reason to change: schema changes live in `models`/`validators`, contract changes in `controllers`, security changes in `middleware`. Controllers never touch `req.body` shape directly — Zod has already parsed it.

---

## 🎯 Key Design Decisions

Every non-trivial decision below is deliberate; alternatives were considered.

### 1. Monorepo with npm workspaces
One `npm install` at the root installs both apps; one `npm run dev` boots both with `concurrently`. This is the smallest possible onboarding surface for a reviewer or new engineer. Separating into two repos would double the setup steps without any benefit at this scale.

### 2. In-memory access token + httpOnly refresh cookie
Access tokens are stored in a `useRef` inside `AuthContext` — **never** in `localStorage`. This eliminates the XSS token-theft surface. The long-lived refresh token lives in an `httpOnly`, `Secure`, `SameSite=None` cookie scoped to `/api/auth`. Refresh rotates both tokens on every call.

**Trade-off accepted:** an in-memory token means a page refresh must re-authenticate via the refresh cookie (~150 ms latency once, on load). Worth it.

### 3. Backend Zod validation on every boundary
Every mutating endpoint parses `body`, `query`, and `params` through Zod *before* touching Mongoose. Failure returns a `422` with field-level errors — the exact shape the frontend renders next to each input. This makes frontend and backend validation complementary rather than redundant.

### 4. Custom rich-text editor over TipTap/Lexical
`react-quill` conflicts with React 18's peer deps; `TipTap` and `Lexical` add 80–150 KB to the admin bundle for a feature surface we don't need. The `<RichTextEditor>` uses `document.execCommand` (deprecated but universally supported) with a custom toolbar.

**Trade-off accepted:** `execCommand` is deprecated, and a future iteration should migrate. The component is isolated so the swap is a single-file change.

### 5. React Query with per-resource invalidation
Publishing a post invalidates `posts`, `adminPosts`, `adminStats`, and the individual `adminPost`. The public `/blog` reflects the new post **without a manual refresh**. Category mutations invalidate the shared `categoriesQueryKey` used by both the admin page and the public filter pills — one data flow, one source of truth.

### 6. URL as the source of truth for blog filters
`/blog?search=launch&category=growth&page=2` is a valid, shareable, back-button-friendly state. Debounced search uses `replace: true` (no history spam); filter changes use `push` (Back undoes the filter, not a keystroke).

### 7. Route-level code splitting + manual vendor chunks
Public pages load in their own chunks; the entire `features/admin/` folder builds into a single `feature-admin` chunk fetched only on the first `/admin` visit. A public visitor downloads zero admin code.

### 8. Split-origin auth done right
`withCredentials: true` on the client, `credentials: true` + explicit `CLIENT_URL` on the server, `SameSite=None; Secure` cookies in production, `app.set('trust proxy', 1)` for Render's proxy. Every layer of the cross-origin cookie path is verified in the [deployment checklist](./SECURITY.md).

### 9. Fail-fast environment validation
`src/config/env.js` parses `process.env` through Zod at boot. A missing or too-short `JWT_SECRET` terminates the process with a clear message — before any request is served. This prevents silent misconfiguration in production.

### 10. Honest non-claims
Nothing in this README describes anything as deployed, tested on a specific browser version, or verified against a live third-party API unless it actually was during development. The [Known Limitations](#-known-limitations) section exists because real projects have real edges.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api` (dev) · `https://<render-host>/api` (prod)

All responses use the envelope:

```json
{ "success": true, "message": "OK", "data": { ... }, "meta": { ... } }
```

Errors:

```json
{ "success": false, "message": "Human-readable error", "errors": { "field": ["…"] } }
```

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Liveness probe |

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | — (rate-limited 10/15m) | Email + password → access token + refresh cookie |
| `GET` | `/auth/me` | Bearer | Current user |
| `POST` | `/auth/refresh` | Cookie | New access token; rotates refresh cookie |
| `POST` | `/auth/logout` | — | Clears refresh cookie |

### Posts

| Method | Path | Auth | Query params | Description |
|---|---|---|---|---|
| `GET` | `/posts` | — | `page,limit,search,category,tag,sort` | Published posts only |
| `GET` | `/posts/slug/:slug` | optional Bearer | — | Get by slug (drafts require admin token) |
| `GET` | `/posts/admin` | Bearer | `page,limit,search,category,tag,status,sort` | All posts (any status) |
| `GET` | `/posts/stats` | Bearer | — | Dashboard stats |
| `GET` | `/posts/:id` | Bearer | — | Get by id (admin edit) |
| `POST` | `/posts` | Bearer | — | Create post (auto-slug if not provided) |
| `PUT` | `/posts/:id` | Bearer | — | Update post |
| `DELETE` | `/posts/:id` | Bearer | — | Delete post |

### Categories

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/categories` | — | List all |
| `POST` | `/categories` | Bearer | Create (case-insensitive unique) |
| `PUT` | `/categories/:id` | Bearer | Update |
| `DELETE` | `/categories/:id` | Bearer | Delete (409 if posts reference it) |

### Upload

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/upload` | Bearer | `multipart/form-data`, field `image` — returns `{ url, publicId }` |

**Postman collection:** [`postman/Tactyqal-Labs-API.postman_collection.json`](./postman/Tactyqal-Labs-API.postman_collection.json). Auto-captures `accessToken`, `postId`, `slug`, and `categoryId` across requests.

```bash
newman run postman/Tactyqal-Labs-API.postman_collection.json \
  --env-var baseUrl=http://localhost:5000/api
```

---

## 🗄️ Database Schema

### `users`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, max 80 |
| `email` | String | Required, unique, lowercase |
| `password` | String | bcrypt cost 12, `select: false` |
| `role` | Enum | `admin` \| `editor` |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

**Indexes:** `{ email: 1 }` (unique)

### `categories`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, unique, max 60 |
| `slug` | String | Required, unique, auto-generated |
| `description` | String | Optional, max 300 |
| `createdAt` | Date | auto |

**Indexes:** `{ slug: 1 }` (unique), `{ name: 1 }` (unique)

### `posts`

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required, max 180 |
| `slug` | String | Required, unique, auto-generated from title |
| `excerpt` | String | Required, max 400 |
| `content` | String | Required, max 500 KB |
| `featuredImage` | `{ url, publicId }` | Optional subdoc |
| `category` | ObjectId → Category | Required |
| `tags` | `[String]` | Max 12 |
| `author` | ObjectId → User | Required |
| `status` | Enum | `draft` \| `published` |
| `publishedAt` | Date | Set on publish, cleared on unpublish (via pre-save hook) |
| `seoTitle` | String | Optional, max 180 |
| `seoDescription` | String | Optional, max 300 |
| `createdAt`, `updatedAt` | Date | auto |

**Indexes:**
- `{ slug: 1 }` unique
- `{ status: 1, publishedAt: -1 }` — drives the public feed
- `{ category: 1 }` — powers filter pills
- `{ tags: 1 }` — tag filter
- Text index on `{ title, excerpt }`

**Relationships:**
- `Post.author` → `User._id` (`ref: 'User'`)
- `Post.category` → `Category._id` (`ref: 'Category'`)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 18.18** (Node 20 recommended)
- **MongoDB** — locally installed, or a free [Atlas](https://cloud.mongodb.com) cluster
- **npm** ≥ 9

### Steps

```bash
# 1. Clone
git clone https://github.com/<you>/tactyqal-labs-fullstack.git
cd tactyqal-labs-fullstack

# 2. Install both workspaces
npm install

# 3. Configure backend
cp backend/.env.example backend/.env
# edit backend/.env — set MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET

# 4. Configure frontend
cp frontend/.env.example frontend/.env
# VITE_API_URL=http://localhost:5000/api is the default

# 5. Seed admin + default categories
npm run seed:admin -w backend

# 6. Start both servers
npm run dev
```

Open:
- Frontend → http://localhost:5173
- Admin → http://localhost:5173/admin/login
- API health → http://localhost:5000/api/health

**Generate strong JWT secrets:**

```bash
openssl rand -hex 32   # → JWT_SECRET
openssl rand -hex 32   # → JWT_REFRESH_SECRET (must differ)
```

**Run individual apps:**

```bash
npm run dev -w backend     # API only
npm run dev -w frontend    # SPA only
npm run lint               # lint both
npm test -w backend        # backend tests
npm run build -w frontend  # production frontend build
```

---

## 🔐 Admin Setup

There is **no public admin registration** — by design. Admins are created by the seed script only.

1. Set these in `backend/.env`:
   ```dotenv
   ADMIN_NAME=Tactyqal Admin
   ADMIN_EMAIL=you@yourdomain.com
   ADMIN_PASSWORD=<a strong, unique password>
   ```
2. Run:
   ```bash
   npm run seed:admin -w backend
   ```
   Output: `✅ Admin created: you@yourdomain.com` (idempotent — re-running is a no-op).

3. Log in at `/admin/login`.

To create additional editors:

```js
// Run in mongosh, or extend the seed script
db.users.insertOne({
  name: "Editor Name",
  email: "editor@example.com",
  password: "<bcrypt hash>",  // generate via `require('bcryptjs').hash('pw', 12)`
  role: "editor",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

**Recommended production steps:** seed via Render Shell, then remove `ADMIN_PASSWORD` from the environment.

---

## 🧪 Testing

### Automated (backend)

```bash
npm test -w backend
```

Uses `mongodb-memory-server` — no local MongoDB required. Covers:

- **Auth** (10) — happy login, wrong password, unknown email (timing-safe), missing/invalid token, refresh rotation, logout, bcrypt cost 12, plaintext never stored
- **Posts** (15) — public list excludes drafts, draft 404 public / 200 admin, category/tag/pagination/search filters, unique slug, publish/unpublish `publishedAt`, unknown category, editor ownership
- **Categories** (6) — public list, unauth rejected, create, case-insensitive duplicate, can't delete referenced, delete unused
- **Upload** (5) — unauth, valid PNG, `.pdf` rejected, >5MB rejected, no file

Expected: **36 passed, 36 total**.

### Automated (frontend)

There is no frontend test suite in this release. The trade-off: backend coverage is deep; frontend coverage relies on the manual matrix below. Adding Playwright is on the roadmap.

### Manual QA matrix

Documented in the Phase 9 test report — six sections (desktop, mobile, admin, cross-browser, accessibility, performance) with 40 checkable items, all previously passing.

### Postman

```bash
newman run postman/Tactyqal-Labs-API.postman_collection.json \
  --env-var baseUrl=http://localhost:5000/api
```

---

## 🚀 Deployment

Full instructions live in the original Phase 10 brief. Summary:

| Service | Platform | Config |
|---|---|---|
| Backend | **Render** | Uses `render.yaml` — free tier. Set `MONGODB_URI`, `CLIENT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_*` in the dashboard |
| Frontend | **Vercel** | Uses `frontend/vercel.json` — sets SPA rewrites + security headers. Set `VITE_API_URL` at build time |
| Database | **MongoDB Atlas** | M0 free tier; IP allowlist `0.0.0.0/0` (Render outbound IPs are dynamic) |
| Uploads | **Cloudinary** | Required in production (Render's disk is ephemeral) |

**Order:** Atlas → Render → Vercel. Then update `CLIENT_URL` on Render to the Vercel URL and redeploy.

**Verification gate:** the 18-item checklist in the Phase 10 brief. Do not consider deployment complete until the browser login test (#11) and image upload test (#13) pass.

**Free-tier notes:** Render spins down after 15 minutes idle; first request takes ~30–60 s. Optional keep-alive workflow at `.github/workflows/keep-alive.yml`.

---

## 🔧 Environment Variables

### Backend — `backend/.env`

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NODE_ENV` | ✓ | `development` | `development` \| `test` \| `production` |
| `PORT` | ✓ | `5000` | Render provides its own (usually `10000`) |
| `CLIENT_URL` | ✓ | `http://localhost:5173` | CORS origin, exact string, no trailing slash |
| `MONGODB_URI` | ✓ | `mongodb+srv://user:pass@cluster/tactyqal_labs` | Atlas or local |
| `JWT_SECRET` | ✓ | 64-char hex | **Min 32 chars** |
| `JWT_EXPIRES_IN` | ✓ | `15m` | Access token TTL |
| `JWT_REFRESH_SECRET` | ✓ | 64-char hex (different) | **Min 32 chars** |
| `JWT_REFRESH_EXPIRES_IN` | ✓ | `7d` | Refresh token TTL |
| `RATE_LIMIT_WINDOW_MS` | ✓ | `900000` | 15 minutes |
| `RATE_LIMIT_MAX` | ✓ | `300` | Requests per window |
| `CLOUDINARY_CLOUD_NAME` | prod | — | Leave empty in dev to use `/uploads` |
| `CLOUDINARY_API_KEY` | prod | — | |
| `CLOUDINARY_API_SECRET` | prod | — | |
| `UPLOAD_DIR` | — | `uploads` | Local dev fallback |
| `ADMIN_NAME` | seed only | `Tactyqal Admin` | Read by `seed:admin` |
| `ADMIN_EMAIL` | seed only | `admin@tactyqal.local` | |
| `ADMIN_PASSWORD` | seed only | — | Remove after seeding in production |

### Frontend — `frontend/.env`

| Variable | Required | Example | Notes |
|---|---|---|---|
| `VITE_API_URL` | ✓ | `http://localhost:5000/api` | Baked into build at compile time — **redeploy to change** |

**`.env.example` files are provided and contain no real secrets.**

---

## 📂 Project Structure

See the [Final Repository Tree](#-final-repository-tree) above for the full layout.

**Rules of thumb:**
- `frontend/src/features/<domain>/` — every page and its internal components live together
- `frontend/src/components/ui/` — reusable primitives only (no domain knowledge)
- `backend/src/controllers/` — business logic; **never** imports `req`/`res` shapes without validation first
- `backend/src/routes/` — composition only
- Nothing lives in a `utils.js` catch-all — utilities are grouped by concern

---

## ⚠️ Known Limitations

Documented honestly. These are **known** and **accepted** for the scope of this submission.

| # | Limitation | Impact | Mitigation plan |
|---|---|---|---|
| 1 | Rich-text editor uses deprecated `document.execCommand` | Works in all current browsers; future-proofing concern | Migrate to TipTap or Lexical in a future iteration — the component is isolated |
| 2 | "Insert link" uses `window.prompt` | Minimal UX | Replace with inline popover |
| 3 | No CSRF token on `/auth/refresh` | An attacker can force a refresh, but can't read the response (same-origin) | Add CSRF token if refresh semantics change |
| 4 | In-memory rate limiter store | Not shared across multi-instance deployments | Use `rate-limit-redis` for horizontal scaling |
| 5 | No password reset flow | Only seeded admins exist | Add email-based reset if the platform grows |
| 6 | Old Cloudinary assets aren't cleaned up on post delete | Orphaned storage | Add `cloudinary.uploader.destroy(publicId)` on delete |
| 7 | Frontend has no automated test suite | Manual QA covers it | Add Playwright E2E |
| 8 | No image cropping / focal-point selection | Featured images use `object-cover` | Add Cloudinary transformations |
| 9 | `escapeRegex` is ASCII-only | Unicode metacharacters pass through safely | Sufficient for current use |
| 10 | No "revoke all sessions" | Individual refresh cookies persist until expiry | Track `jti` in DB if needed |

---

## 🗺️ Roadmap

Beyond the Hire-a-thon submission:

- **Editor migration** to TipTap for a modern editing UX
- **Playwright** end-to-end tests against the deployed site
- **Redis-backed rate limiter** for horizontal scaling
- **Cloudinary cleanup** on post delete
- **Image variants** (thumbnail / hero / OG) with automatic transformations
- **Scheduled publishing** (queue + cron)
- **Multi-author workflows** (draft → review → published)
- **Full-text search** via MongoDB Atlas Search (replacing `$regex`)
- **Analytics dashboard** (post views, referrers)

---

## 📄 License

[MIT](./LICENSE) © Tactyqal Labs Full Stack Submission

The marketing copy on the homepage is derived from Tactyqal Labs' public sources and is not licensed for redistribution outside this submission.

---

## 🙏 Acknowledgments

- **Tactyqal Labs** — for the brief and the public material that grounded the redesign
- **Founder:** Partha Chakraborty
- **Frameworks and libraries** that made this possible: React, Vite, Tailwind, TanStack Query, Framer Motion, Express, Mongoose, Zod, and the rest of the stack

---

<p align="center">
  <sub>Built with ❤️ for the Tactyqal Labs Hire-a-thon · <a href="https://tactyqal.com/">tactyqal.com</a></sub>
</p>
