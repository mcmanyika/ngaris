# Ngaris Construction — Architecture

Firebase-first architecture for Ngaris Construction on Next.js 16 (App Router).

## System overview

```text
┌──────────────────────────────┐
│  Vercel — Next.js App Router │
│  Landing · Dashboards · API  │
└──────────────┬───────────────┘
               │ firebase + firebase-admin
┌──────────────▼───────────────┐
│           Firebase           │
│  Auth · Firestore · Rules    │
│  Storage · (optional CF)     │
└──────────────┬───────────────┘
               │
     ┌─────────┴──────────┐
     │ Resend │ WhatsApp  │
     └────────────────────┘
```

## Next.js + Firebase clients

| Module | Runtime | Credentials | Purpose |
| --- | --- | --- | --- |
| `src/lib/firebase/client.ts` | Browser | `NEXT_PUBLIC_FIREBASE_*` | Client Components, Auth (Phase 2), Storage |
| `src/lib/firebase/admin.ts` | Server only | Service account | Privileged ops (e.g. lead insert); `server-only` |
| `src/lib/firebase/leads.ts` | Server only | Admin | Lead document writes |
| `src/lib/firebase/auth-session.ts` | Proxy | — | Session cookie / token verification (Phase 2) |
| `src/proxy.ts` | Next.js 16 Proxy | — | Invokes `updateSession` |

Session handling uses the Next.js 16 **Proxy** convention (`proxy.ts`), not legacy `middleware.ts`. Phase 1 is pass-through until Auth lands.

Admin credentials (`FIREBASE_PRIVATE_KEY` / service account JSON) must never appear in client bundles.

## Database (Firestore)

- Document/collection model with progressive schema growth
- Server timestamps for `createdAt` / `updatedAt`
- Money stored as integer cents or decimal strings with strict server validation
- Collection shapes documented beside access helpers

### Progressive collection plan

Create in dependency order across phases — not one uncontrolled dump.

1. Identity: `profiles`, role claims
2. CRM: `leads`, `clients`, `properties`, …
3. Projects, contractors, site ops, procurement, finance, platform collections as listed in the development plan

`profiles/{uid}` documents align with Firebase Auth UIDs. No separate password table.

### Phase 1 schema

Collection `leads` — fields: `fullName`, `email`, `phone`, `country`, `projectType`, `location`, `budgetRange`, `message`, `source`, `status`, `metadata`, `createdAt`, `updatedAt`.

Firestore rules **deny all client access** to `leads`. Inserts use the Admin SDK from `POST /api/leads` only. See `firestore.rules`.

## Authentication (Phase 2+)

- Email/password, verification, reset, optional magic link
- MFA for privileged users
- Auto-create profile on authorized user creation
- Roles via custom claims + Firestore; role-based dashboard routing
- Public registration must not grant administrative privileges

## Security rules

- Default deny on all collections
- Explicit allow rules per role / ownership
- Clients → own projects and approved customer-facing artifacts only
- Contractors → assigned work orders / authorized records
- Supervisors / PMs / finance / inspectors → assigned scope only
- No self-escalation of roles; no self-approval of unauthorized financial requests
- Privileged mutations via Admin SDK or Cloud Functions when rules alone are insufficient

## Storage

Private paths (examples): `project-photos`, `project-videos`, `project-documents`, `client-documents`, `contractor-documents`, `contracts`, `invoices`, `inspection-reports`, `handover-documents`.

Public: approved marketing assets only.

Paths encode resource IDs; **authorization must validate permissions**, not path shape alone. Private files via expiring signed URLs from the Admin SDK.

## Realtime

Enable selectively via Firestore listeners: project status, milestones, approved progress reports, messages, notifications, approval queues. Listeners must respect security rules. Unsubscribe on unmount. Never broadcast confidential finance on public channels.

## Financial transaction architecture

Authorized server functions (Admin SDK / Cloud Functions) for budget / PO / milestone / payment / journal / reconciliation / variation flows. Idempotency, concurrency controls, balanced journals, immutability of posted entries (reversals for corrections).

## Background jobs (later)

WhatsApp / email notifications, weekly project reports, invoice reminders, milestone notifications, contractor document expiry, project risk alerts — via Next.js scheduled/cron routes and/or Cloud Functions. Validate authz, verify webhook signatures, retries + delivery logs + idempotency.

## Lead capture (Phase 1)

```text
Consultation form → Zod validate → rate limit + honeypot
  → POST /api/leads → Admin SDK insert into Firestore leads
  → notify admins (Resend when configured)
```

Public clients cannot read or write leads through the client SDK.

## Environment

See `.env.example`. Required for lead capture: Firebase Admin credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` or `FIREBASE_SERVICE_ACCOUNT_JSON`). Public `NEXT_PUBLIC_FIREBASE_*` values support the client SDK for Phase 2+.

## Hosting

Application on Vercel. Firebase for Auth, Firestore, Storage, and optional Cloud Functions.
