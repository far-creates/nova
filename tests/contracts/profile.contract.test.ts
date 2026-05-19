import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  legacyProfileQueryInputSchema,
  legacyProfileQuerySchema,
  legacyProfileResponseSchema,
} from '../../packages/api/src/profile';

test('legacy profile query schema accepts normalized client-side filters', () => {
  const result = legacyProfileQuerySchema.safeParse({
    date: '2026-05-19',
    sentenceId: 'sentence-1',
    search: 'hello',
    limit: 20,
    offset: 0,
  });

  assert.equal(result.success, true);
});

test('legacy profile query input schema coerces route query params safely', () => {
  const result = legacyProfileQueryInputSchema.safeParse({
    limit: '20',
    offset: '0',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.limit, 20);
    assert.equal(result.data.offset, 0);
  }
});

test('legacy profile query input schema rejects invalid pagination', () => {
  const result = legacyProfileQueryInputSchema.safeParse({
    limit: '-1',
    offset: '-5',
  });

  assert.equal(result.success, false);
});

test('legacy profile response schema validates the current profile payload shape', () => {
  const result = legacyProfileResponseSchema.safeParse({
    stats: {
      totalAttempts: 3,
      averageAccuracy: 82.5,
      bestAccuracy: 95,
      worstAccuracy: 60,
      lastAttempt: '2026-05-19T10:00:00.000Z',
    },
    dailySummaries: [
      {
        date: '2026-05-19',
        attemptsCount: 3,
        averageAccuracy: 82.5,
        bestAccuracy: 95,
        worstAccuracy: 60,
      },
    ],
    attempts: [
      {
        id: 'attempt-1',
        sentenceId: 'sentence-1',
        sentenceText: 'hello world',
        userText: 'hello xorld',
        createdAt: '2026-05-19T10:00:00.000Z',
      },
    ],
    attemptsTotal: 1,
    sentenceOptions: [
      {
        sentenceId: 'sentence-1',
        sentenceText: 'hello world',
      },
    ],
  });

  assert.equal(result.success, true);
});
