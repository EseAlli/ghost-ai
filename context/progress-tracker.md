# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Project dialogs (complete — pending manual browser check)

## Current Goal

- Manually verify Feature 04 in the browser, then await the next feature spec.

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

## In Progress

- None. Feature 04 still needs a click-through in a signed-in browser session (not yet done).

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Auth spec assumed sign-in/sign-up URL env vars already existed; they did not. Added Clerk's standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` to `.env.local` (code falls back to the same paths). Confirm these are set in every deployment environment.

## Architecture Decisions

- Fonts: Geist Sans/Mono via `next/font` is verified as the computed font on the auth pages, including inside Clerk components (`fontFamily: var(--font-geist-sans)`, `fontSize: 0.9375rem`).
- Route protection: `proxy.ts` protects all non-auth routes by default (per spec), without the deprecated `createRouteMatcher`. Pages also call `auth.protect()` themselves as defence in depth, per Clerk v7 guidance.

## Session Notes

- Feature 04: renaming a project keeps its original slug; the spec does not say rename should regenerate it. Slug uniqueness is checked only against the in-memory list; the server must enforce it too once persistence lands. The 50-character slug limit was chosen by the AI because the spec gives no limit; confirm or change it.

- `/editor` now mounts the navbar + sidebar via `components/editor/editor-workspace.tsx` (needed as the post-auth redirect target); canvas is still to come in a later spec.
- Sidebar sits at `top-16` to clear the `h-14` navbar; keep these in sync if the navbar height changes.
