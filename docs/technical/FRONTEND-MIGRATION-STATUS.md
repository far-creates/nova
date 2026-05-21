# Frontend Migration Status

## Current Phase

The web frontend migration has entered the first executable phase.

`apps/web` is now a real Next.js workspace app instead of a placeholder. It currently reuses the existing root-level frontend and API handlers through wrapper routes and pages so the team can migrate incrementally without breaking the running product.

## What Is Done

- `apps/web` has its own `package.json`
- `apps/web` has its own `tsconfig.json`
- `apps/web` has its own `next.config.ts`
- `apps/web` has its own layout, provider entrypoint, and global stylesheet entry
- provider implementations now live in `apps/web/context`
- stable UI primitives now live in `packages/ui`
- landing, login, and signup routes now have native `apps/web` implementations
- practice and profile routes now have native `apps/web` implementations
- the main web component graph now starts from `apps/web/components`
- active API logic now lives in shared `apps/web/server/api` handlers
- shared backend use-cases now live in `packages/application`
- `apps/web` exposes landing, login, signup, practice, and profile routes
- `apps/web` exposes the currently active legacy API routes needed by those pages
- root workspace scripts now include `dev:web`, `build:web`, and `lint:web`
- direct TypeScript validation for `apps/web` passes

## What Is Still Transitional

- `apps/web` still imports the root `app/` implementation for some shared feature pieces
- root `app/context` files are still compatibility re-exports
- root `app/components/ui` files are still compatibility re-exports
- several feature leaf components are now mirrored or re-exported through `apps/web/components`
- root `app/api` files are now compatibility re-exports over shared handlers
- current application use-cases still call legacy `lib/*` data modules internally

## Estimated Progress

- Frontend architecture migration: about 78%
- Frontend runtime relocation into `apps/web`: about 70%
- API handler migration: about 65%
- Shared application layer migration: about 45%
- Shared UI extraction: about 55%
- Root app retirement: 0%

## Recommended Next Steps

1. Replace `packages/application` internals to use new repositories instead of legacy `lib/*`
2. Move remaining `apps/web/components` re-exports into native moved files
3. Convert root compatibility re-exports into final removals after parity
4. Normalize encoding and copy text in migrated files
5. Consolidate duplicated legacy route files under `app/`
6. Remove the root app entrypoints only after route parity is confirmed

## Migration Rule

Until parity is complete, new frontend work should prefer:

1. shared domain and API contracts in `packages/*`
2. new runtime entrypoints in `apps/web`
3. minimal new investment in root-only app wiring
