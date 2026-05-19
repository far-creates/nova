import { z } from 'zod';
import {
  accentSchema,
  attemptSourceSchema,
  createApiResponseSchema,
  sessionTypeSchema,
  trackLevelSchema,
} from './shared';

export const attemptSubmissionRequestSchema = z.object({
  audioTrackId: z.string().min(1),
  submittedText: z.string(),
  playbackRate: z.number().positive().max(2).optional(),
  attemptSource: attemptSourceSchema,
  practiceSessionId: z.string().min(1).optional(),
  guestSessionId: z.string().min(1).optional(),
});
export type AttemptSubmissionRequest = z.infer<
  typeof attemptSubmissionRequestSchema
>;

export const legacyAttemptRequestSchema = z
  .object({
    sentenceId: z.string().min(1).optional(),
    audioTrackId: z.string().min(1).optional(),
    userText: z.string(),
    saveAttempt: z.boolean().optional().default(false),
    guestSessionId: z.string().min(1).optional(),
  })
  .refine((value) => Boolean(value.sentenceId || value.audioTrackId), {
    message: 'Either sentenceId or audioTrackId is required.',
    path: ['audioTrackId'],
  });
export type LegacyAttemptRequest = z.infer<typeof legacyAttemptRequestSchema>;

export const attemptCorrectionTokenSchema = z.object({
  value: z.string(),
  status: z.enum(['correct', 'wrong', 'extra']),
});
export type AttemptCorrectionToken = z.infer<typeof attemptCorrectionTokenSchema>;

export const attemptResultPayloadSchema = z.object({
  attemptId: z.string().min(1),
  audioTrackId: z.string().min(1),
  accuracyScore: z.number().min(0).max(100),
  mistakeCount: z.number().int().min(0),
  correction: z.array(attemptCorrectionTokenSchema),
  transcript: z.string(),
  createdAt: z.string().datetime(),
});
export type AttemptResultPayload = z.infer<typeof attemptResultPayloadSchema>;

export const legacyCorrectionResultSchema = z.object({
  sentenceId: z.string().min(1),
  audioTrackId: z.string().min(1).nullable(),
  userText: z.string(),
  correct: z.array(z.number().int().min(0)),
  wrong: z.array(
    z.object({
      index: z.number().int().min(0),
      expected: z.string(),
      got: z.string(),
    })
  ),
  extra: z.array(
    z.object({
      index: z.number().int().min(0),
      char: z.string(),
    })
  ),
  accuracy: z.number().min(0).max(100),
});
export type LegacyCorrectionResult = z.infer<typeof legacyCorrectionResultSchema>;

export const practiceSessionStartRequestSchema = z.object({
  sessionType: sessionTypeSchema,
  level: trackLevelSchema.optional(),
  accent: accentSchema.optional(),
  topicId: z.string().min(1).optional(),
  guestSessionId: z.string().min(1).optional(),
});
export type PracticeSessionStartRequest = z.infer<
  typeof practiceSessionStartRequestSchema
>;

export const practiceSessionPayloadSchema = z.object({
  sessionId: z.string().min(1),
  sessionType: sessionTypeSchema,
  startedAt: z.string().datetime(),
});
export type PracticeSessionPayload = z.infer<typeof practiceSessionPayloadSchema>;

export const practiceSessionEndRequestSchema = z.object({
  sessionId: z.string().min(1),
  completedAt: z.string().datetime().optional(),
});
export type PracticeSessionEndRequest = z.infer<
  typeof practiceSessionEndRequestSchema
>;

export const attemptSubmissionResponseSchema =
  createApiResponseSchema(attemptResultPayloadSchema);
export const legacyAttemptResponseSchema = legacyCorrectionResultSchema;
export const practiceSessionStartResponseSchema = createApiResponseSchema(
  practiceSessionPayloadSchema
);
export const practiceSessionEndResponseSchema = createApiResponseSchema(
  z.object({
    sessionId: z.string().min(1),
    completedAt: z.string().datetime(),
  })
);

export type AttemptSubmissionResponse = z.infer<
  typeof attemptSubmissionResponseSchema
>;
export type LegacyAttemptResponse = z.infer<typeof legacyAttemptResponseSchema>;
export type PracticeSessionStartResponse = z.infer<
  typeof practiceSessionStartResponseSchema
>;
export type PracticeSessionEndResponse = z.infer<
  typeof practiceSessionEndResponseSchema
>;
