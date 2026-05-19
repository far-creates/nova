import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  attemptSubmissionRequestSchema,
  legacyAttemptRequestSchema,
  legacyAttemptResponseSchema,
} from '../../packages/api/src/attempts';

test('legacy attempt request schema defaults saveAttempt to false', () => {
  const result = legacyAttemptRequestSchema.safeParse({
    audioTrackId: 'track-1',
    userText: 'hello world',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.saveAttempt, false);
  }
});

test('legacy attempt request schema accepts guest session context', () => {
  const result = legacyAttemptRequestSchema.safeParse({
    audioTrackId: 'track-1',
    userText: 'hello world',
    guestSessionId: 'guest-1',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.guestSessionId, 'guest-1');
    assert.equal(result.data.saveAttempt, false);
  }
});

test('legacy attempt request schema requires either sentenceId or audioTrackId', () => {
  const result = legacyAttemptRequestSchema.safeParse({
    userText: 'hello world',
  });

  assert.equal(result.success, false);
});

test('legacy attempt response schema validates current correction payloads', () => {
  const result = legacyAttemptResponseSchema.safeParse({
    sentenceId: 'sentence-1',
    audioTrackId: 'track-1',
    userText: 'hello xorld',
    correct: [0, 1, 2],
    wrong: [{ index: 3, expected: 'l', got: 'x' }],
    extra: [],
    accuracy: 75,
  });

  assert.equal(result.success, true);
});

test('future attempt submission schema validates canonical payloads', () => {
  const result = attemptSubmissionRequestSchema.safeParse({
    audioTrackId: 'track-1',
    submittedText: 'hello world',
    attemptSource: 'HERO_RANDOM',
    playbackRate: 1,
  });

  assert.equal(result.success, true);
});
