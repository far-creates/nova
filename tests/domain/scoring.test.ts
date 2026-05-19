import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateAccuracy } from '../../packages/domain/src/scoring';

test('calculateAccuracy returns 100 for exact matches after normalization', () => {
  assert.equal(calculateAccuracy('Hello.', ' hello '), 100);
});

test('calculateAccuracy measures character-level accuracy against the reference length', () => {
  assert.equal(calculateAccuracy('hello', 'hxllo'), 80);
});

test('calculateAccuracy returns 0 when the reference is empty after normalization', () => {
  assert.equal(calculateAccuracy('...', 'hello'), 0);
});
