# Ngaris Managed — Architecture

Supabase-first architecture for Ngaris Managed on Next.js 16 (App Router).

## System overview

```text
┌──────────────────────────────┐
│  Vercel — Next.js App Router │
│  Landing · Dashboards · API  │
└──────────────┬───────────────┘
               │ @supabase/ssr + supabase-js
┌──────────────▼───────────────┐
│           Supabase           │
│  Auth · PostgreSQL · RLS     │
│  Storage · Realtime · Edge   │
└──────────────┬───────────────┘
               │
     ┌─────────┴──────────┐
     │ Resend │ WhatsApp  │
     └────────────────────┘
```

## Next.js + Supabase clients

| Module | Runtime | Key | Purpose |
| --- | --- | --- | --- |
| `src/lib/supabase/client.ts` | Browser | Publishable | Client Components, Realtime |
| `src/lib/supabase/server.ts` | Server | Publishable + cookies | RSC, Server Actions, Route Handlers |
| `src/lib/supabase/admin.ts` | Server only | Secret | Privileged ops (e.g. lead insert); `server-only` |
| `src/lib/supabase/proxy.ts` | Proxy | Publishable | Session refresh via `getClaims()` |
| `src/proxy.ts` | Next.js 16 Proxy | — | Invokes `updateSession` |

Session refresh uses the Next.js 16 **Proxy** convention (`proxy.ts`), not legacy `middleware.ts`.

The secret key (`SUPABASE_SECRET_KEY`) must never appear in client bundles.

## Database

- PostgreSQL managed by Supabase
- Schema changes via `supabase/migrations/*.sql`
- UUID PKs, FKs, indexes, checks, unique constraints, timestamps
- Money: `NUMERIC(18,2)` (or higher precision where required)
- Types: `src/lib/supabase/database.types.ts` (regenerate with `npm run db:types`)

### Progressive table plan

Create in dependency order across phases — not one uncontrolled migration.

1. Identity: `profiles`, `roles`, `permissions`, `user_roles`, `role_permissions`
2. CRM: `leads`, `clients`, `properties`, …
3. Projects, contractors, site ops, procurement, finance, platform tables as listed in the development plan

`profiles.id` references `auth.users.id`. No separate password table.

### Phase 1 schema

`public.leads` with RLS enabled and **force** RLS. No policies for `anon` / `authenticated` (default deny). Inserts use the admin client from `POST /api/leads`.

## Authentication (Phase 2+)

- Email/password, verification, reset, optional magic link
- MFA for privileged users
- Auto-create profile on authorized user creation
- Controlled role assignment; role-based dashboard routing
- Public registration must not grant administrative privileges

## Row Level Security

- Enable RLS on every application table exposed through the API
- Explicit SELECT / INSERT / UPDATE / DELETE policies; default deny
- Clients → own projects and approved customer-facing artifacts only
- Contractors → assigned work orders / authorized records
- Supervisors / PMs / finance / inspectors → assigned scope only
- No self-escalation of roles; no self-approval of unauthorized financial requests
- `SECURITY DEFINER` helpers: restricted execute grants + fixed `search_path`

## Storage

Private buckets: `project-photos`, `project-videos`, `project-documents`, `client-documents`, `contractor-documents`, `contracts`, `invoices`, `inspection-reports`, `handover-documents`.

Public: `public-assets` for approved marketing assets only.

Paths encode resource IDs; **authorization must validate database permissions**, not path shape alone. Private files via expiring signed URLs.

## Realtime

Enable selectively: project status, milestones, approved progress reports, messages, notifications, approval queues, dashboard activity. Subscriptions must respect RLS. Unsubscribe on unmount. Never broadcast confidential finance on public channels.

## Financial transaction architecture

Authorized server functions + transactional PostgreSQL RPCs for budget / PO / milestone / payment / journal / reconciliation / variation flows. Idempotency, concurrency controls, balanced journals, immutability of posted entries (reversals for corrections).

## Edge Functions (later)

`send-whatsapp-notification`, `whatsapp-webhook`, `send-email-notification`, `generate-weekly-project-report`, `invoice-reminder`, `milestone-notification`, `contractor-document-expiry`, `project-risk-alert`.

Validate authz, verify webhook signatures, retries + delivery logs + idempotency, secrets via Supabase secrets.

## Lead capture (Phase 1)

```text
Consultation form → Zod validate → rate limit + honeypot
  → POST /api/leads → admin client insert into leads
  → notify admins (Resend when configured)
```

Public clients cannot SELECT or INSERT leads through the Data API.

## Environment

See `.env.example`. Required for lead capture: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.

## Hosting

Application on Vercel. Supabase Cloud for managed Postgres, Auth, Storage, Realtime, and Edge Functions.
