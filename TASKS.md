# Ngaris Construction — Tasks

Track progress by phase. Ask for approval before starting the next major phase.

## Phase 1 — Foundation & landing

- [x] Initialize Next.js App Router (TypeScript, Tailwind)
- [x] Configure shadcn/ui + Lucide
- [x] Install Firebase / form / chart / OpenAI dependencies
- [x] Create `lib/firebase` clients (`client`, `admin`, `leads`, `auth-session`)
- [x] Next.js 16 `src/proxy.ts` session stub
- [x] `.env.example` (Firebase + OpenAI + messaging)
- [x] Update `DEVELOPMENT_PLAN.md`, `ARCHITECTURE.md`, `TASKS.md`, `README.md`
- [x] Firestore `leads` model + `firestore.rules` (default deny)
- [x] Landing page + about page + branded chatbot
- [x] Secure `POST /api/leads` (Zod, rate limit, honeypot, Admin insert, notify stub)
- [ ] Configure Firebase project credentials in `.env.local`
- [ ] Deploy / publish `firestore.rules`
- [ ] End-to-end lead insert against live Firestore
- [x] Remove Supabase packages and migration tree
- [x] Lint / typecheck / production build verification after pivot

## Phase 2 — Auth, RBAC, CRM admin

- [x] Admin login (`/admin/login`) + session cookie (`POST/DELETE /api/auth/session`)
- [x] Proxy gate + protected admin layout verification
- [x] Admin dashboard shell (`/admin`) + logout
- [x] Staff allowlist / custom-claim gate (`ADMIN_EMAIL_ALLOWLIST`)
- [ ] Firebase Auth email verification + password reset
- [ ] Optional magic link; MFA for privileged users
- [ ] Profiles + custom claims / roles UI
- [ ] Invitation flows for staff / supervisors / contractors
- [ ] Security rules for identity + CRM
- [ ] CRM: clients, properties, consultations, quotations

## Phase 3 — Projects & site ops

- [ ] Project management collections + UI
- [ ] Contractor management
- [ ] Milestones, site reports, inspections
- [ ] Private Cloud Storage + signed URLs

## Phase 4 — Procurement & finance

- [ ] Procurement collections + workflows
- [ ] Budgets, invoices, payments, approvals
- [ ] Ledger + reconciliation + financial controls
- [ ] Financial control tests

## Phase 5 — Portals & realtime

- [ ] Client portal
- [ ] Contractor portal
- [ ] Selective Firestore listeners
- [ ] Notifications + WhatsApp + email jobs

## Phase 6 — Hardening

- [ ] Authorization / rules automated tests
- [ ] Financial workflow tests
- [ ] Responsive QA
- [ ] Security review
- [ ] Production deployment checklist
