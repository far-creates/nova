import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareTexts } from '../../packages/domain/src/comparison';

test('compareTexts identifies correct, wrong, and extra characters', () => {
  const result = compareTexts('hello', 'helxo!');

  assert.deepEqual(result.correct, [0, 1, 2, 4]);
  assert.deepEqual(result.wrong, [{ index: 3, expected: 'l', got: 'x' }]);
  assert.deepEqual(result.extra, [{ index: 5, char: '!' }]);
  assert.equal(result.accuracy, 80);
});

test('compareTexts stops when input ends and does not mark missing characters as extra', () => {
  const result = compareTexts('hello', 'hel');

  assert.deepEqual(result.correct, [0, 1, 2]);
  assert.deepEqual(result.wrong, []);
  assert.deepEqual(result.extra, []);
  assert.equal(result.accuracy, 60);
});
