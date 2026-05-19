# packages/db

Database package for the future platform architecture.

## Current Status

This package now contains a draft Prisma schema for the long-term Nova data model.

It is intentionally **not wired** into the current root application yet, so the running app can continue using the existing MSSQL-based implementation while the target schema is designed in parallel.

## Contents

- Prisma schema draft
- future migrations
- future repository helpers
- future server-only database access

## Rule

No client code should import runtime DB logic directly.

## Important Note

The draft schema targets the recommended long-term `PostgreSQL + Prisma` architecture, while the current app still runs on the existing SQL Server setup at the repository root.
