# Technical Blueprint v1

## Purpose

Nova is a listening-first English learning platform for Iranian learners. The product starts as a web application and will expand to Android and iOS. The architecture must support:

- guest and authenticated learners
- random hero practice
- topic-based sessions
- review sessions using weighted repetition
- admin and creator content workflows
- sponsor-linked contribution tracking for future solar-impact reporting

## Platform Direction

- Current active app: root-level Next.js application
- Future web app location: `apps/web`
- Future mobile app location: `apps/mobile`
- Shared modules: `packages/*`
- Current repo remains operational during migration

## Recommended Stack

- Web: Next.js
- Mobile: Expo + React Native + Expo Router
- ORM: Prisma
- Database: PostgreSQL
- Cache / queue: Redis
- Jobs: BullMQ
- Validation: Zod
- Server state: TanStack Query
- Local UI state: Zustand
- File storage: S3-compatible object storage
- Monitoring: Sentry
- Monorepo: pnpm workspace

## Core Product Capabilities

1. Listening practice from the landing hero
2. Structured topic-based practice sessions
3. Review sessions based on time and prior accuracy
4. Guest practice persistence in browser and backend
5. Multi-provider authentication
6. Profile analytics and progress views
7. Admin and verified creator content management
8. Solar-impact contribution tracking from day one

## Architecture Layers

### Presentation

- Next.js pages and components
- Expo screens later
- No heavy domain logic in UI components

### Application

- use-case orchestration
- auth/session merge
- attempt submission
- review queue generation
- profile summary generation
- content upload and moderation workflows

### Domain

- text normalization
- scoring
- review weighting
- contribution scoring
- role and permission rules

### Data

- users
- auth identities
- guest sessions
- tracks
- topics
- attempts
- review state
- contribution events

## Storage Principles

- one central backend
- one central primary database
- clients never directly access the database
- guest activity is first-class data
- all contribution-related events are persisted as event records

## Near-Term Priorities

1. Security hardening
2. Prisma adoption
3. Guest-session model
4. Domain schema expansion
5. Topic and review engines
6. Admin and creator workflows
7. PWA hardening
8. Mobile app bootstrap
