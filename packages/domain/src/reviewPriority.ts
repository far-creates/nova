import type { ReviewPriorityInput, ReviewPriorityResult } from './types';

export const REVIEW_PRIORITY_FORMULA_VERSION = 'review-priority-v1';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function calculateReviewPriority(input: ReviewPriorityInput): ReviewPriorityResult {
  const now = input.now ?? new Date();
  const lastAttemptAt = toDate(input.lastAttemptAt);
  const lastAccuracy = clamp(input.lastAccuracy ?? 0, 0, 100);
  const averageRecentAccuracy = clamp(input.averageRecentAccuracy ?? lastAccuracy, 0, 100);
  const attemptCount = Math.max(0, input.attemptCount ?? 0);
  const successStreak = Math.max(0, input.successStreak ?? 0);
  const failureStreak = Math.max(0, input.failureStreak ?? 0);

  const hoursSinceLastAttempt = lastAttemptAt
    ? Math.max(0, (now.getTime() - lastAttemptAt.getTime()) / (1000 * 60 * 60))
    : 24 * 14;

  const recencyWeight = clamp(hoursSinceLastAttempt / 24, 0, 30);
  const weaknessWeight = (100 - lastAccuracy) * 0.45;
  const consistencyWeight = (100 - averageRecentAccuracy) * 0.2;
  const failureWeight = failureStreak * 8;
  const streakRelief = successStreak * 3;
  const familiarityRelief = Math.min(attemptCount, 20) * 0.6;

  const priorityScore = Math.round(
    (recencyWeight + weaknessWeight + consistencyWeight + failureWeight - streakRelief - familiarityRelief) * 100
  ) / 100;

  const score = clamp(priorityScore, 0, 100);

  let nextReviewHours = 72;
  if (score >= 75) nextReviewHours = 4;
  else if (score >= 60) nextReviewHours = 12;
  else if (score >= 40) nextReviewHours = 24;
  else if (score >= 20) nextReviewHours = 48;

  const nextReviewAt = new Date(now.getTime() + nextReviewHours * 60 * 60 * 1000);

  return {
    priorityScore: score,
    nextReviewAt,
    formulaVersion: REVIEW_PRIORITY_FORMULA_VERSION,
  };
}
