# Cape Comorin School (CCS) — Full Website Plan

**Tagline:** Where the Dreams are Nurtured
**Est. 2001** | Playgroup – 8th | Government Recognized, English Medium
**Location:** HIG 295, Ratan Lal Nagar, Kanpur
**Phone:** +91 9839474191
**Email:** ccs.nurturedreams@gmail.com

---

## 1. Architecture

```
Next.js frontend (public site + admin.capecomorinschool.com)
        ↓ (only talks to)
Flask backend (CCS-specific, new build)
        ↓ (proxies to, when needed)
Vritukul (FastAPI, already deployed on Render) — students, TC generation, records
```

**Key principles:**
- Vritukul stays completely untouched. It's a separate, already-deployed product (Cape Comorin is customer #1; long-term it becomes a sellable multi-tenant API for other UP Board schools).
- Flask is the *only* backend the frontend ever talks to. It owns CCS-specific logic (fees, notices, calendar, teachers) and internally proxies to Vritukul for anything records-related (students, TCs, register uploads). This keeps the frontend clean and Vritukul fully decoupled.
- Admin panel lives on its own subdomain: `admin.capecomorinschool.com`.

---

## 2. Public Website — Pages

1. **Home**
   - Hero (school name, tagline, CTA to Admissions)
   - Quick facts strip (Est. 2001, Playgroup–8th, English Medium, Govt. Recognized)
   - Principal's Message teaser
   - Admissions Open banner
   - Notice Board preview (latest 3-4 notices, link to full board)
   - Upcoming academic calendar events (next few)
   - CTA to Fee Payment

2. **About**
   - History (25+ years of legacy — no exact founding narrative beyond ESTD 2001 in footer/badge)
   - Mission & Vision (built around "Where the Dreams are Nurtured")
   - Principal's Message (Chitranshi Shukla)
   - Management/Trust info

3. **Academics**
   - Playgroup to 8th, English medium
   - Curriculum philosophy, teaching approach
   - Note: board affiliation (UP Board) intentionally **not featured** in public copy — positioning choice to avoid it being misread as unfamiliar/lesser vs. CBSE. Not hidden dishonestly, just not headlined.

4. **Admissions**
   - Process, eligibility, "Admissions Open" CTA
   - Enquiry form → Flask backend

5. **Faculty**
   - Staff directory (managed via admin panel's Teacher module)

6. **Gallery**
   - Campus/event photos (placeholder until real photos supplied)

7. **Academic Calendar**
   - List/timeline view (not calendar-grid) — holidays, exams, events, PTMs, term dates
   - Auto-seeded national/govt holidays (via holidays API) + admin-added school-specific entries
   - Reflects live from admin panel edits

8. **Notice Board**
   - Chronological list of notices, each a viewable PDF (click to view inline, no forced download)
   - Admin can upload PDF or DOCX; DOCX auto-converted to PDF via conversion API on upload

9. **Fee Payment**
   - Razorpay integration using **test key** (demo-level, no real transaction tracking required for v1)

10. **Contact**
    - Address, phone, email, embedded map, contact form → Flask backend
    - Social media links (from old static page) added later

---

## 3. Admin Panel — `admin.capecomorinschool.com`

- **Login** — Firebase Auth, role-gated (reuses Vritukul's existing auth pattern conceptually, but is CCS's own gate)
- **Dashboard** — overview at a glance
- **Teachers** — full CRUD; new module, not part of Vritukul (Vritukul is students/TC only)
- **Student Records** — search/view/edit/TC generation, proxied through Flask to Vritukul
- **Register Upload** — upload scanned register PDFs, proxied to Vritukul's AI extraction pipeline
- **Notice Board Manager** — upload PDF/DOCX (auto-converted to PDF), publish/unpublish, delete
- **Academic Calendar Manager** — add/edit/delete entries; national holidays auto-seeded, rest manual
- **Fee Records** — demo-level log of test transactions (no real accounting in v1)

---

## 4. Technical Decisions

| Area | Decision |
|---|---|
| Frontend | Next.js (single codebase for public site + admin panel) |
| Backend (CCS) | Flask — new, separate from Vritukul |
| Records backend | Vritukul (FastAPI, already live on Render) — accessed only via Flask proxy |
| Admin subdomain | `admin.capecomorinschool.com` |
| Auth | Firebase (admin panel login) |
| Fee payment | Razorpay — test key, demo scope only for v1 |
| Notice storage | PDF/DOCX uploads; DOCX converted to PDF via conversion API (e.g. CloudConvert) before storage |
| File storage | Separate Cloudinary account for CCS (decoupled from Vritukul's storage/billing) — to confirm |
| Academic calendar | List/timeline view; national holidays auto-seeded via holidays API, school-specific entries manual |
| CI/CD | GitHub Actions (`.github/workflows/ci.yml`) for automated lint, typecheck, and build verification on push/PR; Vercel for CD preview and production deployments |

---

## 5. Content Guidelines

- No exact founding narrative beyond "ESTD 2001" (shown subtly — footer/badge), homepage copy uses "25+ years of legacy"
- Playgroup to 8th (not Nursery)
- UP Board affiliation: real, but not featured in marketing copy
- No awards/achievements section — positioning is "real, hard-earned education," not trophy-driven
- Tone: warm, genuine, grounded — not a copy-paste of competitor sites (e.g. Chintels School was used as a structural reference, not a template to clone)
- Logo: supplied by site owner, placed at `public/logo.png`

---

## 6. Folder Structure

Two repos, full stop: **capecomorin-frontend** and **capecomorin-backend**. Each deploys independently (frontend → Vercel, backend → Render), each has its own git history, own env vars, own CI.

Vritukul is not a repo in this project. It's an already-deployed URL that capecomorin-backend calls over HTTP, same as it would call Razorpay or CloudConvert. It doesn't get a folder, a submodule, or a mention anywhere except one config value (its base URL + API key) and one client file that wraps calls to it.

### capecomorin-frontend

```
capecomorin-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions: lint, typecheck, build
├── app/
│   ├── (public)/                 # public-facing routes
│   │   ├── page.tsx              # Home
│   │   ├── about/
│   │   ├── academics/
│   │   ├── admissions/
│   │   ├── faculty/
│   │   ├── gallery/
│   │   ├── calendar/             # academic calendar (list view)
│   │   ├── notices/              # notice board
│   │   ├── fees/                 # Razorpay demo payment
│   │   └── contact/
│   ├── (admin)/                  # admin panel routes — gated to admin.capecomorinschool.com
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── teachers/
│   │   ├── students/             # search/view/edit/TC
│   │   ├── registers/            # PDF upload → AI extraction
│   │   ├── notices/              # upload/manage notices
│   │   ├── calendar/             # manage calendar entries
│   │   └── fees/                 # demo transaction log
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── public/                   # hero, notice card, calendar item, etc.
│   └── admin/                    # tables, forms, sidebar, etc.
├── lib/
│   ├── api.ts                    # single client for capecomorin-backend — the ONLY backend this app talks to
│   └── auth.ts                   # Firebase client-side auth helpers
├── public/
│   └── logo.png
├── middleware.ts                 # subdomain routing: admin.* → (admin) route group
├── next.config.js
├── package.json
└── .env.local
```

### capecomorin-backend

```
capecomorin-backend/
├── app/
│   ├── __init__.py               # app factory
│   ├── config.py
│   ├── extensions.py
│   ├── routes/
│   │   ├── teachers.py           # CRUD — owned entirely by this backend
│   │   ├── students.py           # calls out to Vritukul
│   │   ├── registers.py          # calls out to Vritukul
│   │   ├── notices.py            # upload, convert, list, delete
│   │   ├── calendar.py           # CRUD + auto-seed holidays
│   │   ├── fees.py               # Razorpay order create/verify (test)
│   │   ├── contact.py            # contact/admission enquiry forms
│   │   └── auth.py               # admin login/session
│   ├── services/
│   │   ├── vritukul_client.py    # thin HTTP wrapper around Vritukul's API — only file that knows it exists
│   │   ├── cloudinary_client.py  # CCS's own Cloudinary account
│   │   ├── docx_convert.py       # CloudConvert wrapper
│   │   ├── holidays.py           # national holidays auto-seed
│   │   └── razorpay_client.py
│   ├── models/
│   │   ├── teacher.py
│   │   ├── notice.py
│   │   ├── calendar_event.py
│   │   └── fee_transaction.py
│   ├── db.py
│   └── firebase.py               # verifies admin panel JWTs
├── firebase-key.json             # not committed
├── .env                          # not committed, includes VRITUKUL_BASE_URL + VRITUKUL_API_KEY
├── requirements.txt
└── run.py
```

**Notes:**
- `(public)` and `(admin)` are Next.js route groups — `middleware.ts` decides which loads based on subdomain, so it's still one deployable frontend app.
- Vritukul's entire footprint in this codebase is two env vars and `vritukul_client.py`. Nothing else in either repo needs to know it exists.

---

## 7. Open / To-Confirm

- [ ] Cloudinary: separate CCS account vs. shared with Vritukul (leaning separate)
- [ ] DOCX→PDF conversion API choice: CloudConvert (free tier, ~25/day) vs. Cloudmersive vs. Adobe PDF Services (leaning CloudConvert)
- [ ] Old static page content/social links — to be retrieved and merged in
- [ ] Real gallery photos — pending
- [ ] Homepage section-by-section layout — not yet sketched (next step when ready)

---

*Plan compiled from a scoping conversation. No code has been written yet — this is the locked-in v1 scope to build against.*