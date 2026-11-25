# Ngaris Managed — Development Plan

Master plan for the Ngaris Managed construction management platform. Supabase is the primary backend. Business requirements, landing design, workflows, financial controls, roles, dashboards, and construction management scope from earlier planning are retained.

## Product summary

Ngaris Managed delivers accountable construction oversight for Zimbabwe builds — especially diaspora owners who need verified progress, controlled spend, and clear approvals without standing on site every week.

## Technology stack

| Layer | Choice |
| --- | --- |
| App framework | Next.js App Router + TypeScript |
| UI | Tailwind CSS, shadcn/ui, Lucide React |
| Forms / charts | React Hook Form, Zod, Recharts |
| Database | Supabase PostgreSQL |
| Auth | Supabase Authentication |
| Files | Supabase Storage |
| Live updates | Supabase Realtime |
| Server jobs | Supabase Edge Functions |
| Authorization | Supabase Row Level Security |
| Messaging | WhatsApp Business Cloud API |
| Email | Resend |
| Hosting | Vercel |

**Out of scope for the initial architecture:** Prisma, Auth.js, Firebase, and a separate object storage provider.

Official packages: `@supabase/supabase-js`, `@supabase/ssr`.

## Brand (landing)

- Primary navy: `#15334A`
- Dark navy: `#0D2536`
- Gold accent: `#C49A55`
- Background: `#F8FAFC`
- Headline: **Build in Zimbabwe. Manage from Anywhere.**

Landing sections: navigation, hero, services, how it works, digital tracking preview, diaspora, why Ngaris, FAQ, consultation form, footer.

## User roles

`SUPER_ADMIN`, `EXECUTIVE_CHAIR`, `MANAGING_DIRECTOR`, `TECHNOLOGY_DIRECTOR`, `PROJECT_MANAGER`, `FINANCE_OFFICER`, `SITE_SUPERVISOR`, `CLIENT_RELATIONS`, `CONTRACTOR`, `INDEPENDENT_INSPECTOR`, `CLIENT`.

Users may hold multiple roles. Users cannot modify their own roles or permissions. Technical administrators do not automatically receive financial approval authority.

## Domain modules (retained)

1. **Identity** — profiles linked to `auth.users`, roles, permissions
2. **CRM** — leads, clients, properties, consultations, quotations
3. **Projects** — members, contracts, milestones, tasks, risks, variations, status history
4. **Contractors** — trades, documents, verifications, subcontracts, work orders, reviews
5. **Site ops** — reports, media, inspections, defects, corrective actions, safety
6. **Procurement** — suppliers, materials, POs, goods received
7. **Finance** — budgets, invoices, payments, approvals, ledger, reconciliation
8. **Platform** — documents, notifications, conversations, WhatsApp, audit logs, settings

## Financial controls (non-negotiable)

- Sensitive money movements run through authorized server-side / transactional RPC paths
- Approval rules enforced inside database transactions
- Idempotency keys and concurrency controls
- Balanced journal entries; posted transactions immutable (use reversing entries)
- Payment authorization separate from payment execution
- Customer deposits are not earned revenue
- No independent escrow or unlicensed payment services

## Development phases

### Phase 1 — Foundation & landing (current)

- Initialize Next.js, Tailwind, shadcn/ui
- Configure Supabase clients (browser, server, admin, proxy)
- Public landing page
- Leads migration + secure consultation capture
- Docs and `.env.example`

### Phase 2 — Auth, RBAC, CRM admin

- Supabase Auth (email/password, verification, reset, optional magic link, MFA for privileged users)
- Profiles, roles, permissions, RLS
- Admin dashboard shell + CRM / client management
- Controlled invitations; public registration never grants admin privileges

### Phase 3 — Projects, contractors, site ops, storage

- Project management, milestones, site reports, inspections
- Contractor management
- Private storage buckets + signed URLs

### Phase 4 — Procurement & finance

- Procurement flows
- Budgets, invoices, payments, approvals, ledger, reconciliation
- Financial control tests

### Phase 5 — Portals & integrations

- Client portal + contractor portal
- Realtime (selective), notifications
- WhatsApp + email edge functions / jobs

### Phase 6 — Hardening & production

- Authorization / RLS / finance / responsive / security review
- Production deployment preparation

## Development rules

- Inspect existing code before changing it; preserve working behavior
- Strongly typed Supabase queries; regenerate types after schema changes
- Version-controlled SQL migrations only (no Prisma)
- Never hardcode credentials; never expose secret keys to the browser
- Never disable RLS to “fix” access errors
- Fictional seed data only in development
- Run lint, typecheck, tests, and production builds
- Ask for approval before starting the next major phase

## Phase gate

**Stop after Phase 1.** Present an implementation summary and obtain approval before authentication and administration work.
