# Ngaris Managed — Tasks

Track progress by phase. Ask for approval before starting the next major phase.

## Phase 1 — Foundation & landing

- [x] Initialize Next.js App Router (TypeScript, Tailwind)
- [x] Configure shadcn/ui + Lucide
- [x] Install Supabase / form / chart dependencies
- [x] `npx supabase init`
- [x] Create `lib/supabase` clients (`client`, `server`, `admin`, `proxy`, `database.types`)
- [x] Next.js 16 `src/proxy.ts` session refresh
- [x] `.env.example`
- [x] Update `DEVELOPMENT_PLAN.md`, `ARCHITECTURE.md`, `TASKS.md`, `README.md`
- [x] Leads SQL migration + RLS default deny
- [x] Landing page (nav, hero, services, how it works, tracking, diaspora, why, FAQ, form, footer)
- [x] Secure `POST /api/leads` (Zod, rate limit, honeypot, admin insert, notify stub)
- [ ] Apply migration to a Supabase project / local stack (requires Docker or remote project)
- [ ] End-to-end lead insert against live database
- [x] Lint / typecheck / production build verification
- [x] Smoke-test landing (`200`) + API validation + missing-env handling

## Phase 2 — Auth, RBAC, CRM admin

- [ ] Email/password auth + verification + password reset
- [ ] Optional magic link; MFA for privileged users
- [ ] Profiles / roles / permissions migrations + profile trigger
- [ ] Invitation flows for staff / supervisors / contractors
- [ ] RLS policies for identity + CRM
- [ ] Admin dashboard metrics (views/RPCs)
- [ ] CRM: clients, properties, consultations, quotations

## Phase 3 — Projects & site ops

- [ ] Project management tables + UI
- [ ] Contractor management
- [ ] Milestones, site reports, inspections
- [ ] Private storage buckets + policies + signed URLs

## Phase 4 — Procurement & finance

- [ ] Procurement tables + workflows
- [ ] Budgets, invoices, payments, approvals
- [ ] Ledger + reconciliation + RPC financial controls
- [ ] Financial control tests

## Phase 5 — Portals & realtime

- [ ] Client portal
- [ ] Contractor portal
- [ ] Selective Realtime subscriptions
- [ ] Notifications + WhatsApp + email edge functions

## Phase 6 — Hardening

- [ ] Authorization / RLS automated tests
- [ ] Financial workflow tests
- [ ] Responsive QA
- [ ] Security review
- [ ] Production deployment checklist
