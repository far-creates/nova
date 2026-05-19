import type { ContributionInput, ContributionResult } from './types';

export const CONTRIBUTION_FORMULA_VERSION = 'contribution-v1-symbolic';

function round(value: number, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function calculateContribution(input: ContributionInput): ContributionResult {
  const accuracyScore = Math.max(0, Math.min(100, input.accuracyScore ?? 0));
  const sessionLengthMinutes = Math.max(0, input.sessionLengthMinutes ?? 0);
  const streakCount = Math.max(0, input.streakCount ?? 0);
  const bonusMultiplier = Math.max(1, input.bonusMultiplier ?? 1);

  let basePoints = 0;

  switch (input.eventType) {
    case 'ATTEMPT_COMPLETED':
      basePoints = 5 + accuracyScore * 0.2;
      break;
    case 'SESSION_COMPLETED':
      basePoints = 15 + sessionLengthMinutes * 1.5;
      break;
    case 'REVIEW_COMPLETED':
      basePoints = 10 + accuracyScore * 0.15;
      break;
    case 'STREAK_AWARDED':
      basePoints = 8 + streakCount * 2;
      break;
    case 'BONUS_GRANTED':
      basePoints = 12;
      break;
  }

  const symbolicPoints = round(basePoints * bonusMultiplier);

  return {
    symbolicPoints,
    realWorldEnergyEstimate: null,
    formulaVersion: CONTRIBUTION_FORMULA_VERSION,
  };
}
