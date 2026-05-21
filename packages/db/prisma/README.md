# Prisma Folder

This folder contains the runtime schema for the current PostgreSQL-backed Nova app.

## Current Rule

- Keep the schema aligned with the server-side runtime helpers in `lib/`
- Prefer small, compatible changes that keep the API contract stable
- Use `prisma db push` for MVP environment setup unless the team asks for migrations

## Contents

- `schema.prisma`
- future `migrations/` if the project moves beyond MVP schema management
