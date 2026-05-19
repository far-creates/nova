export type TrackLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Accent = 'BRITISH' | 'AMERICAN' | 'CANADIAN' | 'AUSTRALIAN';

export type SessionType = 'RANDOM' | 'TOPIC' | 'REVIEW';

export type AttemptSource = 'HERO_RANDOM' | 'TOPIC_SESSION' | 'REVIEW_SESSION';

export interface AttemptSnapshot {
  attemptedAt: Date | string;
  accuracyScore: number;
}

export interface ReviewPriorityInput {
  now?: Date;
  lastAttemptAt?: Date | string | null;
  lastAccuracy?: number | null;
  averageRecentAccuracy?: number | null;
  attemptCount?: number;
  successStreak?: number;
  failureStreak?: number;
}

export interface ReviewPriorityResult {
  priorityScore: number;
  nextReviewAt: Date;
  formulaVersion: string;
}

export type ContributionEventType =
  | 'ATTEMPT_COMPLETED'
  | 'SESSION_COMPLETED'
  | 'REVIEW_COMPLETED'
  | 'STREAK_AWARDED'
  | 'BONUS_GRANTED';

export interface ContributionInput {
  eventType: ContributionEventType;
  accuracyScore?: number | null;
  sessionLengthMinutes?: number | null;
  streakCount?: number | null;
  bonusMultiplier?: number | null;
}

export interface ContributionResult {
  symbolicPoints: number;
  realWorldEnergyEstimate: number | null;
  formulaVersion: string;
}

export interface CorrectionResult {
  correct: number[];
  wrong: Array<{ index: number; expected: string; got: string }>;
  extra: Array<{ index: number; char: string }>;
  accuracy: number;
}
