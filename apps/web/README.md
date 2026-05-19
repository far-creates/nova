# apps/web

Active home of the Nova web frontend migration.

## Current Status

This app now boots as a real Next.js workspace package, but still reuses the existing root-level `app/` implementation through wrapper routes and pages.

That gives the team a safe migration target while feature slices are gradually moved into `apps/web` and shared packages.

## Immediate Next Steps

- move providers and app shell into `apps/web`
- extract stable UI primitives into `packages/ui`
- migrate landing, auth, practice, and profile feature slices one by one
- retire root-level app entrypoints after parity is reached
