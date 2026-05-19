import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  legacyAuthSuccessSchema,
  legacyLoginRequestSchema,
  legacyLogoutResponseSchema,
  legacyMeResponseSchema,
  legacySignupRequestSchema,
} from '../../packages/api/src/auth';

test('legacy login request schema rejects malformed email payloads', () => {
  const result = legacyLoginRequestSchema.safeParse({
    email: 'not-an-email',
    password: 'secret123',
  });

  assert.equal(result.success, false);
});

test('legacy signup request schema enforces minimum password length', () => {
  const result = legacySignupRequestSchema.safeParse({
    email: 'user@example.com',
    username: 'demo-user',
    password: '123',
  });

  assert.equal(result.success, false);
});

test('legacy auth success schema accepts the current frontend auth payload', () => {
  const result = legacyAuthSuccessSchema.safeParse({
    user: {
      id: 'user-1',
      email: 'user@example.com',
      username: 'demo-user',
      createdAt: '2026-05-19T00:00:00.000Z',
    },
  });

  assert.equal(result.success, true);
});

test('legacy me response schema requires createdAt for profile-safe auth state', () => {
  const result = legacyMeResponseSchema.safeParse({
    user: {
      id: 'user-1',
      email: 'user@example.com',
      username: 'demo-user',
    },
  });

  assert.equal(result.success, false);
});

test('legacy logout response schema validates the logout message payload', () => {
  const result = legacyLogoutResponseSchema.safeParse({
    message: 'Logged out',
  });

  assert.equal(result.success, true);
});
