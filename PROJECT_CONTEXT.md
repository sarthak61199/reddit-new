# Project Context Reference

Last updated: 2026-02-14

## Purpose and Current State

- This is a Reddit-like app built on TanStack Start with file-based TanStack Router routes.
- The app already includes auth, subreddit/post/comment domain logic, Prisma schema, and server functions.
- Some routes still look scaffolded (for example, "Hello ..." placeholder pages under dynamic subreddit/post paths).

## Tech Stack

### Runtime and Frameworks

- React 19
- TanStack Start
- TanStack Router (file-based routing)
- TanStack Query
- TanStack Form

### UI and Styling

- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui-style component setup (`components.json`, style `base-vega`)
- Base UI primitives (`@base-ui/react`)
- Lucide icons
- Sonner for toasts

### Backend and Data

- Prisma ORM + PostgreSQL
- Prisma client output generated to `src/generated/prisma`
- Better Auth with Prisma adapter
- Better Auth TanStack Start cookie plugin enabled

### Validation and Types

- Zod schemas in `src/validations`
- TypeScript strict mode with path alias `@/* -> src/*`

## Package Manager and Scripts

- Package manager in use: `npm` (lockfile present: `package-lock.json`)
- Core scripts:
  - `npm run dev` (Vite dev server on port 3000)
  - `npm run build`
  - `npm run preview`
  - `npm run test` (Vitest configured, no tests currently found)
  - `npm run lint` (ESLint)
  - `npm run format` (Prettier)
  - `npm run check` (Prettier write + ESLint fix)
- DB scripts (via `dotenv-cli` + `.env.local`):
  - `db:generate`, `db:push`, `db:migrate`, `db:studio`, `db:seed`

## Folder Structure

```text
.
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── components/
│   │   ├── logo.tsx
│   │   └── ui/
│   ├── functions/              # server functions (post/comment/subreddit)
│   ├── generated/              # generated Prisma client output
│   ├── integrations/
│   │   └── tanstack-query/
│   ├── lib/                    # auth/db/utils client helpers
│   ├── middleware/             # auth middleware
│   ├── routes/                 # TanStack file-based routes
│   │   ├── __root.tsx
│   │   ├── _main.tsx
│   │   ├── _auth.tsx
│   │   ├── _main/
│   │   ├── _auth/
│   │   └── api/
│   ├── validations/            # zod schemas
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   └── styles.css
├── components.json
├── eslint.config.js
├── prettier.config.js
├── prisma.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

## Architecture and Conventions

### Routing and Layout

- File-based routing under `src/routes`.
- Layout pattern:
  - `__root.tsx` sets shell document + devtools + global CSS link.
  - `_main.tsx` and `_auth.tsx` are layout wrappers with `<Outlet />`.
- API route example: `src/routes/api/auth/$.ts` passes GET/POST to `auth.handler`.

### Server-side Logic Pattern

- Domain operations are implemented via `createServerFn` in `src/functions/*`.
- Common flow:
  - `.middleware([authMiddleware])` for protected actions
  - `.inputValidator(...)` with Zod schema (when input is needed)
  - Prisma query/mutation in `.handler(...)`
- Business logic is colocated per domain:
  - `post.ts`, `comment.ts`, `subreddit.ts`

### Validation Pattern

- Zod schemas per domain in `src/validations`.
- ULID-based IDs are validated using `z.ulid()`.

### Auth Pattern

- Better Auth server setup in `src/lib/auth.ts`.
- Client setup in `src/lib/auth-client.ts`.
- Auth session lookup is done in middleware (`src/middleware/auth.ts`).
- Unauthenticated access redirects to `/login` in middleware (route naming currently uses `sign-in`, so this may need alignment).

## Coding Style Observed

- TypeScript-first, strict compiler options enabled.
- Prettier config:
  - semicolons on
  - double quotes
  - trailing commas `all`
- ESLint config extends `@tanstack/eslint-config`.
- Naming patterns:
  - Components/types: PascalCase
  - Functions/variables: camelCase
  - Route files: TanStack conventions, including dynamic segments like `$postId`
- Code patterns:
  - Async/await for server logic
  - Prisma `select` usage to shape response payloads
  - Derived response fields (vote counts, userVote, nested replies)

## Database Model Snapshot

- Main entities:
  - User, Session, Account, Verification
  - Subreddit, SubredditMember, SubredditModerator
  - Post, Comment, PostVote, CommentVote
- IDs are ULID strings.
- Data source is PostgreSQL.

## Environment and Config Files

- `.env` and `.env.local` are expected in workflows.
- `prisma.config.ts` reads `DATABASE_URL` using Prisma config `env(...)`.
- `src/lib/db.ts` reads `process.env.DATABASE_URL` and uses PrismaPg adapter.

## Prompting Notes for Future Work

When asking for code changes in this repo, include:

1. Feature or bug goal (what should happen)
2. Route or domain scope (`subreddit`, `post`, `comment`, `auth`, etc.)
3. Whether change is UI (`src/routes`, `src/components`) or server (`src/functions`, `src/lib`)
4. Validation/auth requirements (if any)
5. Desired tests (if you want tests added)

Helpful examples:

- "Add edit-comment UI and wire it to `updateComment` in `src/functions/comment.ts`."
- "Replace placeholder route `src/routes/_main/subreddit/$subredditId/post/$postId/index.tsx` with actual post detail view."
- "Align auth redirect in middleware with existing sign-in route path."

## Practical Guardrails

- Do not manually edit `src/routeTree.gen.ts` (generated).
- Keep API/auth handler route contract intact (`/api/auth/$`).
- Keep Prisma generated client path consistent with `schema.prisma` output.
- Prefer reusing existing domain server functions before adding new endpoints.
