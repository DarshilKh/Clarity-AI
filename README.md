# Clarity — AI Decision Assistant

> Remove emotional bias from your biggest decisions using AI-powered rational thinking frameworks.

---

## Tech Stack

| Layer      | Technology                                     |
|------------|------------------------------------------------|
| Framework  | **Next.js 16.2.4** (App Router)                |
| UI         | **React 19.2.5** + Tailwind CSS v4             |
| State      | **Zustand 5**                                  |
| Animation  | **Framer Motion 12**                           |
| AI         | **Groq API** (llama-3.3-70b-versatile)         |
| Database   | **Supabase** (PostgreSQL + JSONB)              |
| Hosting    | **Vercel** or **Netlify** (serverless)         |
| Language   | **TypeScript 5.8** (strict mode)               |
| Node       | **>=20** (tested on Node 24)                   |

---

## Project Structure

```
clarity/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # POST — Groq AI analysis (serverless)
│   │   ├── decisions/
│   │   │   ├── route.ts              # GET list / POST save decision
│   │   │   └── [id]/route.ts         # PATCH — record chosen option
│   │   └── track/route.ts            # POST — save outcome check-in
│   ├── dashboard/page.tsx            # Dashboard with stats
│   ├── decision/
│   │   ├── new/page.tsx              # 4-step wizard
│   │   └── [id]/page.tsx             # Decision detail + outcome tracker
│   ├── journal/page.tsx              # Searchable full history
│   ├── globals.css                   # Tailwind v4 CSS-first design tokens
│   ├── layout.tsx                    # Root layout + fonts
│   └── page.tsx                      # Landing page
│
├── components/
│   ├── decision/
│   │   ├── StepBasics.tsx            # Wizard step 1 — basics
│   │   ├── StepOptions.tsx           # Wizard step 2 — options builder
│   │   ├── StepContext.tsx           # Wizard step 3 — context & fears
│   │   ├── AnalysisResults.tsx       # Full AI analysis display
│   │   ├── OutcomeTracker.tsx        # 30/90/180-day check-ins
│   │   └── DecisionCard.tsx          # Card for lists
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/
│       └── Toasts.tsx
│
├── lib/
│   ├── analyze.ts                    # Groq prompt + analysis logic
│   ├── groq.ts                       # Groq client factory
│   ├── supabase.ts                   # Supabase client (client + server)
│   └── utils.ts                      # cn(), formatDate(), helpers
│
├── store/
│   └── index.ts                      # Zustand stores (wizard, journal, toasts)
│
├── types/
│   └── index.ts                      # All TypeScript types
│
├── supabase/
│   └── schema.sql                    # Full DB schema — run once in Supabase
│
├── .env.local.example                # Copy to .env.local and fill in
├── vercel.json                       # Vercel deployment config
└── netlify.toml                      # Netlify deployment config
```

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd clarity
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. Copy your project URL and keys from **Project Settings → API**

### 4. Get a Groq API key

1. Go to [console.groq.com](https://console.groq.com)
2. Create an API key (free tier is generous)
3. The app uses `llama-3.3-70b-versatile` — fast and accurate

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Deploy to Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Then add your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --build
```

Add env vars in **Netlify → Site → Environment variables**.

> **All API routes are serverless functions** — no server to manage. They cold-start on demand on both Vercel and Netlify.

---

## AI Frameworks Applied

| Framework              | What it does                                                     |
|------------------------|------------------------------------------------------------------|
| **Expected Value**     | Scores each option 0–100 as a composite of weighted factors      |
| **Pre-Mortem**         | Imagines best, worst, and most-likely scenarios 12 months out    |
| **WRAP Model**         | Widen options, Reality-check, Attain distance, Prepare to fail   |
| **Bias Detection**     | Finds anchoring, sunk cost, status quo bias and more             |
| **Second-Order Thinking** | Maps downstream consequences beyond the immediate effect      |

---

## Roadmap

- [x] Decision intake wizard (4 steps)
- [x] Groq AI multi-framework analysis
- [x] Cognitive bias detector
- [x] Pre-mortem analysis
- [x] Decision journal with search & filters
- [x] Outcome tracking (30/90/180 days)
- [x] Supabase persistence
- [ ] Supabase Auth (email + Google OAuth)
- [ ] Stripe freemium gating (3 decisions/month free, $9/mo Pro)
- [ ] Email reminders for outcome check-ins
- [ ] Advisor Mode — share decision frame with a trusted person
- [ ] Bias profile — personalized patterns built from history
- [ ] Charts & insights on journal page
- [ ] PWA / mobile optimization
- [ ] iOS & Android native app

---

## Design System

The app uses a warm editorial palette inspired by aged paper and amber light — calm, trustworthy, and focused.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-ink` | `#0d0d0d` | Primary text |
| `--color-surface` | `#f5f2ed` | Page background |
| `--color-amber` | `#c8860a` | Primary accent, CTAs |
| `--color-sage` | `#3d6b5e` | Success, positive |
| `--color-rose` | `#b83a40` | Risk, warnings |
| `--font-display` | Playfair Display | Headings |
| `--font-body` | DM Sans | Body text |
| `--font-mono` | DM Mono | Numbers, scores |
