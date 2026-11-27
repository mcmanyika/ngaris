# Ngaris Construction — Development Plan

Master plan for the Ngaris Construction platform. Firebase is the primary backend. Business requirements, landing design, workflows, financial controls, roles, dashboards, and construction management scope from earlier planning are retained.

## Product summary

Ngaris Construction helps diaspora and local clients identify verified service providers in Zimbabwe, select the right team together, and manage construction and property projects from anywhere — with verified progress, controlled spend, and clear approvals.

## Technology stack

| Layer | Choice |
| --- | --- |
| App framework | Next.js App Router + TypeScript |
| UI | Tailwind CSS, shadcn/ui, Lucide React |
| Forms / charts | React Hook Form, Zod, Recharts |
| Database | Cloud Firestore |
| Auth | Firebase Authentication |
| Files | Cloud Storage for Firebase |
| Live updates | Firestore listeners |
| Authorization | Firestore Security Rules + custom claims |
| Messaging | WhatsApp Business Cloud API |
| Email | Resend |
| Hosting | Vercel |
| AI assistant | OpenAI (server-side chat API) |

**Out of scope for the initial architecture:** Prisma, Auth.js, Supabase, and a separate object storage provider.

Official packages: `firebase`, `firebase-admin`.

## Brand (landing)

- Primary navy: `#032842` / `#022848`
- Gold accent: `#EDB254`
- Headline: **Build in Zimbabwe. Manage from Anywhere.**

Landing: navigation, hero, how-it-works strip, core features, diaspora CTA, consultation modal, about page, OpenAI assistant, footer.

## User roles

`SUPER_ADMIN`, `EXECUTIVE_CHAIR`, `MANAGING_DIRECTOR`, `TECHNOLOGY_DIRECTOR`, `PROJECT_MANAGER`, `FINANCE_OFFICER`, `SITE_SUPERVISOR`, `CLIENT_RELATIONS`, `CONTRACTOR`, `INDEPENDENT_INSPECTOR`, `CLIENT`.

Users may hold multiple roles (Firebase custom claims + Firestore profile docs). Users cannot modify their own roles or permissions. Technical administrators do not automatically receive financial approval authority.

## Domain modules (retained)

1. **Identity** — profiles linked to Firebase Auth UIDs, roles, permissions
2. **CRM** — leads, clients, properties, consultations, quotations
3. **Projects** — members, contracts, milestones, tasks, risks, variations, status history
4. **Contractors** — trades, documents, verifications, subcontracts, work orders, reviews
5. **Site ops** — reports, media, inspections, defects, corrective actions, safety
6. **Procurement** — suppliers, materials, POs, goods received
7. **Finance** — budgets, invoices, payments, approvals, ledger, reconciliation
8. **Platform** — documents, notifications, conversations, WhatsApp, audit logs, settings

## Financial controls (non-negotiable)

- Sensitive money movements run through authorized server-side paths (Admin SDK / Cloud Functions)
- Approval rules enforced in transactional server logic
- Idempotency keys and concurrency controls
- Balanced journal entries; posted transactions immutable (use reversing entries)
- Payment authorization separate from payment execution
- Customer deposits are not earned revenue
- No independent escrow or unlicensed payment services

## Development phases

### Phase 1 — Foundation & landing (current)

- Initialize Next.js, Tailwind, shadcn/ui
- Configure Firebase clients (browser, Admin, session proxy stub)
- Public landing + about page
- Firestore `leads` + secure consultation capture
- Docs and `.env.example`

### Phase 2 — Auth, RBAC, CRM admin

- Firebase Auth (email/password, verification, reset, optional magic link, MFA for privileged users)
- Profiles, roles via custom claims + Firestore
- Admin dashboard shell + CRM / client management
- Controlled invitations; public registration never grants admin privileges

### Phase 3 — Projects, contractors, site ops, storage

- Project management, milestones, site reports, inspections
- Contractor management
- Private Cloud Storage paths + signed URLs

### Phase 4 — Procurement & finance

- Procurement flows
- Budgets, invoices, payments, approvals, ledger, reconciliation
- Financial control tests

### Phase 5 — Portals & integrations

- Client portal + contractor portal
- Selective Firestore listeners, notifications
- WhatsApp + email jobs (Next.js routes and/or Cloud Functions)

### Phase 6 — Hardening & production

- Authorization / rules / finance / responsive / security review
- Production deployment preparation

## Development rules

- Inspect existing code before changing it; preserve working behavior
- Strongly typed Firebase access; document collection shapes in code
- Never hardcode credentials; never expose Admin credentials to the browser
- Never loosen Firestore rules to “fix” access errors
- Fictional seed data only in development
- Run lint, typecheck, tests, and production builds
- Ask for approval before starting the next major phase

## Phase gate

**Stop after Phase 1.** Present an implementation summary and obtain approval before authentication and administration work.
