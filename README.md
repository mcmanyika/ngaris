# Ngaris Managed

Construction management platform for Zimbabwe builds — verified progress, financial controls, and diaspora-ready tracking.

> **Headline:** Build in Zimbabwe. Manage from Anywhere.

## Stack

- **Next.js 16** App Router · TypeScript · Tailwind CSS · shadcn/ui
- **Supabase** PostgreSQL, Auth, Storage, Realtime, Edge Functions, RLS
- **React Hook Form** · Zod · Recharts · Lucide
- **Resend** · WhatsApp Business Cloud API · **Vercel**

Prisma, Auth.js, Firebase, and separate object storage are intentionally excluded from the initial architecture.

## Documentation

| Doc | Purpose |
| --- | --- |
| [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | Product scope, phases, rules |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Supabase-first system design |
| [TASKS.md](./TASKS.md) | Phase checklist |
| [.env.example](./.env.example) | Required environment variables |

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY
```

### Local Supabase (optional, requires Docker)

```bash
npm run db:start
# Apply migrations via supabase db reset / migration up
npm run db:types
```

### App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality gates

```bash
npm run lint
npm run typecheck
npm run build
```

## Phase 1 status

Completed in-repo:

- Supabase client utilities + Next.js 16 proxy session refresh
- Public landing page with brand system
- `leads` migration (RLS default deny)
- Secure consultation endpoint (`POST /api/leads`)

To persist leads end-to-end, configure a Supabase project, apply `supabase/migrations`, and set env vars. Never expose `SUPABASE_SECRET_KEY` to the browser.

## Security notes

- Privileged clients live in server-only modules (`admin.ts`)
- Lead records are not readable via public Supabase policies
- Rate limiting + honeypot on public lead submission
- Ask for approval before Phase 2 (authentication & administration)
