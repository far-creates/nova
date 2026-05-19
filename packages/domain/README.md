# packages/domain

Shared pure domain logic for the Nova platform.

## Current Status

This package now contains the first reusable draft modules for:

- normalization
- scoring
- text comparison
- review priority
- contribution formulas
- shared domain types

## Rule

Prefer pure, testable functions here.

## Important Note

The current root app is not wired to these modules yet. They are added in parallel so future migration can happen safely and incrementally.
