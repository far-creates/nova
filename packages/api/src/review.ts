import { z } from 'zod';
import { createApiResponseSchema } from './shared';
import { audioTrackPayloadSchema } from './tracks';

export const reviewQueueItemSchema = z.object({
  audioTrack: audioTrackPayloadSchema,
  priorityScore: z.number().min(0).max(100),
  nextReviewAt: z.string().datetime(),
  attemptCount: z.number().int().min(0),
  lastAccuracy: z.number().min(0).max(100),
});
export type ReviewQueueItem = z.infer<typeof reviewQueueItemSchema>;

export const reviewQueueQuerySchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
});
export type ReviewQueueQuery = z.infer<typeof reviewQueueQuerySchema>;

export const reviewQueueResponseSchema = createApiResponseSchema(
  z.object({
    items: z.array(reviewQueueItemSchema),
    generatedAt: z.string().datetime(),
  })
);
export type ReviewQueueResponse = z.infer<typeof reviewQueueResponseSchema>;
