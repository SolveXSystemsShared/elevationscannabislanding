# Elevations247

> **Above the Rest.**
> Stellenbosch's exclusive private cannabis members club. Premium cannabis, delivered 24/7.

This is the **online store** for Elevations247 — built per `SXEC Online Store SDP.pdf` and the `Elevations247 Brand Identity` document.

---

## Stack

| Layer            | Choice                                              |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 14 (App Router) + React 18                  |
| Styling          | Tailwind CSS · shadcn-style primitives on Radix     |
| State            | Zustand (cart, session)                             |
| Forms            | React Hook Form + Zod                               |
| Auth             | Custom JWT in `httpOnly` cookies + OTP verification |
| Charts           | Recharts                                            |
| Icons            | Lucide React                                        |
| Demo data store  | In-memory module (replaceable with Prisma/Supabase) |
| Future payments  | Yoco hosted-checkout API                            |
| Future OTP       | Twilio or Africa's Talking                          |
| Future hosting   | Vercel                                              |

---

## Run locally

> Requires **Node 20 LTS** (pinned in `.nvmrc` / `.node-version` / `package.json#engines`). Next.js 14.2.x has CJS interop bugs on Node 22+.

```bash
# Use the pinned Node — pick whichever your tooling supports
nvm use                                        # if using nvm
fnm use                                        # if using fnm
PATH=/usr/local/opt/node@20/bin:$PATH npm run dev   # plain Homebrew node@20

# First-time setup
npm install
cp .env.example .env.local
# (set JWT_SECRET in .env.local)

# Dev server (auto-reload, demo data)
npm run dev          # http://localhost:3000

# Production build + run
npm run build
npm start

# Type-check
npm run typecheck
```

---

## Demo credentials

This build ships with **mock auth and an in-memory store** so the full flow is testable without external services. Replace with real Supabase + Twilio + Yoco for production (see "Going to production" below).

| Surface         | How to get in                                                                 |
| --------------- | ----------------------------------------------------------------------------- |
| Member OTP      | `123456` (visible on `/verify`)                                               |
| Existing member | Cell `0823412847` (Sasha Botha) — log in, OTP `123456`, then `/store`         |
| Admin password  | `420420`                                                                      |
| Admin OTP       | `000123`                                                                      |
| Admin email     | `admin@elevations247.co.za`                                                   |

The demo seeds 12 products, 5 members, and 5 orders in `src/lib/seed.ts`.

---

## Routes

### Public
`/` · `/register` · `/login` · `/verify` · `/legal/agreement` · `/legal/privacy` · `/admin/login`

### Members (cookie-protected)
`/store` · `/product/[id]` · `/cart` · `/checkout` · `/orders` · `/orders/[id]` · `/account`

### Admin (cookie-protected)
`/admin` · `/admin/products` · `/admin/orders` · `/admin/orders/[id]` · `/admin/members` · `/admin/members/[id]` · `/admin/reports`

### API (REST under `/api`)
- **Auth** — `register`, `login`, `verify`, `logout`, `admin/login`
- **Member** — `member/profile` (GET/PUT), `member/orders`, `member/orders/[id]`
- **Store** — `products`, `products/[id]`, `orders` (GET/POST), `orders/[id]/cancel`
- **Admin** — `admin/products` (CRUD), `admin/orders`, `admin/orders/[id]/status`, `admin/members`, `admin/members/[id]/status`, `admin/members/export`, `admin/grades`, `admin/reports/revenue`, `admin/reports/activity`

Middleware (`src/middleware.ts`) gates member and admin routes with their respective JWT cookies.

---

## Brand

| Token              | Value                                          |
| ------------------ | ---------------------------------------------- |
| Primary purple     | `#6C3FC5`                                      |
| Light / dark       | `#9B72E8` / `#3D1F8A`                          |
| Gold accent        | `#C9A961`                                      |
| Display font       | Playfair Display                               |
| Body font          | Inter                                          |
| Slogan             | *Above the Rest.*                              |
| Creative direction | *Not in your face. But in your space.*         |
| Hero video         | `/public/assets/video/landing-bg.mp4`          |

The hero plays the cinematic mountain video as a background, autoplay/loop/muted with a purple wash overlay. The age gate (`<AgeGate />` in `src/app/layout.tsx`) blocks the site until 18+ confirmation.

---

## Going to production

The current build is feature-complete for demo. To deploy for real:

1. **Database** — replace `src/lib/server/db.ts` (in-memory) with a Prisma client over the Postgres schema documented in SDP §11. Recommended host: Supabase.
2. **OTP** — wire `/api/auth/login`, `/api/auth/register`, `/api/admin/login` to Twilio (or Africa's Talking) instead of accepting the demo OTP.
3. **Payments** — replace the mock Yoco payment ID in `/api/orders` with a real Yoco hosted-checkout link + signed webhook on `/api/yoco/webhook`.
4. **Image storage** — wire `/api/admin/products` image upload to Supabase Storage. The product table has an `image_url` field ready.
5. **Env** — set every variable in `.env.example` for the target environment.
6. **Hosting** — push to Vercel; set Node version to **20** in project settings.
7. **Compliance review** — POPIA disclosures and the Membership Agreement are in place; have a SA attorney review final copy before go-live.

---

## Project layout

```
src/
├── app/
│   ├── (member)/              # cookie-protected member routes
│   │   ├── store/             # browse + filter
│   │   ├── product/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/[…]/
│   │   └── account/
│   ├── admin/
│   │   ├── login/             # standalone (no shell)
│   │   └── (authed)/          # gated by middleware
│   │       ├── page.tsx       # dashboard
│   │       ├── products/
│   │       ├── orders/[…]/
│   │       ├── members/[…]/
│   │       └── reports/
│   ├── legal/{agreement,privacy}/
│   ├── api/                   # REST endpoints (member + admin)
│   ├── layout.tsx             # mounts <AgeGate /> + <Toaster />
│   ├── page.tsx               # landing
│   └── icon.svg + apple-icon.svg
├── components/
│   ├── site/                  # site-specific (logo, nav, hero, footer, …)
│   └── ui/                    # primitives (button, dialog, …)
├── lib/
│   ├── server/{db,auth}.ts    # in-memory store + JWT helpers
│   ├── seed.ts                # demo products / members / orders
│   ├── store.ts               # zustand cart + session
│   ├── types.ts
│   └── utils.ts               # ZAR formatter, SA ID Luhn, etc.
└── middleware.ts              # gates /store, /admin, /orders, …
public/
└── assets/
    ├── video/landing-bg.mp4
    └── logo/
```

---

Built by SolveX Systems. Ref: SX-2026-04-ELV-SOP-OPS-v0.
