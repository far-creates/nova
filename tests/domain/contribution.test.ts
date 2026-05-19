import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateContribution,
  CONTRIBUTION_FORMULA_VERSION,
} from '../../packages/domain/src/contribution';

test('calculateContribution scores completed attempts from accuracy', () => {
  const result = calculateContribution({
    eventType: 'ATTEMPT_COMPLETED',
    accuracyScore: 80,
  });

  assert.equal(result.symbolicPoints, 21);
  assert.equal(result.realWorldEnergyEstimate, null);
  assert.equal(result.formulaVersion, CONTRIBUTION_FORMULA_VERSION);
});

test('calculateContribution scores completed sessions from duration', () => {
  const result = calculateContribution({
    eventType: 'SESSION_COMPLETED',
    sessionLengthMinutes: 10,
  });

  assert.equal(result.symbolicPoints, 30);
});

test('calculateContribution applies the multiplier and streak inputs safely', () => {
  const result = calculateContribution({
    eventType: 'STREAK_AWARDED',
    streakCount: 3,
    bonusMultiplier: 1.5,
  });

  assert.equal(result.symbolicPoints, 21);
});
