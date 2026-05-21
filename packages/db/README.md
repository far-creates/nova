# packages/db

Database package for Nova's active Prisma + PostgreSQL runtime.

## Current Status

This package now owns the runtime Prisma schema used by the app's current auth, tracks, sentences, and attempts flows.

## Contents

- `prisma/schema.prisma` for the live MVP data model
- `src/client.ts` for the shared Prisma client singleton
- package scripts for formatting, validation, generation, and `db push`

## Workflow

1. Set `DATABASE_URL`
2. Run `pnpm db:prisma:generate`
3. Run `pnpm db:push`

## Rule

Keep database access on the server and route shared runtime access through the Prisma client in this package.
