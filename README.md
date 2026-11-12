# Cape Comorin Children School — Frontend

Frontend for Cape Comorin Children School's website (`capecomorinschool.com`) and admin panel (`admin.capecomorinschool.com`). One Next.js codebase, subdomain-routed.

**Private repository — proprietary.** Not open source. Not licensed for reuse, forking, or redistribution outside this project.

---

## Contents

- [Stack](#stack)
- [Quickstart](#quickstart)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Routing](#routing)
- [Admin Panel](#admin-panel)
- [Related Repos](#related-repos)
- [Deployment](#deployment)
- [Ownership](#ownership)

---

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Firebase Auth (admin panel login)
- Vercel (hosting)

---

## Quickstart

```bash
git clone <repo-url>
cd capecomorin-frontend
npm install
cp .env.example .env.local   # fill in values, see below
npm run dev
```

Public site → `http://localhost:3000`
Admin panel (local) → `http://admin.localhost:3000` (or the dev override in `middleware.ts` if set)

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of `capecomorin-backend` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase (admin login) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase (admin login) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase (admin login) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase (admin login) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay test key (v1 = demo scope only) |

Never commit `.env.local`. Get real values from the project owner.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Lint codebase |

---

## Folder Structure

```
capecomorin-frontend/
├── app/
│   ├── (public)/      # home, about, academics, admissions, faculty,
│   │                  # gallery, calendar, notices, fees, contact
│   ├── (admin)/       # login, dashboard, teachers, students, registers,
│   │                  # notices, calendar, fees
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── public/
│   └── admin/
├── lib/
│   ├── api.ts         # single client for capecomorin-backend
│   └── auth.ts        # Firebase auth helpers
├── public/logo.png
├── middleware.ts       # subdomain routing: admin.* → (admin)
└── package.json
```

---

## Routing

`middleware.ts` checks the request host and rewrites to the matching route group:

- `capecomorinschool.com` → `(public)`
- `admin.capecomorinschool.com` → `(admin)`

Admin routes are additionally gated by a Firebase session check at the layout level — subdomain alone is not the access boundary.

---

## Admin Panel

| Module | Purpose |
|---|---|
| Teachers | CRUD for the public Faculty page |
| Notices | Upload (PDF/DOCX → auto-converted to PDF), publish/unpublish, delete |
| Calendar | Add/edit/delete; national holidays auto-seeded, rest manual |
| Students | Search/view/edit/TC generation (proxied to Vritukul via backend) |
| Registers | Upload scanned registers for AI extraction (proxied to Vritukul) |
| Fees | Demo log of test Razorpay transactions (not real accounting in v1) |

All requests go through `lib/api.ts` → `capecomorin-backend`, authenticated with a Firebase token. This app never calls Vritukul, Cloudinary, Razorpay, or CloudConvert directly.

---

## Related Repos

- `ccs-backend` — Flask API (owns all business logic, proxies to Vritukul)
- `vritukul-backend` — FastAPI records service for student search and AI register extraction

The browser talks only to `ccs-backend`. Student and register operations are
forwarded by that backend to the independently deployed Vritukul service; the
Vritukul service key is never exposed in this frontend.

---

## Deployment

Hosted on Vercel. `capecomorinschool.com` and `admin.capecomorinschool.com` point to the same deployment; `middleware.ts` splits traffic. Production env vars are set in Vercel project settings, not in the repo.

The production system has three separate boundaries:

1. This Next.js application on Vercel for public pages and the admin panel.
2. `ccs-backend` on Render for Firebase-authenticated school operations,
   notices, calendar, teachers, fees, and proxying.
3. Vritukul on Render for Turso-backed student records and Gemini-powered
   register ingestion.

---

## Ownership

Built and maintained for Cape Comorin Children School, Kanpur.
📧 ccs.nurturedreams@gmail.com · 📞 +91 9839474191

Engineering contact: project owner. Not externally maintained.