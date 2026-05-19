# Implementation Spec v1

## Status

This document defines the target structure without forcing an immediate migration of the current working app.

## Current Rule

- The current operational Next.js app stays at the repository root.
- New folders created under `apps/` and `packages/` are scaffolding only.
- No runtime path should be switched until migration is explicitly scheduled.

## Planned Apps

### `apps/web`

Future home of the production Next.js web app after migration from the root app.

### `apps/mobile`

Future Expo application for Android and iOS.

## Planned Packages

### `packages/db`

- Prisma schema
- migrations
- repository helpers
- server-only data access

### `packages/domain`

- scoring
- normalization
- review priority calculation
- contribution formulas
- shared domain types

### `packages/api`

- request / response schemas
- typed API contracts
- client helpers

### `packages/ui`

- shared design tokens
- future shared UI primitives where appropriate

### `packages/config`

- shared tsconfig
- eslint presets
- environment validation conventions

## Immediate Constraints

- Do not move the current app automatically
- Do not introduce breaking imports into the current runtime
- Do not add placeholder TypeScript files that can interfere with current compilation unless they are intentionally valid and owned

## Migration Path

1. Stabilize current root app
2. Add shared contracts and docs
3. Introduce Prisma and DB package
4. Extract domain logic into shared package
5. Migrate web app into `apps/web`
6. Bootstrap Expo app in `apps/mobile`
