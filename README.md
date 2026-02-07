# MSP+ 3Cs Assessment

A web application for evaluating people across three dimensions: **Culture**, **Competence**, and **Commitment**. Generates individual PDF reports and sends results via email.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL + Storage)
- **Email:** Resend
- **PDF:** @react-pdf/renderer
- **Deployment:** Vercel

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g., `http://localhost:3000` for dev) |

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the **SQL Editor** and run the migration script:
   - File: [`supabase/migration.sql`](supabase/migration.sql)
3. Create a storage bucket:
   - Go to **Storage** in the Supabase dashboard
   - Create a new bucket named `3cs-pdfs`
   - Set it as **private** (not public)

### 4. Set up Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. For production, verify your sending domain
4. For development, Resend allows sending to your own email from `onboarding@resend.dev`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Run tests

```bash
npm test
```

## Supabase Schema

Three tables are used:

- **assessments** — one row per assessment session (assessor email, session token)
- **assessment_people** — one row per scored person (scores, rating, grade)
- **pdf_artifacts** — one row per generated PDF (storage path reference)

See [`supabase/migration.sql`](supabase/migration.sql) for the full schema.

## Scoring Logic

```
FinalRating = Culture(1-10) × Competence(1-5) × Commitment(1-3) × (2/3)
```

- Rounded to nearest integer (Math.round)
- Maximum score: 100 (10 × 5 × 3 × 2/3)
- If any input is missing, rating is blank

### Grade Mapping

| Grade | Condition | Guidance |
|-------|-----------|----------|
| A+ | > 89 | Strong fit, high confidence |
| A | > 70 | Solid fit, likely succeed with normal coaching |
| B | > 50 | Moderate fit, investigate gaps |
| C | > 30 | Risky fit, address issues first |
| D | ≤ 30 | Poor fit, do not place in critical roles |

## Deployment to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

The app uses `maxDuration = 60` on the assessment API route to accommodate PDF generation for up to 25 people.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── assess/page.tsx             # Assessment page
│   ├── assess/complete/page.tsx    # Submission confirmation
│   ├── history/[token]/page.tsx    # History/results page
│   └── api/assessments/            # API routes
├── lib/
│   ├── scoring.ts                  # Rating + grade computation
│   ├── guidance.ts                 # Narrative guidance (centralized)
│   ├── validation.ts               # Zod schemas
│   ├── pdf.tsx                     # PDF template
│   ├── email.ts                    # Email HTML template
│   ├── email-sender.ts             # Resend integration
│   └── supabase.ts                 # Supabase clients
├── components/
│   ├── assessment/                 # Assessment form components
│   ├── ui/                         # Reusable UI (slider, badge)
│   ├── layout/                     # Header, footer
│   └── brand/                      # Logo component
└── __tests__/
    └── scoring.test.ts             # Unit tests
```

## Security Notes (v1)

- **No authentication.** Anyone with the assessment link can use the app.
- **History access** uses unguessable UUID tokens — effectively a 128-bit secret shared only via email.
- **PDFs** are served via time-limited signed URLs (1-hour expiry) from Supabase Storage.
- **No enumeration** — there is no endpoint to list all assessments.
- v2 should add authentication and email verification.

## Branding

Brand colors and logo are configured in:
- Colors: `src/app/globals.css` (CSS custom properties under `@theme`)
- Logo: `public/logo.png` (replace with your logo file)
- Logo component: `src/components/brand/logo.tsx`

Current brand colors:
- Primary: `#000033` (deep navy)
- Blue: `#0071BD`
- Green: `#4BAA42`
