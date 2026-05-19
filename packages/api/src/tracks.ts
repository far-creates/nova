import { z } from 'zod';
import {
  accentSchema,
  createApiResponseSchema,
  trackLevelSchema,
} from './shared';

export const topicPayloadSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
});
export type TopicPayload = z.infer<typeof topicPayloadSchema>;

export const audioTrackPayloadSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  transcript: z.string().min(1),
  audioUrl: z.string().min(1),
  durationSeconds: z.number().nonnegative(),
  level: trackLevelSchema,
  accent: accentSchema,
  topics: z.array(topicPayloadSchema),
});
export type AudioTrackPayload = z.infer<typeof audioTrackPayloadSchema>;

export const trackQuerySchema = z.object({
  level: trackLevelSchema.optional(),
  accent: accentSchema.optional(),
  topicId: z.string().min(1).optional(),
  limit: z.number().int().positive().max(100).optional(),
});
export type TrackQuery = z.infer<typeof trackQuerySchema>;

export const legacyTrackPayloadSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  filePath: z.string().min(1),
  difficulty: z.string().min(1),
  createdAt: z.string(),
});
export type LegacyTrackPayload = z.infer<typeof legacyTrackPayloadSchema>;

export const legacyTrackListResponseSchema = z.array(legacyTrackPayloadSchema);
export type LegacyTrackListResponse = z.infer<typeof legacyTrackListResponseSchema>;

export const randomTrackResponseSchema =
  createApiResponseSchema(audioTrackPayloadSchema);
export const trackListResponseSchema = createApiResponseSchema(
  z.object({
    items: z.array(audioTrackPayloadSchema),
    total: z.number().int().min(0),
  })
);
export const topicListResponseSchema = createApiResponseSchema(
  z.object({
    items: z.array(topicPayloadSchema),
    total: z.number().int().min(0),
  })
);

export type RandomTrackResponse = z.infer<typeof randomTrackResponseSchema>;
export type TrackListResponse = z.infer<typeof trackListResponseSchema>;
export type TopicListResponse = z.infer<typeof topicListResponseSchema>;
