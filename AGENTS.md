# AGENTS.md

This file gives coding agents the minimum working context for `scory-apps`.

## Project Summary

`scory-apps` is a Next.js 16 App Router frontend for Scory, a research-assistant product. The current product shape has two main surfaces:

- Public client-facing marketing pages and workspace entry flows
- Role-based portal areas for admin and author

The app uses React 19, TypeScript, Tailwind CSS v4, `framer-motion`, `lucide-react`, and a small set of shared UI primitives in `src/components/ui`.

## Runbook

- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm.cmd run lint`
- Build: `npm run build`

On some Windows setups, `npm` in PowerShell may be blocked by execution policy. If that happens, use `npm.cmd` instead.

## High-Level Structure

- `src/app`
  App Router entrypoints, layouts, route groups, and global styles.
- `src/components/client`
  Public website sections and workspace-specific client components.
- `src/components/portal`
  Portal layout, auth guard, and shared portal scaffolding.
- `src/components/ui`
  Shared UI primitives.
- `src/components/providers`
  App-level providers such as theming.
- `src/services`
  Auth and related client-side service modules.
- `src/services/core`
  Lower-level service helpers, currently including mock auth behavior.
- `src/types`
  Shared TypeScript types.
- `src/hooks`
  Reusable React hooks.
- `src/assets`
  Static visual assets imported from source.
- `public`
  Public static files served directly by Next.js.

## Route Groups

- `src/app/(client)`
  Public homepage and workspace flow.
- `src/app/(client)/workspace/page.tsx`
  Current research workspace entry surface. This is the main reference for public product capabilities and user-facing flows.
- `src/app/(admin)`
  Admin portal routes.
- `src/app/(author)`
  Author portal routes.

If you change landing-page product messaging, compare it against the workspace flow first so the public promise matches the real user path.

## Product and UI Notes

- The public homepage is assembled in `src/app/(client)/page.tsx`.
- Workspace capabilities currently center on:
  - starting from a title
  - searching articles
  - uploading article PDFs
  - personalization / reading-level adaptation
- The app uses `Space_Grotesk` in `src/app/layout.tsx` as the global font.
- Theme handling is managed by `ThemeProvider` and an inline hydration-safe theme bootstrap in the root layout.
- Toast notifications use `sonner`.

## Auth and Data State

- Auth services are re-exported from `src/services/index.ts`.
- Current auth behavior appears to rely on local client-side services and mock helpers under `src/services/core/mock-auth.ts`.
- Do not assume a real backend integration exists unless you verify it in the code first.
- Be careful when editing auth flows: admin, author, reviewer, and client roles have separate service modules.

## Editing Guidelines for This Repo

- Prefer preserving existing route-group structure and component boundaries.
- Keep public marketing copy aligned with actual implemented workflow, especially around the workspace.
- Reuse `src/components/ui` primitives instead of creating ad hoc replacements.
- Prefer small, local edits over broad visual refactors unless explicitly requested.
- Check dark-mode behavior when changing public-facing components.
- Avoid introducing new dependencies for small UI/content changes.

## Verification Expectations

For focused UI or copy edits:

- Run lint on the touched file or the full app when practical.
- If a change affects route behavior or auth flow, inspect the related service/module path and verify imports.
- If a change affects public messaging, review both `src/app/(client)/page.tsx` and `src/app/(client)/workspace/page.tsx`.

## Known Documentation Gap

`README.md` is still mostly the default Next.js scaffold and does not reflect the current product structure. If asked for broader documentation, a good next step is to replace it with:

- project overview
- route map
- component/domain structure
- local development guide
- auth/mock-service notes
- deployment assumptions
