import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeForScoring } from '../../packages/domain/src/normalization';

test('normalizeForScoring trims whitespace, strips trailing periods, and lowercases', () => {
  assert.equal(normalizeForScoring('  Hello World...  '), 'hello world');
});

test('normalizeForScoring preserves inner punctuation while normalizing casing', () => {
  assert.equal(normalizeForScoring('Hi, There!'), 'hi, there!');
});
