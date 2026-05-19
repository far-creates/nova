import { z } from 'zod';
import { createApiResponseSchema } from './shared';

export const profileSummaryPayloadSchema = z.object({
  totalAttempts: z.number().int().min(0),
  averageAccuracy: z.number().min(0).max(100),
  completedSessions: z.number().int().min(0),
  reviewReadyCount: z.number().int().min(0),
  symbolicContributionTotal: z.number().min(0),
});
export type ProfileSummaryPayload = z.infer<typeof profileSummaryPayloadSchema>;

export const attemptHistoryItemSchema = z.object({
  attemptId: z.string().min(1),
  audioTrackId: z.string().min(1),
  trackTitle: z.string().min(1),
  accuracyScore: z.number().min(0).max(100),
  createdAt: z.string().datetime(),
});
export type AttemptHistoryItem = z.infer<typeof attemptHistoryItemSchema>;

export const profileAttemptsQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.number().int().positive().max(100).optional(),
});
export type ProfileAttemptsQuery = z.infer<typeof profileAttemptsQuerySchema>;

export const legacyProfileQuerySchema = z.object({
  date: z.string().min(1).optional(),
  sentenceId: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional(),
});
export type LegacyProfileQuery = z.infer<typeof legacyProfileQuerySchema>;

export const legacyProfileQueryInputSchema = z.object({
  date: z.string().min(1).optional(),
  sentenceId: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
export type LegacyProfileQueryInput = z.infer<typeof legacyProfileQueryInputSchema>;

export const contributionSummaryPayloadSchema = z.object({
  symbolicPoints: z.number().min(0),
  estimatedEnergyKwh: z.number().min(0).nullable().optional(),
});
export type ContributionSummaryPayload = z.infer<
  typeof contributionSummaryPayloadSchema
>;

export const profileSummaryResponseSchema = createApiResponseSchema(
  profileSummaryPayloadSchema
);
export const profileAttemptsResponseSchema = createApiResponseSchema(
  z.object({
    items: z.array(attemptHistoryItemSchema),
    nextCursor: z.string().min(1).nullable().optional(),
  })
);
export const profileContributionResponseSchema = createApiResponseSchema(
  contributionSummaryPayloadSchema
);

export const legacyUserStatsSchema = z.object({
  totalAttempts: z.number().int().min(0),
  averageAccuracy: z.number().min(0).max(100),
  bestAccuracy: z.number().min(0).max(100),
  worstAccuracy: z.number().min(0).max(100),
  lastAttempt: z.string().nullable(),
});
export type LegacyUserStats = z.infer<typeof legacyUserStatsSchema>;

export const legacyDailySummarySchema = z.object({
  date: z.string().min(1),
  attemptsCount: z.number().int().min(0),
  averageAccuracy: z.number().min(0).max(100),
  bestAccuracy: z.number().min(0).max(100),
  worstAccuracy: z.number().min(0).max(100),
});
export type LegacyDailySummary = z.infer<typeof legacyDailySummarySchema>;

export const legacyProfileAttemptSchema = z.object({
  id: z.string().min(1),
  sentenceId: z.string().min(1),
  sentenceText: z.string().min(1),
  userText: z.string(),
  createdAt: z.string(),
});
export type LegacyProfileAttempt = z.infer<typeof legacyProfileAttemptSchema>;

export const legacySentenceOptionSchema = z.object({
  sentenceId: z.string().min(1),
  sentenceText: z.string().min(1),
});
export type LegacySentenceOption = z.infer<typeof legacySentenceOptionSchema>;

export const legacyProfileResponseSchema = z.object({
  stats: legacyUserStatsSchema,
  dailySummaries: z.array(legacyDailySummarySchema),
  attempts: z.array(legacyProfileAttemptSchema),
  attemptsTotal: z.number().int().min(0),
  sentenceOptions: z.array(legacySentenceOptionSchema),
});
export type LegacyProfileResponse = z.infer<typeof legacyProfileResponseSchema>;

export type ProfileSummaryResponse = z.infer<typeof profileSummaryResponseSchema>;
export type ProfileAttemptsResponse = z.infer<
  typeof profileAttemptsResponseSchema
>;
export type ProfileContributionResponse = z.infer<
  typeof profileContributionResponseSchema
>;
