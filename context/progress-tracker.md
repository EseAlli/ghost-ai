# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 05: Prisma data layer (complete)

## Current Goal

- Manually verify Feature 04 in the browser, then await the next feature spec (wiring the project dialogs to the database).

## Completed

- Feature 01: Design System — shadcn/ui installed (Nova preset, Base UI, Tailwind v4); Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea components added to `components/ui/`; `lib/utils.ts` exports `cn()` from the `cn` package; `globals.css` updated with full project dark theme CSS tokens (`--bg-base`, `--accent-primary`, etc.) mapped via `@theme inline`; shadcn variables overridden to match dark palette; TypeScript passes clean.
- Feature 02: Editor chrome
  - [x] `components/editor/editor-navbar.tsx` — `EditorNavbar({ isSidebarOpen, onToggleSidebar })`; `h-14` header with left/center/right sections, `PanelLeftOpen`/`PanelLeftClose` toggle on the left, center and right empty; `bg-base` with `border-surface-border` bottom border.
  - [x] `components/editor/project-sidebar.tsx` — `ProjectSidebar({ isOpen, onClose, onNewProject? })`; fixed floating overlay (does not push content), slides in from the left via transform, `inert` + `aria-hidden` when closed; `Projects` header with close button; shadcn `Tabs` (My Projects / Shared) with empty placeholder states; full-width `New Project` button with `Plus` icon.
  - [x] `components/editor/editor-dialog.tsx` — `EditorDialog` pattern wrapping shadcn `Dialog` with token styling (`rounded-3xl`, `bg-elevated`, `border-surface-border`); supports `title`, `description`, `footer` actions, optional `trigger`, controlled `open`/`onOpenChange`. No concrete dialogs built yet.
  - [x] `tsc --noEmit` clean; `eslint components/editor` clean.
- Feature 03: Auth (Clerk)
  - [x] `@clerk/ui` installed; `lib/clerk-appearance.ts` uses Clerk's `dark` theme with variables mapped to `globals.css` CSS variables (no hardcoded colors).
  - [x] `ClerkProvider` wraps the root layout (`app/layout.tsx`).
  - [x] `proxy.ts` at project root: `clerkMiddleware` protects every route except the sign-in/sign-up paths (`lib/auth-routes.ts`, read from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`).
  - [x] `app/(auth)/layout.tsx` 50/50 two-panel layout matching the reference screenshot: left panel on `bg-surface` (logo mark, headline, description, three features with small brand icons, copyright footer); form right on `bg-base`; form only below `lg`. Icons were added at the user's request, beyond the spec's "text-only" list. `sign-in/[[...sign-in]]` and `sign-up/[[...sign-up]]` render Clerk `<SignIn />` / `<SignUp />` in `<Suspense>`.
  - [x] `/` redirects signed-in users to `/editor`, signed-out users to sign-in.
  - [x] `app/editor/page.tsx` (minimal) calls `auth.protect()` and mounts `EditorWorkspace` (navbar + project sidebar); `loading.tsx` added for Cache Components.
  - [x] Clerk `UserButton` in the editor navbar right section (default menu/profile flows).
  - [x] `npm run build` passes; eslint clean.
- Feature 04: Project dialogs (mock data only, no API/persistence)
  - [x] `components/editor/editor-home.tsx` — centered heading, description and `New Project` (`Plus`) button on `/editor`, no card wrapper; opens the Create dialog.
  - [x] `hooks/use-project-dialogs.ts` — owns dialog state (`activeDialog`, `targetProject`), form state (`name`, derived `slug`) and loading state (`isSubmitting`); mutations go to `onCreate`/`onRename`/`onDelete` handlers so API calls can be added later.
  - [x] `components/editor/project-dialogs.tsx` — Create (name input + live slug preview), Rename (prefilled, current name in description, auto-focused via `initialFocus`, Enter submits), Delete (confirmation only, `destructive` button).
  - [x] `components/editor/project-sidebar.tsx` — lists projects from props; Rename/Delete icon actions only on owned projects (always visible on mobile, on hover/focus from `md`); none on Shared; mobile-only backdrop scrim closes the sidebar on tap.
  - [x] Slug validation on Create (`validateSlug` in `lib/slug.ts`): slug must be non-empty, at most `SLUG_MAX_LENGTH` (50) characters, and not already used by another project. The error shows under the slug preview, the input gets `aria-invalid`, and Create stays disabled.
  - [x] `EditorDialog` gained an optional `initialFocus` passthrough.
  - [x] `types/project.ts` (`Project`, `ProjectRole`), `lib/slug.ts` (`slugify`), `lib/mock-projects.ts` (3 mock projects: 2 owned, 1 shared). The workspace keeps the list in in-memory state (resets on reload).
  - [x] `tsc --noEmit` clean; eslint clean; `npm run build` passes.
- Feature 05: Prisma (Prisma 8 RC: `prisma` 8.0.0-rc.35, `@prisma/orm-postgres` 8.0.0-rc.25; kept at the user's request instead of the Prisma 7 setup the spec assumed)
  - [x] `prisma/models/project.prisma` (Prisma 8 PSL contract). `Project`: `id` (uuid v7, client-generated), `ownerId` (Clerk user ID), `name`, optional `description`, `status` (`ProjectStatus` enum: `DRAFT`, `ARCHIVED`; enforced by a CHECK constraint), optional `canvasJsonPath`, `createdAt`/`updatedAt`; indexes on `ownerId` and `createdAt`. `ProjectCollaborator`: `id`, `projectId` → `Project` (`onDelete: Cascade`), `email`, `createdAt`; unique `(projectId, email)`; indexes on `email` and `(projectId, createdAt)`. `Project.collaborators` back-relation (no column).
  - [x] `prisma.config.ts` points at the contract, emits to `prisma/generated/` (`contract.json`, `contract.d.ts`) and loads `.env.local` then `.env`.
  - [x] `lib/prisma.ts` exports one `prisma` client, cached on `globalThis` outside production. A `prisma+postgres://` (Accelerate) URL throws a clear error, because Prisma 8 has no Accelerate client. Any other URL uses the direct `postgres()` runtime, which builds a `pg` pool.
  - [x] First migration `migrations/app/20261125T2034_init` planned (`prisma migration plan --name init`) and applied to the Prisma Postgres dev database (`prisma db migrate`). `prisma db verify`: marker and schema match the contract. A read-only query through `lib/prisma.ts` returned rows.
  - [x] `tsc --noEmit` clean; eslint clean; `npm run build` passes.

## In Progress

- None. Feature 04 still needs a click-through in a signed-in browser session (not yet done).

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Auth spec assumed sign-in/sign-up URL env vars already existed; they did not. Added Clerk's standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` to `.env.local` (code falls back to the same paths). Confirm these are set in every deployment environment.

- Spec 05 asked for Accelerate when `DATABASE_URL` starts with `prisma+postgres://`. Prisma 8 cannot do this; that branch now throws. Decide whether Accelerate is needed. If it is, either move to Prisma 7 or wait for Prisma 8 support.
- Spec 05 asked for `@prisma/adapter-pg`, but that is a Prisma 7 driver adapter; Prisma 8 connects through `pg` itself. `@prisma/client` 7.10.1 and `@prisma/adapter-pg` 7.10.1 are still in `package.json` but unused. Decide whether to remove them.
- `status` has no database default; callers must set it (e.g. `DRAFT` on create). Confirm or add `@default`.
- `app/generated/prisma/` (the Prisma 8 init sample with User/Post models) and `prisma-8.md` (its README) are no longer used. `app/generated` is excluded in `tsconfig.json` so the build passes. Delete both, then remove the exclude.

## Architecture Decisions

- Database: Prisma 8 RC (contract-first), not Prisma 7. Contract source is `prisma/models/project.prisma`; emitted artifacts are in `prisma/generated/`; migrations are in `migrations/app/` (commit all three). Workflow: edit the contract → `npm run contract:emit` → `npx prisma migration plan --name <slug>` → `npx prisma db migrate`. Prisma 8 has no `generate` or `migrate dev`. Queries use `prisma.orm.public.<Model>`.
- Prisma 8 automatically adds a separate index on the FK column `ProjectCollaborator.projectId`, on top of the indexes the spec asked for.

- Fonts: Geist Sans/Mono via `next/font` is verified as the computed font on the auth pages, including inside Clerk components (`fontFamily: var(--font-geist-sans)`, `fontSize: 0.9375rem`).
- Route protection: `proxy.ts` protects all non-auth routes by default (per spec), without the deprecated `createRouteMatcher`. Pages also call `auth.protect()` themselves as defence in depth, per Clerk v7 guidance.

## Session Notes

- Feature 05: `.env.local` had the key misspelled as `DATABSE_URL`; renamed to `DATABASE_URL` with the user's approval. Set `DATABASE_URL` in every deployment environment too.

- Feature 04: renaming a project keeps its original slug; the spec does not say rename should regenerate it. Slug uniqueness is checked only against the in-memory list; the server must enforce it too once persistence lands. The 50-character slug limit was chosen by the AI because the spec gives no limit; confirm or change it.

- `/editor` now mounts the navbar + sidebar via `components/editor/editor-workspace.tsx` (needed as the post-auth redirect target); canvas is still to come in a later spec.
- Sidebar sits at `top-16` to clear the `h-14` navbar; keep these in sync if the navbar height changes.
