# Smart Calendar

Smart Calendar is a mobility-aware calendar system that turns a user’s Google Calendar into a realistic and trustworthy schedule. The project is structured as a production-oriented full-stack application with clear separation between application code, infrastructure, automation, and documentation.

This repository is intentionally organized so that anyone reading it can immediately understand how the system is structured and why each folder exists.

---

## Repository Structure

The repository is divided into four main areas:

- Web application
- Infrastructure
- Automation
- Documentation

```
smart-calendar/
├─ app/
├─ infra/
├─ docs/
├─ .github/
└─ README.md
```

Each top-level directory has a single responsibility and evolves independently.

---

## app/ (Web Application)

The `app/` directory contains the entire Next.js application and is the unit deployed to Vercel. All frontend and server-side application code lives here.

```
app/
├─ public/
├─ prisma/
├─ src/
├─ next.config.ts
├─ tsconfig.json
└─ .env.local
```

### public/

Static assets served directly by Next.js.  
Examples include icons, logos, and static images. These files are served as-is and do not go through the React rendering pipeline.

---

### prisma/

Database schema and migration history managed by Prisma.

```
prisma/
├─ schema.prisma
└─ migrations/
```

- `schema.prisma` defines database models and relationships
- `migrations/` tracks schema changes over time

This ensures database structure remains consistent across environments.

---

### src/

All runtime source code lives under `src/`. This keeps the project root clean and clearly separates application code from configuration files.

```
src/
├─ app/
├─ components/
├─ lib/
├─ types/
└─ utils/
```

---

## src/app/ (Next.js App Router)

This directory defines all routes, layouts, and API endpoints. It is the only place where routing logic exists.

```
src/app/
├─ (auth)/
├─ (protected)/
├─ api/
├─ layout.tsx
├─ page.tsx
└─ globals.css
```

### Route Groups

Folders wrapped in parentheses are route groups. They organize routes without affecting the URL structure.

#### (auth)/

Public authentication routes such as login and logout.

Examples:
- /login
- /logout

These routes are grouped for organization and shared layout purposes.

#### (protected)/

Authenticated user routes.

Examples:
- /dashboard
- /settings

This grouping allows shared layouts and centralized authentication enforcement while keeping clean URLs.

---

### api/

Server-side API routes.

```
api/
├─ auth/
└─ health/
```

- `auth/` handles OAuth callbacks and secure authentication logic
- `health/` provides a lightweight health check endpoint

All secrets and privileged operations are confined to these server routes.

---

### Core App Files

- `layout.tsx`  
  Root layout applied to all routes. Defines shared HTML structure and providers.

- `page.tsx`  
  Landing page at `/`. Often redirects authenticated users to the dashboard.

- `globals.css`  
  Global styles and Tailwind base configuration.

---

## src/components/ (Reusable UI)

Reusable React components live here. Components in this directory never define routes and never access the database directly.

```
components/
├─ ui/
├─ auth/
├─ calendar/
└─ shared/
```

- `ui/` contains design system primitives and shadcn/ui components
- `auth/` contains authentication-related UI such as login buttons and user menus
- `calendar/` contains calendar-specific UI such as event lists and schedule views
- `shared/` contains generic layout components used across multiple pages

---

## src/lib/ (Application Logic)

This directory contains the core logic of the system and acts as the boundary between UI and external services.

```
lib/
├─ auth.ts
├─ db.ts
├─ google.ts
└─ env.ts
```

- `auth.ts` contains authentication helpers and session utilities
- `db.ts` initializes the Prisma client and database helpers
- `google.ts` handles Google Calendar API integration
- `env.ts` validates required environment variables at startup

---

## src/types/

Shared TypeScript types used across the application.  
Examples include normalized calendar events, API response shapes, and domain models. This keeps frontend and backend code aligned.

---

## src/utils/

Small, pure helper functions such as date formatting, string normalization, and lightweight data transformations. Functions here have no side effects and no external dependencies.

---

## infra/ (Infrastructure)

All AWS infrastructure is defined separately from application code.

```
infra/
├─ cdk/ or terraform/
├─ lambda/
└─ README.md
```

- `cdk/` or `terraform/` contains Infrastructure as Code definitions
- `lambda/` contains AWS Lambda source code for background jobs and async processing
- `README.md` documents how to deploy and manage infrastructure

This separation allows infrastructure to evolve independently while remaining versioned with the application.

---

## docs/ (Documentation)

Design and architectural documentation.

```
docs/
├─ architecture.md
├─ environments.md
└─ decisions.md
```

- `architecture.md` explains system design and data flow
- `environments.md` documents environment variables and deployment differences
- `decisions.md` records architectural and tooling decisions with reasoning

---

## .github/ (Automation)

CI configuration using GitHub Actions.

```
.github/workflows/ci.yml
```

Runs checks such as TypeScript validation, linting, and build verification to ensure the main branch remains deployable.

---

## Design Philosophy

- Clear separation of concerns
- No routing logic outside src/app
- No business logic inside UI components
- Infrastructure managed independently from application code
- Structure optimized for scaling beyond initial development phases

This repository is structured like a production system rather than a prototype, minimizing future refactors and making the project easy to reason about.

---

## Getting Started

Environment configuration and setup instructions are documented in `docs/environments.md`.
