# Frontend Migration Status

## Current Phase

The web frontend migration has entered the first executable phase.

`apps/web` is now a real Next.js workspace app instead of a placeholder. It currently reuses the existing root-level frontend and API handlers through wrapper routes and pages so the team can migrate incrementally without breaking the running product.

## What Is Done

- `apps/web` has its own `package.json`
- `apps/web` has its own `tsconfig.json`
- `apps/web` has its own `next.config.ts`
- `apps/web` exposes landing, login, signup, practice, and profile routes
- `apps/web` exposes the currently active legacy API routes needed by those pages
- root workspace scripts now include `dev:web`, `build:web`, and `lint:web`
- direct TypeScript validation for `apps/web` passes

## What Is Still Transitional

- `apps/web` still imports the root `app/` implementation
- providers still live in the root app
- UI primitives still live in `app/components/ui`
- feature modules still live in `app/components/modules` and `app/components/landing`
- route handlers still live in the root app

## Estimated Progress

- Frontend architecture migration: about 45%
- Frontend runtime relocation into `apps/web`: about 20%
- Shared UI extraction: about 10%
- Root app retirement: 0%

## Recommended Next Steps

1. Move `layout`, providers, and global styles into `apps/web`
2. Extract stable UI primitives into `packages/ui`
3. Move feature modules into `apps/web/features`
4. Replace wrapper pages with native `apps/web` page implementations
5. Replace wrapper API routes with package-backed handlers
6. Remove the root app entrypoints only after route parity is confirmed

## Migration Rule

Until parity is complete, new frontend work should prefer:

1. shared domain and API contracts in `packages/*`
2. new runtime entrypoints in `apps/web`
3. minimal new investment in root-only app wiring
