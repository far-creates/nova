import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateReviewPriority,
  REVIEW_PRIORITY_FORMULA_VERSION,
} from '../../packages/domain/src/reviewPriority';

test('calculateReviewPriority produces higher urgency for weak stale items', () => {
  const now = new Date('2026-05-19T12:00:00.000Z');
  const result = calculateReviewPriority({
    now,
    lastAttemptAt: '2026-05-01T12:00:00.000Z',
    lastAccuracy: 25,
    averageRecentAccuracy: 35,
    attemptCount: 2,
    successStreak: 0,
    failureStreak: 2,
  });

  assert.ok(result.priorityScore >= 75);
  assert.equal(result.formulaVersion, REVIEW_PRIORITY_FORMULA_VERSION);
  assert.equal(result.nextReviewAt.toISOString(), '2026-05-19T16:00:00.000Z');
});

test('calculateReviewPriority lowers urgency for familiar successful items', () => {
  const now = new Date('2026-05-19T12:00:00.000Z');
  const result = calculateReviewPriority({
    now,
    lastAttemptAt: '2026-05-19T08:00:00.000Z',
    lastAccuracy: 96,
    averageRecentAccuracy: 94,
    attemptCount: 18,
    successStreak: 4,
    failureStreak: 0,
  });

  assert.ok(result.priorityScore < 20);
  assert.equal(result.nextReviewAt.toISOString(), '2026-05-22T12:00:00.000Z');
});

test('calculateReviewPriority treats never-reviewed items as due within the fallback window', () => {
  const now = new Date('2026-05-19T12:00:00.000Z');
  const result = calculateReviewPriority({
    now,
    lastAccuracy: 70,
    averageRecentAccuracy: 70,
    attemptCount: 0,
  });

  assert.ok(result.priorityScore > 0);
  assert.equal(result.nextReviewAt.toISOString(), '2026-05-21T12:00:00.000Z');
});
