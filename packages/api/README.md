# @nova/api

Shared API contracts for the Nova platform.

## Purpose

This package is the future home for:

- request / response contracts
- shared enum-like types
- contract-level validation schemas
- typed client helpers

## Current Status

This package now contains real `zod` schemas plus inferred TypeScript types,
while still staying safe for the current root app:

- no runtime integration yet
- no rewiring of existing route handlers
- schemas are ready for gradual adoption in routes, actions, and mobile clients

## Near-Term Next Step

Adopt these contracts incrementally in:

- auth routes
- attempt submission
- track selection
- profile summary endpoints
- review queue endpoints
