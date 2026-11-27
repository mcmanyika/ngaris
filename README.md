# Ngaris Construction

Platform for diaspora and local clients building in Zimbabwe — verified service providers, joint selection, and managed project delivery.

> **Headline:** Build in Zimbabwe. Manage from Anywhere.

## Stack

- **Next.js 16** App Router · TypeScript · Tailwind CSS · shadcn/ui
- **Firebase** Auth, Firestore, Security Rules, Cloud Storage
- **React Hook Form** · Zod · Recharts · Lucide
- **OpenAI** (site assistant) · **Resend** · WhatsApp Business Cloud API · **Vercel**

Prisma, Auth.js, and Supabase are intentionally excluded from the architecture.

## Documentation

| Doc | Purpose |
| --- | --- |
| [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | Product scope, phases, rules |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Firebase-first system design |
| [TASKS.md](./TASKS.md) | Phase checklist |
| [.env.example](./.env.example) | Required environment variables |
| [firestore.rules](./firestore.rules) | Firestore security rules |

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_FIREBASE_* and Firebase Admin credentials
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

- Firebase client + Admin utilities + Next.js 16 proxy session stub
- Public landing + about page + OpenAI assistant
- Firestore `leads` model with default-deny rules
- Secure consultation endpoint (`POST /api/leads`)

To persist leads end-to-end, set Firebase Admin env vars in `.env.local` and publish `firestore.rules`. Never expose Admin credentials to the browser.

## Security notes

- Privileged clients live in server-only modules (`src/lib/firebase/admin.ts`)
- Lead records are not readable or writable via the client SDK
- Rate limiting + honeypot on public lead submission
- Ask for approval before Phase 2 (authentication & administration)
